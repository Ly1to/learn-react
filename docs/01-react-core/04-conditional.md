# 04 · 条件渲染

> 所属阶段：[阶段总览](../README.md)（React 基础）
> 预计：1~2 天 · 练习文件：`app/learn/04-conditional/page.tsx`
> 前置：[03-list.md](./03-list.md)

## 一、本课目标

- 掌握三种条件渲染写法：三元、`&&` 短路、提前 `return null`。
- 知道 JSX 里不能写 `if` / `else`，但可以在 `return` 之前用普通 JS 算好。
- 知道 `0`、`""`、`null`、`false` 在 JSX 里分别渲染成什么。
- 会用「空状态」处理列表：有数据渲染列表，没数据给提示。
- 能判断什么时候该条件渲染、什么时候该用 CSS 隐藏。

## 二、为什么 `{}` 里不能写 `if`

`{}` 里只能放**表达式**（有返回值），`if` 是语句。所以条件必须变成表达式，或者提前算好：

```tsx
// ✅ 三元：有返回值
{isPublished ? <p>正文</p> : <p>未发布</p>}

// ✅ 短路：左边为真才渲染右边
{isPublished && <p>正文</p>}

// ✅ 提前算好，再用变量
let content;
if (isPublished) content = <p>正文</p>;
else content = <p>未发布</p>;
return <div>{content}</div>;

// ❌ 直接在 JSX 里写 if
return <div>{if (isPublished) { <p>正文</p> }}</div>;
```

## 三、三种写法

### 1. 三元 `cond ? A : B`

适合**二选一**：

```tsx
{items.length > 0 ? (
  <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
) : (
  <p>暂无数据</p>
)}
```

- 两个分支都必须是表达式。
- 三元可以嵌套，但超过两层就该抽成变量、映射表或子组件。
- 分支是多个元素时用 `(...)` 包起来，可读性更好。

### 2. 短路 `cond && view`

适合**满足条件才显示，不满足就什么都不显示**：

```tsx
{isDraft && <p>草稿仅自己可见</p>}
```

它等价于 `cond ? view : null`，但更短。注意它的返回值就是左边那个值：

| 表达式 | 渲染结果 |
| --- | --- |
| `{true && <p>x</p>}` | `<p>x</p>` |
| `{false && <p>x</p>}` | 什么都不渲染 |
| `{null && <p>x</p>}` | 什么都不渲染 |
| `{0 && <p>x</p>}` | **`0`** |
| `{"" && <p>x</p>}` | 什么都不渲染（空字符串） |
| `{NaN && <p>x</p>}` | **`NaN`** |

所以**判断数量不要用 `&&`**：

```tsx
{items.length && <ul>…</ul>}      // ❌ 空数组时页面出现一个 0
{items.length > 0 && <ul>…</ul>}  // ✅ 得到布尔值
```

### 3. 提前 `return null`

适合**整个组件在某些条件下不该存在**：

```tsx
function DraftBanner({ status }: { status: ArticleStatus }) {
  if (status !== "draft") return null;
  return <p>草稿仅自己可见</p>;
}
```

- 返回 `null` 表示「这次什么都不渲染」，组件仍然会被调用，只是不产出 DOM。
- 组件的 `return` 必须只有一个出口？不，可以有多个 `return`，但都要在**所有 hook 调用之后**（本阶段还没学 hook，先记住这条）。
- 页面组件直接 `return null` 会得到一张空白页（HTTP 仍然 200），一般只在子组件里这么用。

### 4. 映射表（状态一多就别堆三元）

```tsx
const statusMeta: Record<ArticleStatus, { label: string; tone: BadgeTone; hint: string }> = {
  draft: { label: "草稿", tone: "gray", hint: "仅自己可见" },
  published: { label: "已发布", tone: "green", hint: "所有人可见" },
  archived: { label: "已归档", tone: "red", hint: "不再展示在列表页" },
};

const meta = statusMeta[article.status];
```

比 `status === "draft" ? ... : status === "published" ? ... : ...` 好读，加状态只改表，不用改 JSX。

## 四、空状态：列表必须有「没有数据」的样子

三件事要同时做对：

1. 判断用 `.length > 0`，不要用 `.length`（见上面的 `0` 坑）。
2. 空状态要说清「为什么空 / 接下来能做什么」，不要只写一个「暂无」。
3. 加载中、空、有数据是三态，不要把空状态和加载状态混在一起（阶段 6 会真正做数据请求）。

```tsx
{comments.length > 0 ? (
  <ul>{comments.map((c) => <li key={c.id}>{c.text}</li>)}</ul>
) : (
  <p className="text-zinc-500">还没有评论，来写第一条吧。</p>
)}
```

## 五、条件渲染 vs CSS 隐藏

```tsx
{showPanel && <Panel />}          // ✅ 不渲染：组件不挂载、DOM 不存在
<Panel className={showPanel ? "" : "hidden"} />  // 渲染了但看不见
```

| | 条件渲染 | CSS 隐藏 |
| --- | --- | --- |
| DOM | 不存在 | 存在 |
| 组件状态 | 卸载后丢失 | 保留 |
| 副作用 / 请求 | 不会执行 | 会执行 |
| 可访问性 | 屏幕阅读器读不到 | `display:none` 也读不到，但 `opacity:0` 可能还能聚焦 |
| 动画 | 需要额外处理进入动画 | 切换类名即可 |

默认选条件渲染；需要保留输入内容、做过渡动画时才考虑 CSS 隐藏。

## 六、条件与 className

模板字符串 + 三元是最直接的写法：

```tsx
<p className={`rounded p-2 text-sm ${status === "draft" ? "bg-amber-50 text-amber-700" : "bg-zinc-50 text-zinc-600"}`}>
```

注意：

- 条件里的类名必须是**完整字符串**，Tailwind 才能扫描到（`bg-amber-50` 不能拆成 `bg-${color}-50`）。
- 类名冲突（同类属性）仍由 CSS 顺序决定，别指望拼在后面就覆盖（02 课踩过）。

## 七、动手练习

**文件**：`app/learn/04-conditional/page.tsx`

数据全部写在文件顶部，不需要 `"use client"`，没有点击交互。

### 第 1 步：一篇文章，三种状态

- 定义 `type ArticleStatus = "draft" | "published" | "archived"`。
- 定义 `type Article = { id: string; title: string; body: string; status: ArticleStatus }`，写一篇常量文章。
- `status` 先设成 `"draft"`，后面手动改成 `"published"` / `"archived"` 各看一次。
- 用 `Record<ArticleStatus, { label; tone; hint }>` 写状态映射，`tone` 用 [03 课](./03-list.md) 的 `BadgeTone`。
- 用 `Card` + `Badge` 展示：标题、状态 Badge、提示文案。

### 第 2 步：三种写法各用一次

- **三元**：`published` 显示正文，其他状态显示「提示 + 正文」。
- **`&&`**：`archived` 时额外显示一条「归档后不可编辑」的提示。
- **提前 `return null`**：写一个 `DraftBanner` 组件，只在 `draft` 时渲染，其余状态返回 `null`。

### 第 3 步：空状态

- 定义 `type Comment = { id: string; text: string }` 和 `const comments: Comment[] = []`（先空着）。
- 有评论时渲染 `<ul>`（`key={comment.id}`），没有时显示「还没有评论」。
- 手动加两条假数据，确认列表能出现；再清空，确认提示出现。
- **不要**写 `{comments.length && ...}`，用 `comments.length > 0`。

### 第 4 步（进阶）

- 给评论加 `visible?: boolean`，过滤掉不可见评论后再判断空状态（先 `filter` 再 `length`）。
- 写一个 `ArticleList` 组件：接收 `items: Article[]`，空数组时显示「暂无文章」，否则 `map` 渲染 `Card`；`key` 别忘了。
- 用模板字符串给不同状态加不同的底部背景色。

**参考实现**（`Card` / `Badge` 从 `app/learn/_components/` 引入）：

```tsx
import { Badge, type BadgeTone } from "../_components/badge";
import { Card } from "../_components/card";

type ArticleStatus = "draft" | "published" | "archived";

type Article = {
  id: string;
  title: string;
  body: string;
  status: ArticleStatus;
};

type Comment = { id: string; text: string };

const article: Article = {
  id: "conditional",
  title: "条件渲染练习",
  body: "这篇文章用来练习三种条件渲染写法。",
  status: "draft", // 手动改成 published / archived 看效果
};

const comments: Comment[] = [];

const statusMeta: Record<ArticleStatus, { label: string; tone: BadgeTone; hint: string }> = {
  draft: { label: "草稿", tone: "gray", hint: "仅自己可见" },
  published: { label: "已发布", tone: "green", hint: "所有人可见" },
  archived: { label: "已归档", tone: "red", hint: "不再展示在列表页" },
};

export default function ConditionalPage() {
  const meta = statusMeta[article.status];

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-8">
      <h1 className="text-3xl font-semibold">条件渲染</h1>

      <Card title={article.title} footer={<Badge label={meta.label} tone={meta.tone} />}>
        <DraftBanner status={article.status} />

        <div
          className={`rounded p-3 ${
            article.status === "published" ? "bg-green-50" : "bg-zinc-50"
          }`}
        >
          {article.status === "published" ? (
            <p>{article.body}</p>
          ) : (
            <p className="text-zinc-600">
              {meta.hint}：{article.body}
            </p>
          )}
        </div>

        {article.status === "archived" && (
          <p className="mt-3 text-sm text-red-600">归档后不可编辑。</p>
        )}
      </Card>

      <section aria-labelledby="comments-heading">
        <h2 id="comments-heading" className="mb-3 text-xl font-semibold">
          评论
        </h2>
        {comments.length > 0 ? (
          <ul className="space-y-2">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded border border-zinc-200 p-2">
                {comment.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">还没有评论，来写第一条吧。</p>
        )}
      </section>
    </main>
  );
}

function DraftBanner({ status }: { status: ArticleStatus }) {
  if (status !== "draft") return null;

  return (
    <p className="mb-3 rounded bg-amber-50 p-2 text-sm text-amber-700">
      草稿仅自己可见，发布前请检查。
    </p>
  );
}
```

## 八、验收

- [ ] 改成三种 `status`，页面内容、Badge 颜色、提示都跟着变
- [ ] 三种写法各出现一次：三元、`&&`、提前 `return null`
- [ ] `comments` 为空时显示「还没有评论」，非空时渲染带 key 的列表
- [ ] 没有任何 `{xxx.length && ...}` 的写法
- [ ] 能解释 `{0 && <p>x</p>}` 为什么渲染出 `0`
- [ ] 能解释条件渲染和 `hidden` 类隐藏的区别（至少说出 DOM 是否挂载）
- [ ] 全文件没有 `any`、没有 `"use client"`，`pnpm lint` 通过

## 九、本课易错点

| 报错 / 现象 | 原因 | 修法 |
| --- | --- | --- |
| 页面出现多余的 `0` | `{length && ...}` | 改 `length > 0` 或三元 |
| 页面出现 `NaN` | 拿数字做 `&&` 左边 | 改成显式比较 |
| 页面空白、无报错 | 组件提前 `return null`，或条件永远为假 | 检查条件；在子组件里用 `return null` |
| `Unexpected token` / JSX 解析失败 | 在 `{}` 里写了 `if` | 用三元、`&&`，或提前算好变量 |
| 三元嵌套三层读不懂 | 条件太多 | 用 `Record` 映射表或拆子组件 |
| 空状态永远不出现 | 判断写成了 `!comments`（空数组是 truthy） | 用 `length === 0` / `length > 0` |
| 提示文字被渲染成 `false` | `&&` 右边不是元素/`null` | 确保返回 JSX 或 `null` |
| `Each child in a list should have a unique "key"` | 条件分支里的 `map` 忘了 key | 根元素加 `key` |
| 条件写在 hook 之后 | 提前 return 破坏了 hook 顺序 | 所有 hook 调用放在 `return` 之前（阶段 2 起注意） |

## 十、自测题

1. JSX 里为什么不能直接写 `if`？有 `if` 需求时怎么办？
2. `{0 && <p>x</p>}`、`{"" && <p>x</p>}`、`{false && <p>x</p>}` 各渲染出什么？
3. 空数组的 `.length` 是多少？`{comments.length && <ul/>}` 会出什么问题？
4. 三元、`&&`、提前 `return null` 分别适合什么场景？
5. 组件返回 `null` 和返回 `<div />` 有什么区别？
6. 条件渲染和 `className="hidden"` 隐藏，DOM 上有什么区别？什么场景该用后者？
7. 状态有三个以上时，为什么推荐 `Record` 映射表而不是三元链？
8. `{status === "archived" && <p>归档</p>}` 在 `status` 是 `"draft"` 时返回什么？会渲染吗？
9. 写在 `{}` 里的条件类名，为什么不能是 `bg-${tone}-50`？
10. 空状态、加载中、有数据，为什么不能只用「空 / 非空」两个分支？（提示：真实请求需要时间）

<details>
<summary>参考答案</summary>

1. `{}` 只能放表达式，`if` 是语句。用三元、`&&`，或在 `return` 之前用普通 `if` 算好变量。
2. 分别渲染 `0`、什么都不渲染（空字符串）、什么都不渲染。
3. `0`；`0 && ...` 返回 `0`，React 会把数字 `0` 渲染出来。改用 `length > 0`。
4. 三元用于二选一；`&&` 用于「满足才显示，不满足什么都不显示」；提前 `return null` 用于整个组件在某些条件下不该存在。
5. `null` 不产生 DOM，组件不渲染任何东西；`<div />` 会产生一个空 div，占布局、可被查询到。
6. 条件渲染时 DOM 不存在、组件状态丢失、副作用不执行；`hidden` 时 DOM 仍存在、状态保留。需要保留输入/状态或做过渡动画时用隐藏。
7. 三元链每加一个状态都要改 JSX，容易嵌套过深；映射表把「状态 → 展示数据」集中成数据，新增状态只加一行。
8. 返回 `false`，React 不渲染 `false`，所以页面上什么都不出现。
9. Tailwind 靠扫描完整字符串生成 CSS，`bg-${tone}-50` 在源码里不是完整类名，扫描不到，不会生成对应样式。要写全量字面量或映射表。
10. 请求进行中时数据还没到，既不是「有数据」也不是「确实为空」；直接显示「暂无」会误导用户。需要单独区分 loading 状态（阶段 6 配合 `useEffect` / Suspense 做）。

</details>

## 十一、下一课

[05-final.md](./05-final.md)（预留）：把前四课合成一个静态个人主页，作为阶段 1 的结业作业。
