# 阶段 1：React 基础（JSX / 组件 / props / 列表 / 条件渲染）

> 目标：不查资料写出**纯展示**的组件树，理解「数据怎么变成界面」。
> 预计：5~7 天，每天 1~2 小时。
> 前置：[00-setup.md](../00-setup.md) 全部完成。
>
> **本文件是阶段总览。** 真正的课程拆在 `docs/01-react-core/` 里，一课一个文件，按编号顺序做。

## 课程表

| 课 | 状态 | 文档 | 练习文件 | 核心内容 |
| --- | --- | --- | --- | --- |
| 01 | ✅ 已就绪 | [01-jsx.md](./01-jsx.md) | `app/learn/01-jsx/page.tsx` | JSX 语法、`{}`、组件、语义化标签 |
| 02 | ✅ 已就绪 | [02-props.md](./02-props.md) | `app/learn/02-props/page.tsx` | props、类型、children 插槽、默认值、组件拆分 |
| 03 | 🚧 预留 | [03-list.md](./03-list.md) | `app/learn/03-list/page.tsx` | `map` 渲染、`key` 规则、不可变排序 |
| 04 | 🚧 预留 | [04-conditional.md](./04-conditional.md) | `app/learn/04-conditional/page.tsx` | 三元、短路、提前 return、空状态 |
| 05 | 🚧 预留 | [05-final.md](./05-final.md) | `app/learn/05-final/page.tsx` | 结业作业：静态个人主页 |

规则：**上一课验收没打勾，不要开下一课。** 预留文件不要提前写在练习目录里，等生成后按顺序做。

## 一、这个阶段不学什么

先划掉这些，避免分心：

- ❌ `useState` / 事件交互 → 阶段 2
- ❌ `useEffect` / 数据请求 → 阶段 3、6
- ❌ Next 的缓存、Server Actions、`use cache` → 阶段 6
- ❌ Redux / Zustand / 组件库 / 表单库

本阶段的组件**全是静态的**，所以：**一个 `"use client"` 都不用写**。这不是偷懒，是刻意让你体会「没有交互的组件根本不需要进浏览器」。等阶段 2 需要点击时再回头对比。

## 二、知识点地图

按课次对应，看到不熟的就回到对应课程：

1. **JSX 是什么**：不是 HTML。`class` → `className`，`for` → `htmlFor`，标签必须闭合，只能返回一个根节点。 → 01
2. **`{}` 里能放什么**：表达式（变量、运算、三元、函数调用），不能放语句（`if` / `for`）。 → 01
3. **组件**：首字母大写的函数，返回 JSX；组件组合 = 像标签一样用 `<Card />`。 → 01
4. **Fragment**：`<>...</>`，返回多个并列节点又不额外包一层 `div`。 → 01
5. **语义化标签**：`main` / `header` / `section` / `article` / `footer`，`h1` 一页一个。 → 01
6. **props**：从外部传入的只读数据，用 TS `type` 定义。 → 02
7. **`children` 与多插槽**：`ReactNode` 类型的特殊 prop，用来做组合。 → 02
8. **默认值**：可选 prop + 解构默认值，只在 `undefined` 时生效。 → 02
9. **列表渲染**：`array.map()` + `key`。 → 03
10. **`key` 的规则**：唯一、稳定、不用数组下标。 → 03
11. **条件渲染**：三元、短路 `cond && view`、提前 `return null`。 → 04
12. **派生值**：能从已有数据算出来的，就不要再存一份（本阶段先用在条件判断上）。 → 04
13. **样式**：Tailwind 类名写进 `className`，字符串拼接用模板字符串。 → 全程
14. **组件拆分粒度**：一个组件只做一件事，超过 80 行就该拆。 → 02

## 三、阶段总验收

- [ ] 给定一段商品数据（数组 + 对象），能在 15 分钟内写出带条件的列表页
- [ ] 能画出数据流向：常量 → props → 组件 → 渲染
- [ ] 能解释 Server Component 下为什么静态页面不需要 JS 交互代码
- [ ] 能解释 props 只读、key 的作用、`{0 && ...}` 的坑
- [ ] 五课练习全部验收，`pnpm lint` 通过

## 四、自测题

1. JSX 里 `{ }` 能放 `if (a) {}` 吗？不能的话怎么写条件？
2. 组件名为什么必须大写？写成 `<card />` 会发生什么？
3. `key` 加在 `map` 的哪一层？放在 `<li>` 里面的 `<span>` 上行不行？
4. props 能被子组件修改吗？想在父组件基础上改怎么办？
5. `{0 && <p>x</p>}` 渲染出什么？为什么？怎么改？
6. `<Card title="a" children={<p>x</p>} />` 和 `<Card title="a"><p>x</p></Card>` 等价吗？
7. 同一个数组渲染两次，key 会冲突吗？
8. 为什么本阶段的组件不需要 `"use client"`？
9. `tone?: "green" | "red"` 里不传 `tone` 时，默认值在什么情况下不生效？
10. 一个组件收到 10 个 props、其中一半只是原样透传，说明什么？

> 01、02 两课的答案在各课文末；03~05 的题目等对应课程生成后再补完整答案。

## 五、常见错误对照（本阶段）

| 报错 / 现象 | 原因 | 修法 |
| --- | --- | --- |
| `Objects are not valid as a React child` | 把对象直接塞进 `{}` | 取具体字段，或 `JSON.stringify` |
| `Each child in a list should have a unique "key"` | map 最外层没 key | 最外层元素加 `key={item.id}` |
| 页面空白、无报错 | 忘了 `export default`，或函数没 `return` | 检查 `return` 和导出 |
| 样式不生效 | 写成了 `class=` | 改 `className=` |
| 页面出现多余的 `0` | 用 `&&` 判断数字 | 改三元或 `> 0` |
| `Property 'xxx' does not exist on type` | props 没定义类型/字段名拼错 | 补 `type XxxProps`，对齐属性名 |
| `Cannot assign to read only property` | 在子组件里改 props | 用局部变量，或回调让父组件改 |
| `'children' is missing` | props 类型漏了 `children` | 加 `children: ReactNode` |
| `Adjacent JSX elements must be wrapped` | 返回了多个根节点 | 包父元素或 Fragment |
| `Hydration failed`（阶段 2 起常见） | 渲染期用了时间/随机值/浏览器 API | 初始值写死，副作用放事件或 effect |

## 六、参考资料

本地（版本和你的项目完全一致，优先看这个）：

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`

在线：

- 快速入门：https://react.dev/learn
- 描述 UI 全章（本阶段主线）：https://react.dev/learn/describing-the-ui
- 组件与 props：https://react.dev/learn/passing-props-to-a-component
- key 为什么重要：https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key

## 七、本阶段产出检查

完成后你的仓库里应该有：

```
app/learn/01-jsx/page.tsx
app/learn/02-props/page.tsx
app/learn/03-list/page.tsx
app/learn/04-conditional/page.tsx
app/learn/05-final/page.tsx
app/learn/_components/        # 可选，复用 Card / Badge
```

commit 一次：`feat(learn): 阶段 1 React 基础练习`

---

下一阶段：[02-state-and-forms.md](../02-state-and-forms/README.md)（课程编号从 06 开始，接在本阶段 05 之后）。
