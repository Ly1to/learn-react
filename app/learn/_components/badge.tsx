export type BadgeTone = "green" | "red" | "gray";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

const toneClass: Record<BadgeTone, string> = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-zinc-100 text-zinc-700",
};

export function Badge({ label, tone = "gray" }: BadgeProps) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs ${toneClass[tone]}`}>
      {label}
    </span>
  );
}
