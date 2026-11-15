import type { BadgeTone } from "../_components/badge";

export type Level = 1 | 2 | 3 | 4 | 5;

export type Skill = { id: string; name: string; level: Level };

export type ProjectStatus = "active" | "done" | "paused";

export type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  initials: string;
  headline: string;
  bio: string;
};

export const profile: Profile = {
  name: "LycOor",
  initials: "YN",
  headline: "前端学习者，正在把代码变成页面",
  bio: "目前在学 React，喜欢折腾自托管服务。这是阶段 1 的结业作业。",
}

export const socialLinks: SocialLink[] = [
  { id: "github", label: "Github", href: "https://github.com/" },
  { id: "blog", label: "博客", href: "https://example.com/" }
];

export const skills: Skill[] = [
  { id: "html", name: "HTML / CSS", level: 4 },
  { id: "ts", name: "TypeScript", level: 3 },
  { id: "react", name: "React", level: 2 },
  { id: "tw", name: "Tailwind CSS", level: 3 },
];

export const projects: Project[] = [
  {
    id: "learn-react",
    title: "learn-react",
    description: "这份学习仓库，记录每一课的练习。",
    status: "active",
    tags: ["React", "Next.js"],
  },
  {
    id: "openwrt",
    title: "OpenWrt",
    description: "软路由折腾记录。",
    status: "done",
    tags: ["网络"],
  },
  {
    id: "docker",
    title: "Docker",
    description: "自托管服务的容器编排。",
    status: "paused",
    tags: ["自托管"],
  },
];

export const statusMeta: Record<
  ProjectStatus,
  { label: string; tone: BadgeTone; hint: string }
> = {
  active: { label: "进行中", tone: "gray", hint: "正在做，可能随时更新。" },
  done: { label: "已完成", tone: "green", hint: "告一段落，可以展示。" },
  paused: { label: "暂停", tone: "red", hint: "暂时搁置，别催。" },
}
