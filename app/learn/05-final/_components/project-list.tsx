import { Badge } from "../../_components/badge";
import { Card } from "../../_components/card";
import { statusMeta, type Project } from "../data";

type ProjectListProps = {
  items: Project[];
};

export function ProjectList({ items }: ProjectListProps) {
  if (items.length === 0) {
    return <p className="text-zinc-500">还没有项目，等第一个作品上线再回来填。</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((project) => {
        const meta = statusMeta[project.status];

        return (
          <Card
            key={project.id}
            title={project.title}
            footer={<Badge label={meta.label} tone={meta.tone} />}
            className={project.status === "active" ? "border-blue-300" : ""}
          >
            <p>{project.description}</p>

            <ul className="mt-3 flex flex-wrap gap-1 text-xs text-zinc-500">
              {project.tags.map((tag) => (
                <li key={tag} className="rounded bg-zinc-100 px-2 py-0.5">
                  {tag}
                </li>
              ))}
            </ul>

            {project.status === "paused" && (
              <p className="mt-3 text-xs text-red-600">{meta.hint}</p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
