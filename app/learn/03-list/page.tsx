import { Badge, type BadgeTone } from "../_components/badge";
import { Card } from "../_components/card";

type Skill = { id: string; name: string; level: 1 | 2 | 3 | 4 | 5 };

const skills: Skill[] = [
  { id: "html", name: "HTML / CSS", level: 4 },
  { id: "ts", name: "TypeScript", level: 3 },
  { id: "react", name: "React", level: 2 },
  { id: "tw", name: "Tailwind CSS", level: 3 },
];

const sortedSkills = skills.toSorted((a, b) => b.level - a.level);

type ProjectStatus = "active" | "done" | "paused";

type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
};

const projects: Project[] = [
  { id: "learn-react", title: "learn-react", description: "这份学习仓库", status: "active" },
  { id: "openwrt", title: "OpenWrt", description: "软路由折腾记录", status: "done" },
  { id: "docker", title: "Docker", description: "自托管服务", status: "paused" },
];

const statusMeta: Record<ProjectStatus, { label: string; tone: BadgeTone }> = {
  active: { label: "进行中", tone: "gray" },
  done: { label: "已完成", tone: "green" },
  paused: { label: "暂停", tone: "red" },
};

function SkillItem({ skill }: { skill: Skill }) {
  return (
    <li className="flex items-center justify-between rounded border border-zinc-200 p-2">
      <span>{skill.name}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-amber-500" aria-hidden="true">
          {"★".repeat(skill.level)}
          <span className="text-zinc-300">{"☆".repeat(5 - skill.level)}</span>
        </span>
      </span>
    </li>
  );
}

export default function ListPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 p-8">
      <h1 className="text-3xl font-semibold">列表练习</h1>

      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="mb-3 text-xl font-semibold">
          技能
        </h2>
        <ul className="space-y-2">
          {sortedSkills.map((skill) => (
            <SkillItem key={skill.id} skill={skill} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="mb-3 text-xl font-semibold">
          项目
        </h2>
        <div className="space-y-4">
          {projects.map((project) => {
            const meta = statusMeta[project.status];

            return (
              <Card
                key={project.id}
                title={project.title}
                footer={<Badge label={meta.label} tone={meta.tone} />}
              >
                <p>{project.description}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
