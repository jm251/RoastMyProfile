import { BriefcaseBusiness, Camera, Heart, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Platform } from "@/lib/validation";

export type ExampleBio = {
  id: string;
  label: string;
  platform: Platform;
  text: string;
};

const examples: ExampleBio[] = [
  {
    id: "instagram-creator",
    label: "Instagram creator",
    platform: "Instagram",
    text: "Lifestyle creator sharing coffee runs, travel snaps, outfit ideas, and tiny reminders to romanticize your errands.",
  },
  {
    id: "linkedin-student",
    label: "LinkedIn student",
    platform: "LinkedIn",
    text: "Computer science student passionate about web development, teamwork, and learning new technologies through hands-on projects.",
  },
  {
    id: "dating-app",
    label: "Dating app bio",
    platform: "Dating App",
    text: "Dog person, weekend explorer, amateur pasta critic, and always looking for the best playlist for a long drive.",
  },
  {
    id: "x-founder",
    label: "X founder bio",
    platform: "X / Twitter",
    text: "Building productivity tools for modern teams. Sharing startup lessons, product experiments, and the occasional spicy take.",
  },
];

const iconMap: Record<string, LucideIcon> = {
  "Instagram creator": Camera,
  "LinkedIn student": BriefcaseBusiness,
  "Dating app bio": Heart,
  "X founder bio": Rocket,
};

type ExampleBiosProps = {
  disabled?: boolean;
  onSelect: (example: ExampleBio) => void;
};

export function ExampleBios({ disabled = false, onSelect }: ExampleBiosProps) {
  return (
    <div className="mt-6">
      <p className="text-sm font-black text-slate-800">Example bios</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {examples.map((example) => {
          const Icon = iconMap[example.label];

          return (
            <button
              type="button"
              key={example.id}
              disabled={disabled}
              onClick={() => onSelect(example)}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/85 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-100 focus:outline-none focus:ring-4 focus:ring-pink-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-100 to-orange-100 text-pink-700">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-black text-slate-950">
                  {example.label}
                </span>
                <span className="block text-xs font-semibold text-slate-500">
                  Fill form with sample text
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
