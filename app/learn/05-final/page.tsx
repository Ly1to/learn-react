import { profile, projects, skills, socialLinks } from "./data";
import { ProfileHeader } from "./_components/profile-header";
import { ProjectList } from "./_components/project-list";
import { SkillList } from "./_components/skill-list";

export default function FinalPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-6 sm:p-8">
      <ProfileHeader profile={profile} links={socialLinks} />

      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="mb-3 text-xl font-semibold">
          技能
        </h2>
        <SkillList items={skills} />
      </section>

      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="mb-3 text-xl font-semibold">
          项目
        </h2>
        <ProjectList items={projects} />
      </section>

      <footer className="border-t border-zinc-200 pt-4 text-sm text-zinc-500">
        本页由 Server Component 渲染，没有客户端 JS。
      </footer>
    </main>
  );
}
