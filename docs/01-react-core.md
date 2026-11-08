# 阶段 1：React 基础（JSX / 组件 / props / 列表 / 条件渲染）

> 目标：不查资料写出**纯展示**的组件树，理解「数据怎么变成界面」。
> 预计：3~4 天，每天 1~2 小时。
> 前置：[00-setup.md](./00-setup.md) 全部完成。

## 一、这个阶段不学什么

先划掉这些，避免分心：

- ❌ `useState` / 事件交互 → 阶段 2
- ❌ `useEffect` / 数据请求 → 阶段 3、6
- ❌ Next 的缓存、Server Actions、`use cache` → 阶段 6
- ❌ Redux / Zustand / 组件库

本阶段的组件**全是静态的**，所以：**一个 `"use client"` 都不用写**。这不是偷懒，是刻意让你体会「没有交互的组件根本不需要进浏览器」。等阶段 2 需要点击时再回头对比。

## 二、知识点清单（按顺序）

1. **JSX 是什么**：不是 HTML。`class` → `className`，`for` → `htmlFor`，标签必须闭合，只能返回一个根节点。
2. **`{}` 里能放什么**：表达式（变量、运算、三元、函数调用），不能放语句（`if`/`for`）。
3. **组件**：首字母大写的函数，返回 JSX；组件组合 = 像标签一样用 `<Card />`。
4. **Fragment**：`<>...</>`，用来返回多个并列节点又不额外包一层 div。
5. **props**：从外部传入的只读数据，用 TS `type` 定义；`children` 是特殊的 prop。
6. **列表渲染**：`array.map()` + `key`。
7. **`key` 的规则**：唯一、稳定、不用数组下标。
8. **条件渲染**：三元 `a ? b : c`、短路 `cond && view`、提前 `return null`。
9. **样式**：Tailwind 类名写进 `className`，字符串拼接用模板字符串。
10. **组件的拆分粒度**：一个组件只做一件事，超过 80 行就该拆。

## 三、逐日计划

### Day 1：JSX 与组件

**练习文件**：`app/learn/01-jsx/page.tsx`

需求：

- 页面里展示：一个标题、一段自我介绍、一个 3 项的技能列表（`<ul>` + `<li>`，暂时手写不要 map）。
- 上面这些都包在一个 `<main className="mx-auto max-w-2xl p-8">` 里。
- 再写一个独立函数组件 `function Greeting()`，返回一句问候语，**在页面里当标签用** `<Greeting />`。
- 在 `{}` 里做一次运算：`{2025 - 1998}` 输出年龄；用三元表达式根据变量显示「成年 / 未成年」。

**验收**

- [ ] 页面能访问，样式生效
- [ ] 能解释为什么是 `className` 不是 `class`
- [ ] 能说出 `{ }` 里为什么不能写 `if`

### Day 2：props 与组件拆分

**练习文件**：`app/learn/02-props/page.tsx`

需求：

- 写一个 `Card` 组件，接收 `title: string` 和 `children: React.ReactNode`，渲染成带边框的卡片。
- 写一个 `Badge` 组件，接收 `label: string` 和可选 `tone?: "green" | "red" | "gray"`（默认 `"gray"`），不同 tone 用不同颜色类名。
- 页面里用 `<Card>` 包 3 个不同内容区块，其中至少一个用 `<Badge />`。
- 所有 props 都用 `type XxxProps = { ... }` 定义，不用 `any`。

示例（类型写法参考，具体内容自己想）：

```tsx
type BadgeProps = { label: string; tone?: "green" | "red" | "gray" };

function Badge({ label, tone = "gray" }: BadgeProps) {
  const color =
    tone === "green" ? "bg-green-100 text-green-700"
    : tone === "red" ? "bg-red-100 text-red-700"
    : "bg-gray-100 text-gray-700";
  return <span className={`rounded px-2 py-0.5 text-xs ${color}`}>{label}</span>;
}
```

**验收**

- [ ] 能解释 props 是只读的，为什么不能 `props.title = "x"`
- [ ] 能解释 `children` 是什么类型、为什么用它做「插槽」
- [ ] 删掉 `tone` 传入不会报错（默认值生效）

### Day 3：列表与 key

**练习文件**：`app/learn/03-list/page.tsx`

需求：

- 在组件外（文件顶部）定义一个数组 `const skills = [...]`，每项包含 `id`、`name`、`level`（数字 1~5）。
- 用 `map` 渲染成列表，每项用 `<li key={item.id}>`，显示名字和「难度星星」（用 `"★".repeat(level)` 或循环都行）。
- 再定义一个数组，渲染成一列 `Card`，key 用业务 id。
- **进阶**：把数据按 `level` 从高到低排序后再渲染（`toSorted` 或 `[...arr].sort()`），注意不要直接改原数组。

**验收**

- [ ] 控制台无 `Each child in a list should have a unique "key"` 警告
- [ ] 能解释「为什么不用 index 当 key」
- [ ] 能解释 `map` 的返回值是什么、为什么不加 `return` 就渲染不出来

### Day 4：条件渲染 + 组合练习

**练习文件**：`app/learn/04-conditional/page.tsx` → 用你的成果做一次组合练习

需求：

- 准备一个 `status` 变量（`"draft" | "published" | "archived"` 三选一，先手动改着试）。
- 按 status 渲染不同内容 + 不同颜色 Badge（复用 Day 2 的组件，**复制进来或抽到 `app/learn/_components/` 共用**）。
- 实现「空列表提示」：数组为空时显示 `暂无数据`，否则渲染列表。

```tsx
{items.length === 0 ? <p>暂无数据</p> : <ul>{/* ... */}</ul>}
```

**注意这个坑**：`{items.length && <ul />}` 在 length 为 0 时会渲染出一个 `0`。判断数字不要用 `&&`。

**阶段结业作业**：`app/learn/01-final/page.tsx`

做一个**静态的个人主页**，包含：

- 头部：头像占位（`<div className="size-16 rounded-full bg-gray-200" />`）+ 名字 + 一句话简介
- 技能列表（用 map 渲染，带 key）
- 项目卡片列表（用 map 渲染 `Card`，每张卡有标题、描述、状态 Badge）
- 任意一组数据为空时显示「暂无」
- 模板字符串拼类名至少用一次，条件渲染三种写法各用一次

数据全部写在文件顶部当常量，不请求任何接口。

**验收**

- [ ] 页面能访问，浏览器控制台 0 报错 0 警告
- [ ] 组件数 ≥ 3，且 `page.tsx` 本体 < 80 行
- [ ] `pnpm lint` 通过
- [ ] 全文件没有 `any`、没有 `"use client"`

## 四、阶段总验收

- [ ] 给定一段商品数据（数组 + 对象），能在 15 分钟内写出带条件的列表页
- [ ] 能画出数据流向：常量 → props → 组件 → 渲染
- [ ] 能解释 Server Component 下为什么静态页面不需要 JS 交互代码

## 五、自测题

1. JSX 里 `{ }` 能放 `if (a) {}` 吗？不能的话怎么写条件？
2. 组件名为什么必须大写？写成 `<card />` 会发生什么？
3. `key` 加在 `map` 的哪一层？放在 `<li>` 里面的 `<span>` 上行不行？
4. props 能被子组件修改吗？想在父组件基础上改怎么办？（提示：先想想阶段 2）
5. `{0 && <p>x</p>}` 渲染出什么？为什么？怎么改？
6. `<Card title="a" children={<p>x</p>} />` 和 `<Card title="a"><p>x</p></Card>` 等价吗？
7. 同一个数组渲染两次，key 会冲突吗？
8. 为什么本阶段的组件不需要 `"use client"`？

## 六、常见错误对照

| 报错 / 现象 | 原因 | 修法 |
| --- | --- | --- |
| `Objects are not valid as a React child` | 把对象直接塞进 `{}` | 取具体字段，或 `JSON.stringify` |
| `Each child in a list should have a unique "key"` | map 外层没 key | 最外层元素加 `key={item.id}` |
| 页面空白、无报错 | 忘了 `export default`，或函数没 `return` | 检查 `return` 和导出 |
| 样式不生效 | 写成了 `class=` | 改 `className=` |
| `'useState' is not defined` | 忘了 import | `import { useState } from "react"`（阶段 2） |
| 页面出现多余的 `0` | 用 `&&` 判断数字 | 改三元或 `> 0` |

## 七、语义化标签怎么选（Day 1 配套）

### 一个自问流程

```
这块内容是页面的主体吗？        → <main>（整个页面只有一个）
是页头（logo、标题、身份）吗？   → <header>
是页脚（版权、联系方式）吗？     → <footer>
是一篇能独立传播的完整内容吗？   → <article>（一条新闻、一张商品卡）
是一个有主题的内容块吗？        → <section>（必须有 h2/h3 当标题）
是导航链接组吗？                → <nav>
以上都不是，只是排版用的容器     → <div>

里面是文本段落吗？  → <p>
是并列的一串条目？  → <ul> + <li>（有序用 <ol>）
是「名称：值」成对的数据？ → <dl> / <dt> / <dd>
```

### 三条硬规则

1. **`<h1>` 一页一个**，层级不跳级（`h1 → h2 → h3`）。标题不是用来调字号的，字号交给 Tailwind（`text-3xl`）。
2. **`<section>` 必须带标题**（`<h2>`），并用 `aria-labelledby` 关联。没有标题的内容块用 `<div>`。
3. **`<div>` 是最后的选择**，不是默认选择。它是「纯粹为了布局/样式而存在的无意义容器」。

### 常见误用对照

| 写法 | 问题 | 改成 |
| --- | --- | --- |
| `<div class="header">` | div 没有语义 | `<header>` |
| `<div onClick>` 当按钮 | 键盘不可用、无 role | `<button>` |
| `<h3>` 里写 `font-size: 40px` 当大标题用 | 标题层级乱 | `<h2 className="text-4xl">` |
| `<p>技能1<br />技能2</p>` | 用 `<br>` 造列表 | `<ul><li>` |
| `<section>` 里只有一段话 | section 无标题不算 section | `<p>` 或 `<div>` |
| 页面里 3 个 `<h1>` | 每个都是「最高级」 | 只留一个，其余降级 |
| 链接用 `<a href="#">` 或 `onClick` + div | 不语义、不能新开标签页 | 站内用 `next/link` 的 `<Link>`，站外用 `<a href>` |

### 为什么值得花时间

- 屏幕阅读器靠标签判断「这是标题 / 这是列表 / 这是按钮」，全用 `<div>` 等于给盲人一张白纸。
- 搜索引擎和浏览器的「阅读模式」也读标签结构。
- 语义标签自带默认行为（`<button>` 可用键盘回车触发、`<ul>` 有列表语义），用 `<div>` 等于把这些都要手写一遍。

## 八、参考资料

本地（版本和你的项目完全一致，优先看这个）：

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`

在线：

- 快速入门：https://react.dev/learn
- 描述 UI 全章（本阶段主线）：https://react.dev/learn/describing-the-ui
- key 为什么重要：https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key

## 九、本阶段产出检查

完成后你的仓库里应该有：

```
app/learn/01-jsx/page.tsx
app/learn/02-props/page.tsx
app/learn/03-list/page.tsx
app/learn/04-conditional/page.tsx
app/learn/01-final/page.tsx
app/learn/_components/        # 可选，复用 Card / Badge
```

commit 一次：`feat(learn): 阶段 1 React 基础练习`
