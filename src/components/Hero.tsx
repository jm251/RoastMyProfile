import { ArrowDown, BadgeCheck, Flame, Sparkles } from "lucide-react";

type HeroProps = {
  onStart: () => void;
};

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(236,72,153,0.22),transparent_28%),radial-gradient(circle_at_88%_16%,rgba(249,115,22,0.24),transparent_26%),linear-gradient(135deg,#fff7ed_0%,#fff_42%,#fdf4ff_100%)]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 py-8 md:min-h-[660px] md:justify-center">
        <nav className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-pink-200">
              <Flame aria-hidden="true" className="size-5" />
            </div>
            <div>
              <p className="text-base font-black tracking-tight text-slate-950">
                Roast My Profile
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Bio upgrade lab
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-3 py-2 text-xs font-bold text-pink-700 shadow-sm backdrop-blur">
            <BadgeCheck aria-hidden="true" className="size-4" />
            MVP Demo
          </span>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/75 px-4 py-2 text-sm font-bold text-orange-700 shadow-sm backdrop-blur">
              <Sparkles aria-hidden="true" className="size-4" />
              Fun profile feedback in one click
            </div>
            <h1 className="text-5xl font-black leading-[0.98] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Get roasted. Then get upgraded.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Paste your Instagram, LinkedIn, X, or dating bio and get a
              hilarious roast plus a better version you can actually use.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onStart}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-base font-black text-white shadow-xl shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-pink-200"
              >
                Roast My Profile
                <ArrowDown aria-hidden="true" className="size-5" />
              </button>
              <div className="flex h-14 items-center rounded-2xl border border-slate-200 bg-white/75 px-5 text-sm font-bold text-slate-600 shadow-sm backdrop-blur">
                No login. No database. Just better bios.
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/80 bg-white/85 p-4 shadow-2xl shadow-orange-100 backdrop-blur">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-fuchsia-600 via-pink-500 to-orange-400 p-1">
                <div className="rounded-[1.25rem] bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">
                        Sample roast
                      </p>
                      <p className="mt-1 text-lg font-black text-slate-950">
                        X / Twitter founder bio
                      </p>
                    </div>
                    <Flame
                      aria-hidden="true"
                      className="size-7 text-orange-500"
                    />
                  </div>
                  <p className="mt-6 rounded-2xl bg-slate-950 p-4 text-sm font-semibold leading-6 text-white">
                    This bio has the confidence of a keynote slide and the
                    clarity of a calendar invite titled sync.
                  </p>
                  <div className="mt-4 rounded-2xl bg-orange-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                      Better bio
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                      Building practical AI tools for busy teams. Sharing
                      startup lessons, product notes, and experiments in public.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
