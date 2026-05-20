import { z } from "zod";

export const MIN_PROFILE_CHARS = 20;
export const MAX_PROFILE_CHARS = 800;

export const PLATFORMS = [
  "Instagram",
  "LinkedIn",
  "X / Twitter",
  "Dating App",
  "Other",
] as const;

export const TONES = [
  "Savage but funny",
  "Light roast",
  "Professional",
  "Flirty",
  "Gen Z meme style",
] as const;

export type Platform = (typeof PLATFORMS)[number];
export type Tone = (typeof TONES)[number];

export type GenerateRoastInput = {
  profileText: string;
  platform: Platform;
  tone: Tone;
};

export const roastResponseSchema = z
  .object({
    roast: z.string().trim().min(1).max(520),
    betterBio: z.string().trim().min(1).max(720),
    tips: z.array(z.string().trim().min(1).max(180)).length(3),
    shareCaption: z.string().trim().min(1).max(280),
  })
  .strict();

export type RoastResult = z.infer<typeof roastResponseSchema>;

const rawRequestSchema = z
  .object({
    profileText: z.string(),
    platform: z.string(),
    tone: z.string(),
  })
  .strict();

type ValidInput =
  | { success: true; data: GenerateRoastInput }
  | { success: false; code: string; message: string };

export function isPlatform(value: string): value is Platform {
  return (PLATFORMS as readonly string[]).includes(value);
}

export function isTone(value: string): value is Tone {
  return (TONES as readonly string[]).includes(value);
}

export function validateGenerateRoastInput(input: unknown): ValidInput {
  const parsed = rawRequestSchema.safeParse(input);

  if (!parsed.success) {
    const missingProfileText = parsed.error.issues.some(
      (issue) => issue.path[0] === "profileText",
    );
    const missingPlatform = parsed.error.issues.some(
      (issue) => issue.path[0] === "platform",
    );
    const missingTone = parsed.error.issues.some(
      (issue) => issue.path[0] === "tone",
    );

    if (missingProfileText) {
      return {
        success: false,
        code: "MISSING_PROFILE_TEXT",
        message: "Paste your profile text first.",
      };
    }

    if (missingPlatform) {
      return {
        success: false,
        code: "INVALID_PLATFORM",
        message: "Choose a supported platform.",
      };
    }

    if (missingTone) {
      return {
        success: false,
        code: "INVALID_TONE",
        message: "Choose a supported roast tone.",
      };
    }

    return {
      success: false,
      code: "INVALID_REQUEST",
      message: "Send profile text, platform, and tone to generate a roast.",
    };
  }

  const profileText = parsed.data.profileText.trim();

  if (profileText.length < MIN_PROFILE_CHARS) {
    return {
      success: false,
      code: "PROFILE_TEXT_TOO_SHORT",
      message: `Paste at least ${MIN_PROFILE_CHARS} characters so there is enough to roast.`,
    };
  }

  if (profileText.length > MAX_PROFILE_CHARS) {
    return {
      success: false,
      code: "PROFILE_TEXT_TOO_LONG",
      message: `Keep it under ${MAX_PROFILE_CHARS} characters for a sharper roast.`,
    };
  }

  if (!isPlatform(parsed.data.platform)) {
    return {
      success: false,
      code: "INVALID_PLATFORM",
      message: "Choose a supported platform.",
    };
  }

  if (!isTone(parsed.data.tone)) {
    return {
      success: false,
      code: "INVALID_TONE",
      message: "Choose a supported roast tone.",
    };
  }

  return {
    success: true,
    data: {
      profileText,
      platform: parsed.data.platform,
      tone: parsed.data.tone,
    },
  };
}
