import { z } from "zod";
import {
  roastResponseSchema,
  type GenerateRoastInput,
  type RoastResult,
} from "@/lib/validation";

const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export const GENERATION_FALLBACK_ERROR =
  "Couldn't generate roast right now. Please try again.";

export async function generateRoast(
  input: GenerateRoastInput,
): Promise<RoastResult> {
  const response = await fetch("/api/generate-roast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    throw new Error(GENERATION_FALLBACK_ERROR);
  }

  if (!response.ok) {
    const parsedError = apiErrorSchema.safeParse(payload);
    throw new Error(
      parsedError.success
        ? parsedError.data.error.message
        : GENERATION_FALLBACK_ERROR,
    );
  }

  const parsedResult = roastResponseSchema.safeParse(payload);

  if (!parsedResult.success) {
    throw new Error("Couldn't read the roast response. Please try again.");
  }

  return parsedResult.data;
}
