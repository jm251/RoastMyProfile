import {
  Check,
  Copy,
  Download,
  Flame,
  Lightbulb,
  RefreshCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode, type RefObject } from "react";
import { ShareCard } from "@/components/ShareCard";
import type { Platform, RoastResult } from "@/lib/validation";

type ResultsProps = {
  downloadError: string | null;
  isDownloading: boolean;
  platform: Platform;
  result: RoastResult;
  shareCardRef: RefObject<HTMLDivElement | null>;
  onDownload: () => void;
  onShareOnX: () => void;
  onTryAgain: () => void;
};

type CopyKey = "roast" | "betterBio" | "caption";

function CopyButton({
  copied,
  label,
  onClick,
}: {
  copied: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:text-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-100"
      title={label}
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4 text-emerald-600" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
      {copied ? "Copied" : label}
    </button>
  );
}

function ResultCard({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-white bg-white/90 p-5 shadow-xl shadow-slate-200/60">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-100 to-orange-100 text-pink-700">
          {icon}
        </div>
        <h3 className="text-lg font-black text-slate-950">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </article>
  );
}

export function Results({
  downloadError,
  isDownloading,
  platform,
  result,
  shareCardRef,
  onDownload,
  onShareOnX,
  onTryAgain,
}: ResultsProps) {
  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  async function copyText(key: CopyKey, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setCopyError(null);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      setCopyError("Copy failed. Select the text and copy it manually.");
    }
  }

  return (
    <section
      className="px-4 py-14 sm:px-6 lg:px-8"
      aria-labelledby="results-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-600">
              Results
            </p>
            <h2
              id="results-title"
              className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl"
            >
              Your profile survived.
            </h2>
          </div>
          <button
            type="button"
            onClick={onTryAgain}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:text-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-100"
          >
            <RefreshCcw aria-hidden="true" className="size-4" />
            Try Again
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-5">
            <ResultCard
              title="Your Roast"
              icon={<Flame aria-hidden="true" className="size-5" />}
            >
              <p className="text-base font-semibold leading-7 text-slate-700">
                {result.roast}
              </p>
              <div className="mt-4">
                <CopyButton
                  copied={copied === "roast"}
                  label="Copy Roast"
                  onClick={() => copyText("roast", result.roast)}
                />
              </div>
            </ResultCard>

            <ResultCard
              title="Better Bio"
              icon={<Sparkles aria-hidden="true" className="size-5" />}
            >
              <p className="text-base font-semibold leading-7 text-slate-700">
                {result.betterBio}
              </p>
              <div className="mt-4">
                <CopyButton
                  copied={copied === "betterBio"}
                  label="Copy Better Bio"
                  onClick={() => copyText("betterBio", result.betterBio)}
                />
              </div>
            </ResultCard>

            <ResultCard
              title="Quick Tips"
              icon={<Lightbulb aria-hidden="true" className="size-5" />}
            >
              <ol className="grid gap-3">
                {result.tips.map((tip, index) => (
                  <li
                    key={`${tip}-${index}`}
                    className="flex gap-3 text-base font-semibold leading-7 text-slate-700"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-black text-orange-700">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ol>
            </ResultCard>

            <ResultCard
              title="Share Caption"
              icon={<Share2 aria-hidden="true" className="size-5" />}
            >
              <p className="text-base font-semibold leading-7 text-slate-700">
                {result.shareCaption}
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <CopyButton
                  copied={copied === "caption"}
                  label="Copy Caption"
                  onClick={() => copyText("caption", result.shareCaption)}
                />
                <button
                  type="button"
                  onClick={onShareOnX}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  <Share2 aria-hidden="true" className="size-4" />
                  Share on X
                </button>
              </div>
            </ResultCard>

            {copyError ? (
              <p role="alert" className="text-sm font-bold text-red-600">
                {copyError}
              </p>
            ) : null}
          </div>

          <aside className="rounded-[2rem] border border-white bg-white/80 p-4 shadow-2xl shadow-orange-100 lg:sticky lg:top-6 lg:self-start">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-950">
                  Result Card
                </p>
                <p className="text-xs font-bold text-slate-500">
                  Story-ready PNG preview
                </p>
              </div>
              <button
                type="button"
                onClick={onDownload}
                disabled={isDownloading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-orange-500 px-4 text-sm font-black text-white shadow-lg shadow-pink-100 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-pink-100 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
                title="Download Result Card"
              >
                <Download aria-hidden="true" className="size-4" />
                {isDownloading ? "Saving" : "Download PNG"}
              </button>
            </div>

            <ShareCard
              ref={shareCardRef}
              platform={platform}
              result={result}
            />

            {downloadError ? (
              <p
                role="alert"
                className="mt-3 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700"
              >
                {downloadError}
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
