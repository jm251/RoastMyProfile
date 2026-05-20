import { NextResponse } from "next/server";
import OpenAI from "openai";
import { config as loadDotenv } from "dotenv";
import { zodTextFormat } from "openai/helpers/zod";
import path from "node:path";
import {
  roastResponseSchema,
  validateGenerateRoastInput,
  type GenerateRoastInput,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gpt-5.4-mini";
const GENERATION_ERROR = "Couldn't generate roast right now. Please try again.";
const LOCAL_APP_ENV_PATH = path.join(process.cwd(), "src", "app", ".env");

loadDotenv({ path: LOCAL_APP_ENV_PATH, override: false, quiet: true });

const COACH_PROMPT = `
You are a funny but safe social profile coach. Roast the user's profile in a playful way without being cruel, hateful, discriminatory, sexually explicit, or targeting protected traits. Then rewrite the bio to be clearer, more interesting, and platform-appropriate. Keep it concise and useful.

Rules:
- Roast the bio/profile style, not the person's identity.
- Do not mention race, religion, caste, disability, body, mental health, sexuality, gender identity, age, nationality, or other sensitive/protected traits.
- Do not insult the person directly.
- Avoid sexually explicit content.
- Match the selected platform and tone.
- Tips must be concrete and actionable.
- Keep all fields concise.
- Return JSON only with keys: roast, betterBio, tips, shareCaption.
`.trim();

function jsonError(message: string, status: number, code: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function buildUserPrompt(input: GenerateRoastInput) {
  return `
Platform: ${input.platform}
Tone: ${input.tone}

Profile text:
"""
${input.profileText}
"""

Generate:
1. A funny roast of the profile style.
2. A better rewritten bio for the selected platform.
3. Exactly three quick improvement tips.
4. A short share caption.
`.trim();
}

function extractJsonObject(content: string) {
  const trimmed = content.trim();
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(unfenced);
  } catch {
    const firstBrace = unfenced.indexOf("{");
    const lastBrace = unfenced.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      throw new Error("No JSON object found in model output.");
    }

    return JSON.parse(unfenced.slice(firstBrace, lastBrace + 1));
  }
}

async function callFastRouter(input: GenerateRoastInput) {
  const apiKey = process.env.FASTROUTER_API_KEY;
  const apiUrl = process.env.FASTROUTER_API_URL;
  const model = process.env.FASTROUTER_MODEL;

  if (!apiKey || !apiUrl || !model) {
    return null;
  }

  const body = {
    model,
    messages: [
      {
        role: "system",
        content: COACH_PROMPT,
      },
      {
        role: "user",
        content: buildUserPrompt(input),
      },
    ],
    temperature: 0.8,
    max_tokens: 700,
    response_format: { type: "json_object" },
  };

  let response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok && response.status === 400) {
    const retryBody = {
      model: body.model,
      messages: body.messages,
      temperature: body.temperature,
      max_tokens: body.max_tokens,
    };

    response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(retryBody),
    });
  }

  if (!response.ok) {
    console.error("FastRouter generation failed.", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("FastRouter request failed.");
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    console.error("FastRouter returned an unexpected response shape.");
    throw new Error("FastRouter response shape was invalid.");
  }

  const parsedJson = extractJsonObject(content);
  const parsed = roastResponseSchema.safeParse(parsedJson);

  if (!parsed.success) {
    console.error("FastRouter returned an invalid roast payload.", parsed.error);
    throw new Error("FastRouter JSON payload was invalid.");
  }

  return parsed.data;
}

async function callOpenAI(input: GenerateRoastInput) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const openai = new OpenAI({ apiKey });

  const response = await openai.responses.parse({
    model: MODEL,
    instructions: COACH_PROMPT,
    input: [
      {
        role: "user",
        content: buildUserPrompt(input),
      },
    ],
    max_output_tokens: 700,
    text: {
      format: zodTextFormat(roastResponseSchema, "roast_my_profile_result"),
    },
  });

  const parsed = roastResponseSchema.safeParse(response.output_parsed);

  if (!parsed.success) {
    console.error("OpenAI returned an invalid roast payload.", parsed.error);
    throw new Error("OpenAI JSON payload was invalid.");
  }

  return parsed.data;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Send a valid JSON request body.", 400, "INVALID_JSON");
  }

  const validation = validateGenerateRoastInput(body);

  if (!validation.success) {
    return jsonError(validation.message, 400, validation.code);
  }

  const hasFastRouterConfig = Boolean(
    process.env.FASTROUTER_API_KEY &&
      process.env.FASTROUTER_API_URL &&
      process.env.FASTROUTER_MODEL,
  );
  const hasOpenAIConfig = Boolean(process.env.OPENAI_API_KEY);

  if (!hasFastRouterConfig && !hasOpenAIConfig) {
    console.error(
      `No supported AI provider is configured. Expected FASTROUTER_API_KEY, FASTROUTER_API_URL, and FASTROUTER_MODEL in ${LOCAL_APP_ENV_PATH}.`,
    );
    return jsonError(GENERATION_ERROR, 500, "SERVER_CONFIG_ERROR");
  }

  try {
    const result =
      (await callFastRouter(validation.data)) ??
      (await callOpenAI(validation.data));

    if (!result) {
      return jsonError(GENERATION_ERROR, 500, "SERVER_CONFIG_ERROR");
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Roast generation failed.", error);
    return jsonError(GENERATION_ERROR, 502, "AI_GENERATION_FAILED");
  }
}
