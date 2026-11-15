import type { Skill } from "../data";

export function SkillList({ items }: { items: Skill[] }) {
  if (items.length === 0) {
    return <p className="text-zinc-500">还没有添加技能，先写一条吧。</p>
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((skill) => (
        <li key={skill.id} className="flex items-center justify-between gap-2
          rounded border border-zinc-200 p-3
          ">
          <span>{skill.name}</span>

          <span className="flex items-center gap-2">
            {skill.level >= 4 && (
              <span className="rounded bg-green-100
                px-2 py-0.5 text-xs text-green-700
                ">
                熟练
              </span>
            )}

            <span aria-hidden="true" className="font-mono text-sm text-amber-500">
              {"★".repeat(skill.level)}
            </span>
            <span className="sr-only">熟练度 {skill.level} / 5</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
