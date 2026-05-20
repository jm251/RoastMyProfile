import { AlertCircle, Loader2, WandSparkles } from "lucide-react";
import type { FormEvent } from "react";
import { ExampleBios, type ExampleBio } from "@/components/ExampleBios";
import {
  MAX_PROFILE_CHARS,
  MIN_PROFILE_CHARS,
  PLATFORMS,
  TONES,
  type Platform,
  type Tone,
} from "@/lib/validation";

type ProfileFormProps = {
  error: string | null;
  isGenerating: boolean;
  loadingMessage: string;
  platform: Platform;
  profileText: string;
  tone: Tone;
  onExampleSelect: (example: ExampleBio) => void;
  onPlatformChange: (platform: Platform) => void;
  onProfileTextChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onToneChange: (tone: Tone) => void;
};

export function ProfileForm({
  error,
  isGenerating,
  loadingMessage,
  platform,
  profileText,
  tone,
  onExampleSelect,
  onPlatformChange,
  onProfileTextChange,
  onSubmit,
  onToneChange,
}: ProfileFormProps) {
  const characterCount = profileText.trim().length;
  const counterTone =
    characterCount > MAX_PROFILE_CHARS
      ? "text-red-600"
      : characterCount < MIN_PROFILE_CHARS
        ? "text-slate-500"
        : "text-emerald-700";

  return (
    <section
      id="profile-form"
      className="px-4 py-14 sm:px-6 lg:px-8"
      aria-labelledby="form-title"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="lg:pt-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-pink-600">
            Roast lab
          </p>
          <h2
            id="form-title"
            className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl"
          >
            Paste the bio. Pick the vibe. Brace gently.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The roast is aimed at the writing, not the person. The upgrade is
            built to be clear, platform-aware, and actually usable.
          </p>
          <ExampleBios disabled={isGenerating} onSelect={onExampleSelect} />
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-[2rem] border border-white bg-white/90 p-4 shadow-2xl shadow-pink-100 backdrop-blur sm:p-6"
        >
          <div>
            <label
              htmlFor="profileText"
              className="text-sm font-black text-slate-900"
            >
              Profile text
            </label>
            <textarea
              id="profileText"
              value={profileText}
              disabled={isGenerating}
              onChange={(event) => onProfileTextChange(event.target.value)}
              placeholder="Paste your bio, about section, or profile text here..."
              className="mt-3 min-h-44 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base leading-7 text-slate-950 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <span className={counterTone}>
                {characterCount}/{MAX_PROFILE_CHARS} characters
              </span>
              <span className="text-slate-500">
                Minimum {MIN_PROFILE_CHARS} characters
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black text-slate-900">
                Platform
              </span>
              <select
                value={platform}
                disabled={isGenerating}
                onChange={(event) =>
                  onPlatformChange(event.target.value as Platform)
                }
                className="mt-3 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                {PLATFORMS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-black text-slate-900">Tone</span>
              <select
                value={tone}
                disabled={isGenerating}
                onChange={(event) => onToneChange(event.target.value as Tone)}
                className="mt-3 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                {TONES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error ? (
            <div
              role="alert"
              className="mt-5 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700"
            >
              <AlertCircle aria-hidden="true" className="mt-0.5 size-5" />
              <span>{error}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isGenerating}
            className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 px-6 text-base font-black text-white shadow-xl shadow-pink-200 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-pink-200 focus:outline-none focus:ring-4 focus:ring-pink-200 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <Loader2 aria-hidden="true" className="size-5 animate-spin" />
                Generating Roast
              </>
            ) : (
              <>
                <WandSparkles aria-hidden="true" className="size-5" />
                Generate Roast
              </>
            )}
          </button>

          {isGenerating ? (
            <p className="mt-3 text-center text-sm font-black text-pink-700">
              {loadingMessage}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
