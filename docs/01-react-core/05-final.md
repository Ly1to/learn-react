# 05 · 阶段结业作业：静态个人主页

> 所属阶段：[阶段总览](./README.md)（React 基础）
> 状态：✅ 已就绪
> 预计：1~2 天（4~6 小时）· 练习文件：`app/learn/05-final/`
> 前置：[01-jsx.md](./01-jsx.md) ~ [04-conditional.md](./04-conditional.md)
> 新知识点：**没有**。这一课只做一件事——把前四课合起来用。

## 一、作业目标

做一张**纯展示**的个人主页：没有按钮、没有输入框、没有请求。数据是写死的常量，页面在服务端渲染成 HTML 就结束。

具体要求（也是评分标准）：

- 一个页面里同时用上 **组件、props、`children`、列表 `map` + `key`、三种条件渲染、模板字符串类名**。
- 结构清晰：数据、组件、组合三者分开，不写成一个 300 行的 `page.tsx`。
- 语义化 + 基础无障碍：`h1` 只有一个，每个 `section` 有标题且用 `aria-labelledby` 关联，装饰性元素对屏幕阅读器隐藏。
- 没有 `any`、没有 `"use client"`、没有 `useState`、没有 `useEffect`、控制台 0 报错 0 警告。

> 为什么强调「没有交互」：Next 16 默认所有组件都是 Server Component。这个页面不往浏览器发一行组件 JS，你写的是「数据 → HTML」的映射。阶段 2 加交互时，再回头看这个页面的差别，比任何解释都直观。

## 二、需求规格（做到这些就算完成）

### 1. 头部 `header`

- 头像占位：一个圆形色块 + 姓名首字母（不要用外部图片，避免图片配置问题）。
- `<h1>` 显示名字，只有这一个 `h1`。
- 一句话简介 + 一段自我介绍。
- 社交链接列表：`map` 渲染 `<a>`，带 `key`；数组为空时整块不渲染。

### 2. 技能区 `section`

- `map` 渲染技能名 + 熟练度（1~5 星，或用条形）。
- 熟练度用联合类型 `1 | 2 | 3 | 4 | 5`，不要用 `number`。
- 熟练度 ≥ 4 时额外显示一个「熟练」标签（`&&` 短路）。
- 技能数组为空时显示空状态文案（提前 `return`）。

### 3. 项目区 `section`

- `map` 渲染 [02 课](./02-props.md) / [03 课](./03-list.md) 的共用 `Card`，`key` 加在 `Card` 上。
- 每张卡：标题（`Card` 的 `title`）、描述（`children`）、状态（`Card` 的 `footer` + `Badge`）。
- 状态用 `Record<ProjectStatus, { label; tone; hint }>` 映射，不要写三元链。
- `paused` 状态额外显示 `hint` 提示。
- 卡片边框随状态变化（`active` 时变蓝）→ 用三元 / 模板字符串拼 `className`。
- 项目数组为空时显示空状态。

### 4. 页面级

- 数据全部是文件顶部（或 `data.ts`）的常量，不请求接口。
- 组件数 ≥ 3，`page.tsx` 本体 < 80 行。
- 窄屏单列，`sm` 以上两列（`grid gap-4 sm:grid-cols-2`）。
- 底部一句 footer，可写「本页为 Server Component，无客户端 JS」。

### 5. 交作业前的硬性检查

```bash
pnpm lint                 # 必须通过
pnpm exec tsc --noEmit    # 必须通过
rg -n 'use client|useState|useEffect|: any' app/learn/05-final   # 应该没有任何输出
```

## 三、先设计数据，再写界面

新手最容易犯的错是「先摆 div，再往里塞文字」，结果数据和结构缠在一起。正确顺序是：**先想清楚有哪些实体、每个实体有哪些字段，再决定长什么样。**

本页面只有四个实体：

| 实体 | 字段 | 用途 |
| --- | --- | --- |
| `Profile` | `name` / `initials` / `headline` / `bio` | 头部 |
| `Skill` | `id` / `name` / `level` | 技能列表 |
| `Project` | `id` / `title` / `description` / `status` / `tags` | 项目卡片 |
| `SocialLink` | `id` / `label` / `href` | 社交链接 |

两个约定要养成：

1. **`id` 永远是稳定的业务字符串**（`"html"`、`"learn-react"`），不用数组下标。原因见 [03 课](./03-list.md)：下标会随排序/增删变化，`key` 就失效了。
2. **有限取值用联合类型**（`status: "active" | "done" | "paused"`），让 TypeScript 帮你把 `Record` 映射表补全，也顺手消灭一批拼写错误。

`data.ts` 骨架：

```ts
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

export type SocialLink = { id: string; label: string; href: string };

export type Profile = {
  name: string;
  initials: string;
  headline: string;
  bio: string;
};
```

> 先只写类型、不写数据也能跑通——TypeScript 会告诉你哪些常量还缺字段。这就是「类型先行」的好处。

## 四、组件拆分

```
app/learn/05-final/
├── page.tsx                    # 只做组合：<ProfileHeader /> + 两个 section，< 80 行
├── data.ts                     # 类型 + 四组常量 + statusMeta 映射表
└── _components/
    ├── profile-header.tsx      # 头像 + h1 + 简介 + 社交链接
    ├── skill-list.tsx          # 技能列表 + 空状态
    └── project-list.tsx        # Card 列表 + 状态 Badge + 空状态
```

为什么这样拆：

- `page.tsx` 是「目录」，读它就能知道页面有哪几块，不需要滚动 200 行。
- 每个组件只接收自己需要的 props（`SkillList` 拿 `items`，不需要知道 `profile`），符合 [02 课](./02-props.md) 的「只传该传的」。
- 空状态判断放在列表组件内部（数据为空是列表自己的事），页面级不用关心。

> **不想拆文件也可以**：三个组件写在 `page.tsx` 里同样算「组件数 ≥ 3」，但数据必须挪到 `data.ts`，否则很难压到 80 行以内。先跑通，再拆分，别在第一步就纠结目录。

目录名用**小写短横线**（`profile-header.tsx`），组件名用**大驼峰**（`ProfileHeader`）。这是本仓库的约定，`app/learn/_components/` 里的 `card.tsx` / `badge.tsx` 也是这个风格。

## 五、分步实现

每完成一步都刷新 `http://localhost:3000/learn/05-final` 看一眼。**一次只加一块**，出错时才知道是谁的问题。

### 第 0 步：建目录，先拿到一个能打开的空页面

```bash
mkdir -p app/learn/05-final/_components
```

```tsx
// app/learn/05-final/page.tsx
export default function FinalPage() {
  return <main className="mx-auto max-w-3xl p-8">个人主页</main>;
}
```

能打开再往下。打不开就先解决 404 —— 99% 是文件名写成了 `page.ts` 或目录名拼错。

### 第 1 步：写 `data.ts`（类型 + 数据 + 状态映射）

把上面第三节的类型补上常量。数据先用真假混合的短文本，**别花时间编简历**：

```ts
export const profile: Profile = {
  name: "你的名字",
  initials: "YN",
  headline: "前端初学者 · 正在把数据变成界面",
  bio: "目前在学 React，喜欢折腾自托管服务。这是阶段 1 的结业作业。",
};

export const socialLinks: SocialLink[] = [
  { id: "github", label: "GitHub", href: "https://github.com/" },
  { id: "blog", label: "博客", href: "https://example.com/" },
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
};
```

写完立刻 `pnpm exec tsc --noEmit`：`statusMeta` 少一个状态会直接报错，这是 `Record` + 联合类型的价值。空数组测试留到第 6 步。

### 第 2 步：`ProfileHeader`

先从最简单的组件开始：只用 props，不涉及 `children`：

```tsx
// app/learn/05-final/_components/profile-header.tsx
import type { Profile, SocialLink } from "../data";

type ProfileHeaderProps = {
  profile: Profile;
  links: SocialLink[];
};

export function ProfileHeader({ profile, links }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-zinc-200 pb-8 sm:flex-row sm:items-center">
      <div
        aria-hidden="true"
        className="flex size-20 shrink-0 items-center justify-center rounded-full bg-zinc-200 font-mono text-2xl text-zinc-600"
      >
        {profile.initials}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{profile.name}</h1>
        <p className="text-zinc-600">{profile.headline}</p>
        <p className="max-w-prose text-sm text-zinc-500">{profile.bio}</p>

        {links.length > 0 && (
          <ul className="flex flex-wrap gap-3 pt-1 text-sm">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  className="text-blue-600 underline-offset-4 hover:underline"
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
```

要点：

- 头像纯装饰 → `aria-hidden="true"`，否则屏幕阅读器会把 `YN` 读成一段莫名其妙的内容。
- 首字母用 `initials` 而不是 `name.slice(0, 1)`：中文名首字母未必是第一个字，交给数据决定。
- 链接列表用 `links.length > 0 && ...`，**不是** `links.length && ...`（[04 课](./04-conditional.md) 的 `0` 坑）。
- 外链 `href` 用常量里的值，别把 URL 写两遍。

### 第 3 步：`SkillList`（空状态 + `&&` + 提前 return）

```tsx
// app/learn/05-final/_components/skill-list.tsx
import type { Skill } from "../data";

type SkillListProps = {
  items: Skill[];
};

export function SkillList({ items }: SkillListProps) {
  if (items.length === 0) {
    return <p className="text-zinc-500">还没有添加技能，先写一条吧。</p>;
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((skill) => (
        <li
          key={skill.id}
          className="flex items-center justify-between gap-2 rounded border border-zinc-200 p-3"
        >
          <span>{skill.name}</span>

          <span className="flex items-center gap-2">
            {skill.level >= 4 && (
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                熟练
              </span>
            )}
            <span className="font-mono text-sm text-amber-500" aria-hidden="true">
              {"★".repeat(skill.level)}
              <span className="text-zinc-300">{"☆".repeat(5 - skill.level)}</span>
            </span>
            <span className="sr-only">熟练度 {skill.level} / 5</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
```

要点：

- 空状态用**提前 `return`**，因为它针对整个列表；如果只是列表旁边加一句提示，才用三元。
- 星星本身是装饰，`aria-hidden` + `sr-only` 文字，屏幕阅读器读「熟练度 4 / 5」而不是「四颗星」。
- `"★".repeat(skill.level)` 是表达式，可以直接放进 `{}`。
- `sr-only` 是 Tailwind 内置类，只对屏幕阅读器可见。

### 第 4 步：`ProjectList`（复用 `Card` / `Badge` + 模板字符串 + 映射表）

```tsx
// app/learn/05-final/_components/project-list.tsx
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
```

要点：

- `key` 加在 `Card` 上（`map` 返回的最外层元素），不是加在 `Card` 内部的 `<article>` 上。
- `footer` 是 [02 课](./02-props.md) 学的 **ReactNode 插槽**，传 `<Badge />` 而不是字符串。
- `meta` 在 `map` 回调里算一次，下面直接用，避免重复查表。
- 状态边框用模板字符串 / 三元拼类名。**类名必须是完整字面量**：`"border-blue-300"` 能被 Tailwind 扫到，`border-${tone}-300` 不能。
- `tags` 的 `key={tag}` 可以，因为演示数据里标签不重复。真实项目里标签可能重名，这时给 `tag` 配一个 `id`。

### 第 5 步：`page.tsx` 组装

```tsx
// app/learn/05-final/page.tsx
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
```

数一下：`page.tsx` 约 28 行，离 80 行上限很远——因为数据、组件、映射表都在别处。这就是拆分的目的。

### 第 6 步：打磨（这一步才决定「像不像作品」）

1. **空数据测试**：把 `skills` 或 `projects` 临时改成 `[]`，确认空状态文案出现，页面不塌。再改成 `[{ ... }]` 单条，确认布局正常。
2. **窄屏**：把浏览器宽度拉到 375px，确认头部从横排变竖排、技能/项目变单列、没有横向滚动条。
3. **键盘**：`Tab` 走一遍，只有社交链接能聚焦（本页没有按钮，这是正常的）。
4. **语义**：用浏览器 DevTools 的 Elements 面板看一眼，`header` / `main` / `section` / `footer` 都在，`h1` 只有一个，`h2` 两个。
5. **控制台**：0 error、0 warning。出现 `Each child in a list should have a unique "key"` 就回去补 `key`。
6. **真数据**：把 `profile` 改成你自己的名字和介绍，链接换成真实地址（或删掉 `socialLinks` 测空状态）。作业交之前，页面上不该再出现「你的名字」。

## 六、参考实现（写完再看）

先自己写完，再对照。**直接抄会跳过所有该踩的坑。**

<details>
<summary>展开：四个文件的完整代码</summary>

`data.ts`：

```ts
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

export type SocialLink = { id: string; label: string; href: string };

export type Profile = {
  name: string;
  initials: string;
  headline: string;
  bio: string;
};

export const profile: Profile = {
  name: "你的名字",
  initials: "YN",
  headline: "前端初学者 · 正在把数据变成界面",
  bio: "目前在学 React，喜欢折腾自托管服务。这是阶段 1 的结业作业。",
};

export const socialLinks: SocialLink[] = [
  { id: "github", label: "GitHub", href: "https://github.com/" },
  { id: "blog", label: "博客", href: "https://example.com/" },
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
};
```

`page.tsx`、`_components/profile-header.tsx`、`_components/skill-list.tsx`、`_components/project-list.tsx`：与第 2~5 步的代码完全一致，不再重复。

</details>

## 七、五课知识对照表

交付前逐行自查，每一行都要求在代码里找到实际使用的位置：

| 来自 | 知识点 | 在本页面里应该出现在 |
| --- | --- | --- |
| 01 | JSX、`{}` 表达式、`className` | 所有组件 |
| 01 | 语义化标签（`header` / `main` / `section` / `footer`） | `page.tsx` + `ProfileHeader` |
| 01 | 单个 `h1`、标题层级 | 头部 + 两个 `h2` |
| 02 | `type XxxProps` 定义 props | 三个组件的 props |
| 02 | `children` | `Card` 包裹项目描述 |
| 02 | ReactNode 插槽（`footer`） | `Card footer={<Badge />}` |
| 02 | 可选 prop（`tone?` / `className?`） | `Badge` / `Card` |
| 03 | `map` + 稳定 `key` | 技能、项目、标签、社交链接 |
| 03 | 列表项抽成组件 | 技能项 / 项目卡 |
| 03 | 不可变（需要排序时用 `toSorted`） | 可选进阶 |
| 04 | 三元 | `ProjectList` 里按 `status` 切边框类名 |
| 04 | `&&` 短路 | 「熟练」标签、`paused` 提示、`links.length > 0` |
| 04 | 提前 `return`（空状态） | `SkillList` / `ProjectList` |
| 04 | `Record` 状态映射表 | `statusMeta` |
| 04 | 模板字符串拼类名 | `ProjectList` 的 `className` |

三种条件渲染写法**各至少一处**，并且能说出为什么这里选这种写法。

## 八、验收与评分

### 功能验收（及格线）

- [ ] `/learn/05-final` 可访问，控制台 0 报错 0 警告
- [ ] 头部有头像占位、`h1` 名字、简介、社交链接
- [ ] 技能列表由 `map` 渲染，每条有 `key`，熟练度可视化
- [ ] 项目卡片复用 `Card` + `Badge`，状态文案/颜色随数据变化
- [ ] 技能或项目为空时，对应区域显示空状态而不是空白
- [ ] 三种条件渲染各至少一处；模板字符串拼类名至少一处
- [ ] 数据是常量，无接口请求、无 `"use client"`、无 `any`
- [ ] `pnpm lint` 与 `pnpm exec tsc --noEmit` 通过

### 质量评分（满分 100）

| 维度 | 分值 | 扣分点 |
| --- | --- | --- |
| 需求完整 | 40 | 少一块内容每项 −5；空状态缺失 −5；状态映射写成三元链 −5 |
| 组件拆分 | 20 | `page.tsx` 超 80 行 −10；组件少于 3 个 −10；数据与视图混在一个文件 −5 |
| 类型质量 | 15 | 出现 `any` −15；`level: number` −5；`status: string` −5 |
| 语义 / 无障碍 | 15 | 多个 `h1` −5；`section` 无标题 −5；装饰元素未隐藏 −3；链接无文本 −2 |
| 响应式 | 10 | 375px 下横向滚动 −10；`sm` 断点无效 −5 |

### 加分项（不设上限，但别为了加分牺牲可读性）

- 技能按 `level` 用 `toSorted` 排序后再渲染。
- 项目卡片按状态分组显示，每组有自己的小标题。
- 暗色模式（`dark:` 变体）。
- 用 `next/image` 换掉首字母头像（需要准备图片）。

## 九、常见错误对照

| 报错 / 现象 | 原因 | 修法 |
| --- | --- | --- |
| 页面报 `useState is not defined` / 白屏 | 还没到阶段 2 就用了 hook，或忘了 `import { useState } from "react"` | 本阶段不需要 hook，先删干净 |
| `Each child in a list should have a unique "key"` | `map` 最外层没 `key` | `Card` / `<li>` 上加 `key={item.id}` |
| 页面出现多余的 `0` | `{links.length && ...}` | 改 `links.length > 0 && ...` |
| `Objects are not valid as a React child` | 把 `profile` 整个塞进 `{}` | 取具体字段：`profile.name` |
| `Cannot find module '../data'` | 相对路径层级错 | `_components/` 下引用是 `../data`，引用共用组件是 `../../_components/card` |
| `Property 'hint' does not exist` | `statusMeta` 用了 `Record<string, ...>` | 用 `Record<ProjectStatus, ...>` |
| `Type '"published"' is not assignable` | 联合类型里没这个值 | 对齐 `ProjectStatus` 的取值 |
| 状态 Badge 全是灰色 | `tone` 没传或键名拼错 | 检查 `tone: meta.tone` 与 `Record` 的键 |
| Tailwind 条件类名不生效 | 写了 `border-${tone}-300` | 写完整字面量，或查映射表 |
| 窄屏出现横向滚动条 | 固定宽度（`w-[600px]`）或 `min-w` | 用 `max-w-3xl` + `w-full` / grid 自适应 |
| 空状态永远不出现 | 判断写 `!items`（空数组是 truthy） | `items.length === 0` |
| 屏幕阅读器读出乱码 | 装饰性首字母/星星没隐藏 | `aria-hidden="true"` + `sr-only` 替代文本 |
| `Warning: validateDOMNesting` | `section` 直接嵌在 `p` 里 | 调整标签嵌套 |
| `section` 读不出标题 / 屏幕阅读器跳过该区块 | `aria-labelledby` 的值与 `h2` 的 `id` 写得不一致 | 两边用**同一个字符串**（如 `skills-heading`），改完刷新检查 |

## 十、自测题

1. 这个页面为什么完全不需要 `"use client"`？加了会多出什么成本？
2. 为什么把类型和常量放 `data.ts`，而不是塞在 `page.tsx` 顶部？
3. `key` 为什么不能换成 `map` 的第二个参数 `index`？举一个本页面里会出问题的操作。
4. `{socialLinks.length && <ul>…</ul>}` 在 `socialLinks` 为空时渲染出什么？为什么？
5. 技能空状态为什么用提前 `return`，而不是三元？如果只想在列表上方加一句提示，该怎么写？
6. `statusMeta` 为什么用 `Record<ProjectStatus, ...>`，而不是 `if` / `else` 或三元链？
7. `Card` 的 `footer` 传的是 `<Badge />`，这属于哪一课的哪个知识点？能改成 `footer="已完成"` 吗？
8. 为什么 `className={\`border ${isActive ? "border-blue-300" : ""}\`}` 能生效，而 `border-${color}-300` 不行？
9. 如果给项目加一个「按状态筛选」的功能，本页面的哪个部分必须改？改了之后还能算 Server Component 吗？
10. 面试官问「你这个页面数据怎么流动的」，用一句话回答。

<details>
<summary>参考答案</summary>

1. 页面没有状态、事件、浏览器 API，渲染结果只由常量决定，服务端算完直接出 HTML。加了 `"use client"` 会把组件及其依赖打进浏览器包，增加下载/解析成本，且失去 RSC 直出 HTML 的优势。
2. 数据与视图分离：`page.tsx` 只负责组合，读起来是目录；数据改动不会碰组件逻辑；也才能把 `page.tsx` 控制在 80 行内。类型放数据旁边，import 一处即可。
3. `index` 随排序/筛选/增删变化，React 会按位置复用 DOM，导致状态、焦点、动画错位。本页面若用 `toSorted` 按熟练度排序，`index` 对应的技能就全变了，`key` 失效。用稳定的业务 `id`。
4. 渲染 `0`。`&&` 返回左值，`0` 是 React 会渲染的数字。改 `socialLinks.length > 0 && ...`。
5. 空状态针对整个列表组件——没有数据时列表根本不该存在，提前 `return` 语义最清楚，也避免 JSX 里多一层三元。只想加提示就写 `{items.length > 0 ? <ul/> : <p/>}`，或列表照常渲染、上方用三元显示提示。
6. 把「状态 → 展示数据」变成数据表，新增状态只加一行、TypeScript 还能检查遗漏；三元链每加一个状态都要改 JSX，容易嵌套过深。
7. 02 课的「`children` / ReactNode 插槽」。可以传字符串（`ReactNode` 包含 `string`），但会丢掉 `Badge` 的颜色语义，通常不这么做。
8. Tailwind 靠扫描源码里的**完整类名**生成 CSS。三元返回的是完整字面量（两个值都出现在源码里），能扫到；`border-${color}-300` 在源码里不是完整类名，扫不到就不生成样式。
9. 必须加状态（当前筛选值）和交互，`page.tsx` 变成 Client Component 或把筛选抽成客户端子组件；列表渲染部分可以继续留在服务端（例如筛选值放 URL query）。这就是阶段 5 的 Server/Client 边界问题。
10. 「常量数据 → 作为 props 传给列表组件 → `map` 生成卡片 → 条件渲染决定状态样式和空状态 → Server Component 直出 HTML。」

</details>

## 十一、3 分钟讲解脚本（口头验收）

能讲清楚，比能跑起来更重要。按这四段说：

1. **这块页面有什么**：头部（身份）、技能（能力）、项目（作品）三块各自独立，所以拆成三个组件；footer 只有一句版权/说明，直接留在 `page.tsx`。
2. **数据从哪来**：`data.ts` 里四组常量 → 通过 props 单向流进组件。组件只读，不修改 props。
3. **数据怎么变成界面**：`map` 把数组变成列表，`key` 用业务 id；状态用 `Record` 映射表翻译成 `Badge` 的文案和颜色；空数组走提前 `return` 的空状态。
4. **为什么没有 JS**：整页是 Server Component，构建/请求时在服务端渲染成 HTML，浏览器不下载组件代码。阶段 2 加交互时，只需要把需要交互的那一块变成 Client Component。

## 十二、提交与下一步

```bash
git add app/learn app/page.tsx docs/
git commit -m "feat(learn): 阶段 1 结业作业 · 静态个人主页"
```

提交前确认 `app/learn/05-final/` 里没有临时文件、没有注释掉的废代码、没有 `console.log`。

完成后：

- 回 [阶段总览](./README.md) 把「阶段 1」的验收打勾。
- 下一阶段：[02-state-and-forms/06-counter.md](../02-state-and-forms/06-counter.md)——第一次给组件加状态和点击。你会看到同样的数据流，只是多了一个会变的来源。

参考资料：

- 描述 UI 全章：https://react.dev/learn/describing-the-ui
- 用 `key` 保持列表顺序：https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
- 条件渲染：https://react.dev/learn/conditional-rendering
- 本地 Next 文档：`node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
