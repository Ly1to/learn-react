# 03 · 列表与 key

> 所属阶段：[阶段总览](../README.md)（React 基础）
> 预计：1~2 天 · 练习文件：`app/learn/03-list/page.tsx`
> 前置：[02-props.md](./02-props.md)

## 一、本课目标

- 会用 `map` 把数组变成 JSX 列表，知道 `forEach` 为什么不行。
- 知道 `key` 加在哪一层、为什么必须是稳定唯一的业务 id。
- 能说出「不用 index 当 key」的真实后果（不只是警告）。
- 排序 / 筛选时保持不可变，不原地修改数据。
- 会把列表项抽成组件，知道 `key` 写在组件上而不是组件内部。

## 二、从数组到列表

```tsx
const skills = ["HTML", "CSS", "TypeScript"];

<ul>
  {skills.map((name) => (
    <li key={name}>{name}</li>
  ))}
</ul>
```

三件事必须同时成立：

1. **用表达式**：`{}` 里放 `map()`，它是表达式，有返回值。
2. **回调要 `return`**：箭头函数直接写 JSX 是简写返回；一旦加了 `{}`，就必须显式 `return`。
3. **最外层元素带 `key`**：上例 key 在 `<li>` 上。

```tsx
{items.map((item) => {
  <li>{item.name}</li>;        // ❌ 函数体里没 return，渲染出 undefined
})}

{items.map((item) => {
  return <li key={item.id}>{item.name}</li>;  // ✅
})}

{items.forEach((item) => <li>{item.name}</li>)}  // ❌ forEach 返回 undefined
```

`map` 返回的是一个**新数组**，元素是 React 元素（普通对象）。React 拿到数组后逐个渲染。`forEach` 也是遍历，但它返回 `undefined`，所以 `{}` 里什么都没有。

### 数据放哪

纯展示数据放组件外，避免每次渲染重新创建：

```tsx
type Skill = { id: string; name: string; level: 1 | 2 | 3 | 4 | 5 };

const skills: Skill[] = [
  { id: "html", name: "HTML / CSS", level: 4 },
  { id: "ts", name: "TypeScript", level: 3 },
  { id: "react", name: "React", level: 2 },
];
```

> 有交互、会变化的数据才需要放进 state（阶段 2 学）。

## 三、`key` 到底是什么

React 用 `key` 判断「这一轮渲染里的 A 和上一轮渲染里的 A 是不是同一个东西」。它决定了组件身份：

- key 相同 → 复用原来的组件实例和 DOM，只更新变化的部分。
- key 不同 → 卸载旧的、挂载新的，组件内部状态清空。

所以 key 必须满足：

| 规则 | 说明 |
| --- | --- |
| **唯一** | 只在**同一组兄弟节点**之间唯一，不必全局唯一 |
| **稳定** | 同一个数据项在多次渲染中 key 不变 |
| **业务化** | 用 `item.id`、数据库主键、稳定的 slug |
| **加在最外层** | `map` 返回的根元素 / 根组件上 |

```tsx
// ✅ id 是稳定的业务标识
{projects.map((project) => (
  <Card key={project.id} title={project.title}>…</Card>
))}

// ❌ key 加到了内层，React 看到的根元素仍然没有 key
{projects.map((project) => (
  <Card title={project.title}>
    <p key={project.id}>{project.description}</p>
  </Card>
))}
```

### 为什么不用数组下标

```tsx
// 初始：A B C，key = 0 1 2
// 删除 A 后：B C，key 变成 0 1
```

React 的视角：key `0` 还在，只是内容从 A 变成了 B —— 于是它复用了 A 的组件实例和 DOM。结果就是：输入框里的字、展开状态、动画进度全跟着错位到下一项。

> index 只有在「列表永远不增删、不排序、项内无状态」时才勉强安全。既然无法保证，就统一用 id。

### 常见错误用法

```tsx
key={index}                    // ❌ 删除/排序后身份错乱
key={Math.random()}            // ❌ 每次渲染都变，等于每次全部重建
key={crypto.randomUUID()}      // ❌ 同上，而且渲染期调用还有 SSR 风险
key={item.name}                // ⚠️ 名字可能重复；改名会导致重建
```

### key 不是 prop

React 19 会明确提示：

```
key is not a prop. Trying to access it will result in `undefined` being returned.
```

组件内部拿不到 `key`。业务需要 id 时，额外传一个 prop：

```tsx
<Card key={project.id} id={project.id} title={project.title} />
```

### 特殊情况

**Fragment 需要 key 时**，不能用 `<>`，要写 `<Fragment>`：

```tsx
import { Fragment } from "react";

{items.map((item) => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.def}</dd>
  </Fragment>
))}
```

**同一个数组渲染两次**不会冲突，因为 key 只在本组兄弟之间比较：

```tsx
<ul>{skills.map((s) => <li key={s.id}>{s.name}</li>)}</ul>
<ul>{skills.map((s) => <li key={s.id}>{s.name}</li>)}</ul>
```

**重复 key** 会警告（`Encountered two children with the same key`），并且可能导致元素被覆盖或状态串台。

## 四、排序与筛选：不要改原数组

```tsx
const sorted = [...skills].sort((a, b) => b.level - a.level); // ✅ 先复制
const sorted2 = skills.toSorted((a, b) => b.level - a.level); // ✅ 更直接
const wrong = skills.sort((a, b) => b.level - a.level);       // ❌ 原地修改常量
```

- `sort` / `reverse` / `push` / `splice` 都会修改原数组。
- `toSorted` / `toReversed` / `toSpliced` 返回新数组（Node 20+、现代浏览器都支持，本项目没问题）。
- `filter` / `map` 本身返回新数组，可以放心链式调用。

和阶段 2 的原则一致：**原数据不可变，派生数据用新变量**。列表渲染经常和 `filter` 搭配：

```tsx
const visible = projects.filter((p) => p.status !== "paused");
```

## 五、把列表项抽成组件

```tsx
function SkillItem({ skill }: { skill: Skill }) {
  return (
    <li className="flex items-center justify-between rounded border p-2">
      <span>{skill.name}</span>
      <span className="text-amber-500">{"★".repeat(skill.level)}</span>
    </li>
  );
}

{skills.map((skill) => (
  <SkillItem key={skill.id} skill={skill} />
))}
```

注意：

- **`key` 写在 `<SkillItem>` 上**，不是写在组件内部的 `<li>` 上。
- 子组件如果只用到 `skill.name` 和 `skill.level`，可以拆成两个基础 props；列表项数据结构简单时传整个对象也合理。取舍标准是「这个组件换一份数据还能不能复用」。
- 列表项组件里不要再调 `map`，`map` 只留在列表容器里。

## 六、动手练习

**文件**：`app/learn/03-list/page.tsx`

### 第 1 步：技能列表

- 文件顶部定义 `type Skill = { id: string; name: string; level: 1 | 2 | 3 | 4 | 5 }` 和 4~6 条数据。
- 用 `map` 渲染 `<ul>`，每项 `<li key={skill.id}>`：左边名字，右边用 `"★".repeat(level)` 显示难度；最好再补 `"☆".repeat(5 - level)` 显示空星。
- 给星星加可读文案：星星本身 `aria-hidden`，旁边放一段 `sr-only` 文本（如 `难度 4 / 5`），别只靠 ★ 传达信息。
- 把 `<li>` 的内容抽成 `SkillItem` 组件，`key` 留在 `map` 那一层。

### 第 2 步：项目卡片列表

- 定义 `type Project = { id: string; title: string; description: string; status: "active" | "done" | "paused" }` 和 3 条数据。
- 从 `app/learn/_components/` 引入 `Card` / `Badge`，用 `map` 渲染，`key={project.id}`；`footer` 放 `Badge`，label / tone 由 `status` 映射（用 `Record<Status, ...>`，别写三元链）。
- 卡片内容放描述文字。

### 第 3 步：排序

- 在组件外算好 `const sortedSkills = skills.toSorted((a, b) => b.level - a.level)`，再渲染。
- 验证原 `skills` 顺序没变：排序前临时 `console.log(skills)` 或在页面临时再渲染一遍原数组对比。

### 第 4 步（进阶）

- 再加一个「按难度分组」的渲染：`level >= 4` 和 `level < 4` 两组，各自一个 `<ul>`，每组内部仍有自己的 key。
- 用 `filter` + `map` 组合，练习链式派生。

**参考实现**（`Card` / `Badge` 已抽到 `app/learn/_components/`，直接 import；完整文件见 `app/learn/03-list/page.tsx`）：

```tsx
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

export default function ListPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 p-8">
      <h1 className="text-3xl font-semibold">列表练习</h1>

      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="mb-3 text-xl font-semibold">技能</h2>
        <ul className="space-y-2">
          {sortedSkills.map((skill) => (
            <SkillItem key={skill.id} skill={skill} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="mb-3 text-xl font-semibold">项目</h2>
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

function SkillItem({ skill }: { skill: Skill }) {
  return (
    <li className="flex items-center justify-between rounded border border-zinc-200 p-2">
      <span>{skill.name}</span>
      <span className="font-mono text-amber-500" aria-hidden="true">
        {"★".repeat(skill.level)}
        <span className="text-zinc-300">{"☆".repeat(5 - skill.level)}</span>
      </span>
      <span className="sr-only">难度 {skill.level} / 5</span>
    </li>
  );
}
```

> `Badge` 的 `tone` 类型从组件里 `import type { BadgeTone }`，不要在页面里再抄一份联合类型，改一处就能全局生效。

## 七、验收

- [ ] `/learn/03-list` 能访问，技能列表和项目卡片都正常显示
- [ ] 控制台没有 `Each child in a list should have a unique "key"` 警告
- [ ] 没有一处用 `index` / `Math.random()` / `crypto.randomUUID()` 当列表 key
- [ ] 排序后技能从高到低，原 `skills` 数组顺序不变
- [ ] 能解释 `map` 和 `forEach` 的区别，能解释回调加 `{}` 后为什么需要 `return`
- [ ] 能解释「删掉第一项后，为什么 index 当 key 会让第二项的输入框内容错位」
- [ ] 项目卡片的 `key` 写在 `<Card>` 上，不是写在 Card 内部的元素上
- [ ] 全文件没有 `any`、没有 `"use client"`，`pnpm lint` 通过

## 八、本课易错点

| 报错 / 现象 | 原因 | 修法 |
| --- | --- | --- |
| `Each child in a list should have a unique "key"` | map 返回的根元素没 key | 根元素 / 根组件上加 `key={item.id}` |
| `Encountered two children with the same key` | key 重复 | 换成业务 id；检查是否用了 name/index |
| 列表空白、无报错 | 用了 `forEach`，或箭头函数体没 `return` | 改 `map` / 补 `return` |
| 页面出现 `undefined` | map 回调没返回值 | 同上 |
| `Objects are not valid as a React child` | `{item}` 直接渲染对象 | `{item.name}` |
| 删除/排序后输入框、展开状态错位 | 用 index 当 key | 换业务 id |
| 每次渲染列表都重建、输入框失焦 | key 用了随机值 | 用稳定 id |
| 排序后原数组也变了 | `sort` 原地修改 | `toSorted()` 或 `[...arr].sort()` |
| 子组件里 `props.key` 是 `undefined` | key 是 React 特殊字段 | 需要 id 就额外传 `id` prop |
| 控制台警告 `<Fragment>` 不能加 key | 用了 `<>...</>` | 改 `import { Fragment }` + `<Fragment key>` |

## 九、自测题

1. `map` 和 `forEach` 都能遍历数组，为什么渲染列表只能用 `map`？
2. `items.map((item) => { <li key={item.id}>{item.name}</li> })` 为什么渲染不出来？怎么改？
3. `key` 应该加在 `map` 返回的哪一层？加在内层 `<span>` 上行不行？
4. key 需要全局唯一吗？同一个数组渲染在两个不同的 `<ul>` 里会冲突吗？
5. 用 index 当 key，删除第一项后发生了什么？用「组件身份」解释。
6. 为什么 `key={Math.random()}` 比 index 还糟？
7. 组件内部能通过 `props.key` 拿到 key 吗？想拿 id 怎么办？
8. `skills.sort(...)` 和 `skills.toSorted(...)` 的区别？为什么前者在 React 里有风险？
9. 用 `<>...</>` 包两个元素并想加 key，为什么不行？怎么写？
10. 列表项要抽成组件时，`key` 写在 `<SkillItem>` 上还是组件内部的 `<li>` 上？

<details>
<summary>参考答案</summary>

1. `map` 返回新数组（元素是 JSX），`forEach` 永远返回 `undefined`；`{}` 只能渲染有返回值的东西。
2. 箭头函数加了 `{}` 就是块级函数体，没有 `return`，回调返回 `undefined`。改成 `{ return <li .../>; }` 或去掉 `{}`。
3. 加在 `map` 返回的根元素（或根组件）上；加在内层没用，React 只看这一层的根。
4. 不需要全局唯一，只在同一组兄弟节点之间唯一；同一个数组渲染到两个不同列表不会冲突。
5. React 用 key 认组件。删掉 A 后，index 0 从 A 变成了 B，React 认为「还是原来那个」，于是把 A 的 DOM/state 复用给 B，导致输入框内容、展开状态错位。
6. 每次渲染 key 都变，React 认为所有项都是新的，全部卸载重建：状态丢失、输入框失焦、性能浪费。
7. 不能，key 是特殊字段，不进入 props（React 19 会给出提示）。需要 id 时额外传 `id={item.id}`。
8. `sort` 原地修改原数组，`toSorted` 返回排序后的新数组。原地修改会让模块级常量数据被永久改序，影响后续渲染和对比。
9. `<>...</>` 是 Fragment 的简写，不能接收属性。改成 `import { Fragment } from "react"`，用 `<Fragment key={...}>`。
10. 写在 `<SkillItem key={...} />` 上；组件内部的 `<li>` 不加 key。

</details>

## 十、下一课

[04-conditional.md](./04-conditional.md)：列表有了，接下来处理「空列表、加载中、不同状态」怎么显示。
