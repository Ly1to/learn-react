# 02 · props 与组件拆分

> 所属阶段：[阶段总览](../README.md)（React 基础）
> 预计：1~2 天 · 练习文件：`app/learn/02-props/page.tsx`
> 前置：[01-jsx.md](./01-jsx.md)

## 一、本课目标

- 理解 props 就是**组件的函数参数**，是父组件传给子组件的只读数据。
- 会用 `type XxxProps = { ... }` 描述 props，不用 `any`。
- 会用 `children` 做「插槽」，会用可选 props + 默认值做变体。
- 会传「多个插槽」（`header` / `footer` 这类具名 `ReactNode` props）。
- 知道 `key` 不是 prop，知道 props 为什么不能改。
- 能把重复的 JSX 抽成组件，并判断什么时候该拆、什么时候不该拆。

## 二、props 是什么

```tsx
function Badge({ label }: { label: string }) {
  return <span>{label}</span>;
}

// 使用：像写 HTML 属性一样传
<Badge label="进行中" />
```

编译后等价于 `Badge({ label: "进行中" })` —— **props 就是组件函数的第一个参数**，只不过 JSX 让你用属性语法传。所以：

- 属性名 = 参数对象的 key，必须和类型定义一致（`label` 写成 `lable` 会直接类型报错）。
- 值可以是任意 JS 值：字符串、数字、布尔、对象、数组、函数、JSX。
- 字符串可以直接写 `label="abc"`，其他类型要包 `{}`：`count={3}`、`items={list}`、`disabled` 等价于 `disabled={true}`。

### 类型怎么写

```tsx
type BadgeProps = {
  label: string;                                  // 必填
  tone?: "green" | "red" | "gray";                // 可选 + 字面量联合
  count?: number;
  children?: React.ReactNode;                     // 插槽
};

function Badge({ label, tone = "gray" }: BadgeProps) { ... }
```

约定：

- 类型名用 `组件名 + Props`。
- 用 `type` 而不是 `interface`（两者在本项目里都行，统一一种更省心）。
- **不要用 `any`**，也不要写 `props: { [key: string]: any }`，那等于放弃类型。
- 习惯用解构 `{ label, tone }`，比反复写 `props.label` 干净。
- 需要 `ReactNode` 时，可以 `import type { ReactNode } from "react";` 后直接写 `ReactNode`。

几个常用类型：

| 想表达 | 类型 |
| --- | --- |
| 任意可渲染内容（文本、数字、元素、数组、null） | `ReactNode` |
| 一个 React 元素（比 `ReactNode` 严格） | `ReactElement` |
| 事件回调 | `() => void`、`(id: string) => void` |
| 三选一 | `"draft" \| "published" \| "archived"` |
| 键值都固定的映射 | `Record<Status, string>` |
| 样式变体 | `tone?: "green" \| "red" \| "gray"` |

## 三、`children`：组件的插槽

```tsx
type CardProps = { title: string; children: React.ReactNode };

function Card({ title, children }: CardProps) {
  return (
    <article className="rounded-lg border p-4">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div>{children}</div>
    </article>
  );
}

// 两种写法完全等价
<Card title="技能"><p>React / TypeScript</p></Card>
<Card title="技能" children={<p>React / TypeScript</p>} />
```

为什么用 `children` 做插槽：

- **调用方决定内容，组件只决定布局**。`Card` 不需要知道里面是文字、列表还是按钮。
- 比传一堆 `content`、`body`、`description` props 灵活，也不会让组件变成「参数收集器」。
- 组合优于配置：`children` 里还可以放别的组件，形成组件树。

> `children` 不一定是单个元素：可以是字符串、数字、多个元素（数组）、`null`。所以类型用 `ReactNode` 而不是 `ReactElement`。

### 多个插槽

`children` 只有一个，需要多个区域时用具名 props：

```tsx
type CardProps = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;   // 可选插槽
};

function Card({ title, children, footer }: CardProps) {
  return (
    <article className="rounded-lg border p-4">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div>{children}</div>
      {footer && <div className="mt-3 border-t pt-2 text-sm">{footer}</div>}
    </article>
  );
}

<Card title="项目 A" footer={<Badge label="已完成" tone="green" />}>
  <p>项目描述……</p>
</Card>
```

## 四、默认值与「可选」

```tsx
type BadgeProps = { label: string; tone?: "green" | "red" | "gray" };

function Badge({ label, tone = "gray" }: BadgeProps) {
  const style = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-zinc-100 text-zinc-700",
  }[tone];

  return <span className={`rounded px-2 py-0.5 text-xs ${style}`}>{label}</span>;
}

<Badge label="进行中" />              // tone = "gray"
<Badge label="进行中" tone="green" /> // tone = "green"
```

关键点：

- `tone?: ...` 让这个 prop 可以不传；解构默认值 `tone = "gray"` 处理「没传」的情况。
- 默认值**只在值为 `undefined` 时生效**。传 `null` 不会用默认值（类型也不允许），传空字符串 `""` 也不会。
- 不要用 `defaultProps`：React 19 已经移除了函数组件的 `defaultProps`，用解构默认值。
- 变体样式用 `Record<Tone, string>` 映射，比三元链更好加新变体：

```tsx
const toneClass: Record<NonNullable<BadgeProps["tone"]>, string> = { ... };
```

## 五、props 是只读的

```tsx
function Card(props: CardProps) {
  props.title = "改一下";        // ❌ 开发模式直接抛错（props 对象被冻结）
  const title = props.title;    // ✅ 只读
  const displayTitle = title.length > 12 ? `${title.slice(0, 12)}…` : title;
  return <h3>{displayTitle}</h3>;
}
```

> 解构出来的 `title` 是局部变量，`title = "x"` 语法上不会报错，但只改了当前函数里的副本，父组件的数据和界面都不会变。这种「改了但没生效」比报错更难查。

- **数据流是单向的**：父 → 子。子组件只能读，不能写。
- 想基于 props 做变化，用**新变量**或直接计算：

```tsx
const displayTitle = title.length > 12 ? `${title.slice(0, 12)}…` : title;
```

- 想修改父组件的数据（点击按钮改标题、输入框回写），要让父组件传一个**回调函数**下来：

```tsx
type CardProps = { title: string; onRename: (next: string) => void };
```

这就是阶段 2「状态提升」的内容，这里先知道方向。

- 也别改 props 里的对象/数组：`props.project.title = "x"` 不会报错（如果没冻结），但会悄悄改掉父组件的数据，且不会触发更新 —— 最坏的一类 bug。

> `key` 是特殊 prop，**不会传进组件**：`function Card(props) { props.key }` 永远是 `undefined`。key 只给 React 做列表 diff 用，不要把它当业务 id 传。

## 六、透传与展开（知道就好，别滥用）

```tsx
// 1. className 透传，让调用方能微调外层样式
type CardProps = { title: string; children: React.ReactNode; className?: string };

function Card({ title, children, className = "" }: CardProps) {
  return <article className={`rounded-lg border p-4 ${className}`}>{/* ... */}</article>;
}

<Card title="注意" className="shadow-md">…</Card>
```

> **类名冲突不要靠拼接顺序解决。** 写成 `className="border-red-300 bg-red-50"` 后，`Card` 内部同时存在 `border-zinc-200` / `bg-white`；浏览器最终用哪条规则由 **Tailwind 生成的 CSS 顺序**决定，不是 `className` 在字符串里的先后。实测本项目里 `.bg-white` 排在 `.bg-red-50` 之后，结果还是白底。想换颜色就用变体 prop（如 `tone`）把整组类名一起换掉，或者用 `tailwind-merge` 合并冲突类名；本阶段只需要知道有这个坑。

```tsx
// 2. 对象展开：字段刚好对得上时很省事
<Card {...project} />   // 等价于 title={project.title} description={project.description} ...
```

注意：

- 展开会把**所有**字段都传进去，包括组件不认识的；类型对不上会报错，对得上也可能把无关数据带进子组件。
- 字符串拼 `className` 只适合追加**不冲突**的样式（`shadow-md`、`mt-8`）。需要覆盖同属性的工具类时，用变体 prop 或 `tailwind-merge`，别指望拼接顺序。
- 不要为了少写几行就传整个大对象（`data={everything}`），组件会变得难复用、难测试。

## 七、什么时候拆组件

拆：

- 同一段 JSX 出现第二次（或明确预感会出现）。
- 一个组件超过 80 行，或同时干「取数 / 布局 / 交互 / 格式化」好几件事。
- 某块 UI 需要独立变化（不同卡片、不同状态）。
- 名字能一句话说清（`Badge`、`Card`、`ProfileHeader`）。

不拆：

- 只用一次、只有 3 行、拆了反而要传 6 个 props。
- 拆出来的组件名字叫 `CardInner`、`Wrapper`、`Item2` —— 说明你只是把代码挪走了，没有抽象。

一个信号：**子组件的 props 超过 6~7 个，或者一半 props 只是原样透传**，通常该重新划分边界，或者用 `children` / 组合代替。

## 八、动手练习

**文件**：`app/learn/02-props/page.tsx`

### 第 1 步：`Card`

- props：`title: string`、`children: React.ReactNode`、`footer?: React.ReactNode`、`className?: string`。
- 渲染成带边框、圆角、内边距的 `<article>`；`title` 用 `<h3>`（页面里的 `<h1>` 留给页面标题）。
- `footer` 没传时不渲染那一条分隔线。
- `className` 拼到最外层。

### 第 2 步：`Badge`

- props：`label: string`、`tone?: "green" | "red" | "gray"`，默认 `"gray"`。
- 三种 tone 三种颜色（Tailwind `bg-*-100 text-*-700`）。
- 用 `Record<Tone, string>` 写颜色映射，不用三元链。

### 第 3 步：页面组装

- `main` 里放 `<h1>` + 三个 `<Card>`，每个卡片内容不同：
  1. 「关于我」：一段文字 + `footer` 里放一个 `Badge label="开放合作" tone="green"`。
  2. 「技能」：`<ul>` 三项（手写，本课不练 map）。
  3. 「最近项目」：一段描述 + `footer` 里放 `Badge`，tone 用 `red` 或 `gray`。
- 三个卡片都要用 `title`，至少两个用 `footer`，至少一个传 `className` 加一个**不冲突**的额外样式（如 `shadow-md`、`mt-8`）。
- 所有 props 类型都用 `type` 定义，全文件 0 个 `any`。

### 第 4 步（进阶）

- 加一个 `ProfileHeader` 组件：props 为 `name: string`、`bio: string`、`avatarUrl?: string`。
  - 没传 `avatarUrl` 时渲染灰色圆形占位（`<div className="size-16 rounded-full bg-zinc-200" />`）。
  - 传了就用 `<img>` 或 `next/image` 的 `<Image>` 显示。
- `Badge` 和 `Card` 已经抽到 `app/learn/_components/`，后续课程直接 import 复用。

**参考实现**（先自己写，卡住再对照。组件实现供理解；实际仓库已抽到 `app/learn/_components/`，页面直接 import）：

```tsx
import type { ReactNode } from "react";

type BadgeTone = "green" | "red" | "gray";

type BadgeProps = { label: string; tone?: BadgeTone };

const toneClass: Record<BadgeTone, string> = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-zinc-100 text-zinc-700",
};

function Badge({ label, tone = "gray" }: BadgeProps) {
  return <span className={`rounded px-2 py-0.5 text-xs ${toneClass[tone]}`}>{label}</span>;
}

type CardProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

function Card({ title, children, footer, className = "" }: CardProps) {
  return (
    <article className={`rounded-lg border border-zinc-200 bg-white p-4 ${className}`}>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div className="text-zinc-700">{children}</div>
      {footer && <div className="mt-3 border-t border-zinc-200 pt-2 text-sm">{footer}</div>}
    </article>
  );
}

export default function PropsPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-3xl font-semibold">props 练习</h1>

      <Card title="关于我" footer={<Badge label="开放合作" tone="green" />}>
        <p>前端初学者，正在补齐 React 基础。</p>
      </Card>

      <Card title="技能">
        <ul className="list-disc pl-5">
          <li>HTML / CSS / TypeScript</li>
          <li>React</li>
          <li>Tailwind CSS</li>
        </ul>
      </Card>

      <Card
        title="最近项目"
        className="shadow-md"
        footer={<Badge label="暂停" tone="red" />}
      >
        <p>一个还在画原型的小工具。</p>
      </Card>
    </main>
  );
}
```

## 九、验收

- [ ] `/learn/02-props` 能访问，三张卡片样式正常
- [ ] `Card` / `Badge` 都能在页面里当标签用，改 props 内容会跟着变
- [ ] 删掉 `tone` 不报错，默认灰色生效
- [ ] 不传 `footer` 时卡片底部没有多余分隔线
- [ ] 能解释 props 是只读的，以及为什么不能 `props.title = "x"`
- [ ] 能解释 `children` 的类型和「插槽」作用
- [ ] 浏览器控制台 0 报错 0 警告，`pnpm lint` 通过
- [ ] 全文件没有 `any`、没有 `"use client"`

## 十、本课易错点

| 报错 / 现象 | 原因 | 修法 |
| --- | --- | --- |
| `Property 'title' does not exist on type '{}'` | 组件参数没写类型 | `function Card({ title }: CardProps)` |
| `'children' is missing in props` | 类型里忘了 `children` | 加 `children: ReactNode`，或改为可选 |
| `Type '{ children: Element; }' is not assignable...` | props 类型里没有 `children` | 同上 |
| `Cannot assign to read only property` | 在子组件里改了 props | 改成局部变量，或走回调让父组件改 |
| `Objects are not valid as a React child` | 把对象/数组直接当 children 用 | 取字段，或 `items.map(...)` |
| 默认值不生效 | 传了 `null` 或 `""` | 只传 `undefined`（即不传），或用 `??` 兜底 |
| 卡片样式覆盖不了 | 基础类和 `className` 有同类工具类冲突，CSS 顺序决定胜者 | 用变体 prop 换整组类名，或用 `tailwind-merge`；`className` 只加不冲突的样式 |
| `Each child in a list should have a unique "key"` | 本课没 map，出现说明你提前写了列表 | 下一课讲，先按 `<li>` 手写 |
| 页面文字重复/组件不更新 | 在组件里改了 props 对象内部字段 | 保持不可变，回调交给父级 |

## 十一、自测题

1. props 从哪来？它是函数参数还是全局变量？
2. `type CardProps = { title: string }` 里 `title` 写成 `titel` 会怎样？
3. `children: React.ReactNode` 和 `children: React.ReactElement` 有什么区别？插槽该用哪个？
4. `tone?: "green" | "red"` 中 `?` 的作用是什么？默认值什么时候生效？
5. 子组件想把卡片标题改掉，应该怎么做？为什么不能直接改 props？
6. `<Card title="a" children={<p>x</p>} />` 和 `<Card title="a"><p>x</p></Card>` 等价吗？
7. `key` 能在子组件里通过 props 拿到吗？为什么？
8. `{...project}` 展开传参有什么风险？什么时候适合用？
9. 一个 `Card` 收到 10 个 props，其中 5 个只是原样传给内部的 `div`，这说明什么？
10. props 和 state 的区别是什么？（提示：下一阶段）

<details>
<summary>参考答案</summary>

1. 父组件通过 JSX 属性传入，最终是组件函数的第一个参数对象，不是全局变量。
2. TypeScript 会报「缺少 `title`」并且传入 `title` 会报多余属性；JSX 上写错属性名同样报错。
3. `ReactNode` 包含字符串、数字、元素、数组、`null` 等所有可渲染内容；`ReactElement` 只接受单个元素。插槽用 `ReactNode`。
4. `?` 表示可选（可以不传）；解构默认值只在值为 `undefined` 时生效。
5. 父组件传一个回调 prop（如 `onRename`），子组件调用它，由父组件更新自己的 state。props 是单向只读数据，直接改会破坏数据流，开发模式下还会因对象冻结而报错。
6. 等价。JSX 的子节点会自动放进 `children` prop。
7. 不能。`key` 被 React 特殊处理，不会进入 props，只用于列表 diff。
8. 会把对象的所有字段都传进去，可能带入无关数据、暴露内部结构，类型不匹配时才报错。适合字段与 props 高度一致、或纯透传的场景。
9. 组件边界划错了：要么应该用 `children` / 组合，要么应该把内部 `div` 的样式配置收敛成一个 `className` / `style` prop。
10. props 由父组件传入、只读、变化由外部决定；state 由组件自己持有、可变（通过 setter）、变化触发重渲染。下一阶段学 state。

</details>

## 十二、下一课

[03-list.md](./03-list.md)：用 `map` + `key` 把这一课手写的三张卡片变成数据驱动。
