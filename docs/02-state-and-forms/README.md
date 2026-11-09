# 阶段 2：状态与表单（useState / 事件 / 受控表单 / 状态提升）

> 目标：让页面「动起来」——点击有响应、输入能回显、数据变了界面跟着变。
> 预计：5~6 天，每天 1~2 小时。
> 前置：[阶段 1 总览](../01-react-core/README.md) 读完，且能独立写出静态列表页。

## 〇、开始之前：10 分钟自查

阶段 2 的每个练习都会用到阶段 1 的东西。先用一道题自查，做不出来就先回去补对应课程：

> 给定 `const items = [{ id: "a", name: "React", level: 3 }]`，写出：`Card` 组件（接收 `title` + `children`）、`map` 渲染带 `key` 的列表、数组为空时显示「暂无数据」。

| 卡在哪 | 回去看 |
| --- | --- |
| 组件 / props / children 写不出 | [01-jsx.md](../01-react-core/01-jsx.md)、[02-props.md](../01-react-core/02-props.md) |
| 忘了 key、条件渲染写成 `{0 && ...}` | [03-list.md](../01-react-core/03-list.md)、[04-conditional.md](../01-react-core/04-conditional.md) |
| 不知道 `"use client"` 写哪 | `00-setup.md` 第三节 |

本阶段逐日计划已拆到 `docs/02-state-and-forms/`，课程编号从 **06** 开始（接阶段 1 的 01~05）。`app/learn/` 下的目录编号与文档编号一一对应。

## 一、这个阶段不学什么

- ❌ `useEffect` / `useRef` / 自定义 hook → 阶段 3
- ❌ 数据请求、`localStorage` 持久化 → 阶段 3、6
- ❌ Server Actions、`<form action={fn}>`、`useActionState`、`useFormStatus` → 阶段 6（本阶段表单全在浏览器里处理）
- ❌ Context / `useReducer` / Zustand → 阶段 7
- ❌ 表单库（react-hook-form、zod）、UI 组件库

本阶段的持久化只存在于**内存**：刷新页面数据就没了。这是刻意的，别急着上 `localStorage`，那会把「状态」和「副作用」两件事混在一起。

## 二、核心心智模型（比 API 重要）

### 1. 状态是一张快照，不是变量

一次渲染里，`count` 从头到尾是同一个值。`setCount` 不会修改它，只是**预约下一次渲染**：

```tsx
function handleTriple() {
  setCount(count + 1); // 下一次渲染 count = 1
  setCount(count + 1); // 还是按这次的 count=0 算，结果仍是 1
  setCount(count + 1); // 同上
} // 最终只 +1
```

想让三次都生效，用**函数式更新**：

```tsx
setCount((c) => c + 1);
setCount((c) => c + 1);
setCount((c) => c + 1); // 最终 +3
```

规则：**新值依赖旧值时，永远写 `setX(prev => ...)`**。不依赖旧值（如 `setCount(0)`、`setName(e.target.value)`）可以直接传值。

### 2. 状态不可变

```tsx
todos.push(newTodo);          // ❌ 原地修改，React 看不到变化
setTodos([...todos, newTodo]); // ✅ 造新数组
todos.sort();                  // ❌ sort 是原地修改
setTodos(todos.toSorted());    // ✅ toSorted 返回新数组（Node 20+ / 现代浏览器）
```

对象同理：`{ ...todo, done: !todo.done }`。**永远不要在 state 上调用 `push` / `sort` / `splice` / 直接赋值属性。**

### 3. 更新是批处理的，渲染是纯函数

一次事件里调多次 `setState`，React 合并成一次渲染。所以：

- 渲染函数（组件体）里**只做计算，不做副作用**：不改外部变量、不发请求、不写 `localStorage`。
- 开发模式下 StrictMode 会把渲染和 `useState` 初始化函数各跑两遍，就是为了抓出不纯的代码。
- 给 `useState` 传初始值时，如果计算很贵，用惰性初始化：`useState(() => heavyCompute())`。直接写 `useState(heavyCompute())` 每次渲染都会白算一遍。

### 4. 哪些东西才配当 state

拿到一个需求，先过这五问：

1. **会随交互/时间变化吗？** 不会 → 常量，放组件外。
2. **能从别的 state / props 算出来吗？** 能 → 派生值，直接算，别存。
   ```tsx
   const [todos, setTodos] = useState<Todo[]>([]);
   const remaining = todos.filter((t) => !t.done).length; // ✅ 派生
   // ❌ 不要再用一个 state 存 remaining，然后手动同步
   ```
3. **多个组件都要用吗？** 要 → 提升到最近的共同父组件（见 [09-lifting.md](./09-lifting.md)）。
4. **几个 state 总是一起变吗？** 是 → 合并成一个对象（本阶段）或 `useReducer`（阶段 7）。
5. **切换数据源时想清空表单吗？** 用 `key` 换组件身份，比在 effect 里手动重置干净。

**最常见的 bug 来源：存了本可以算出来的东西。** 两份数据一旦不同步，界面就开始撒谎。

### 5. 组件身份由 key 决定

`key` 不只是消除警告：它是 React 判断「这还是不是原来那个组件」的依据。key 变了 → 旧组件卸载、状态清空、重新挂载。

```tsx
// 切换用户时，Profile 内部所有 state 自动重置
<Profile key={user.id} user={user} />

// 列表里用 index 当 key：删掉第 1 项后，第 2 项「变成」了 index 0
// React 会复用它，输入框里的文字、展开状态全跟着错位
```

列表 key 用业务 id；需要「重置组件」时，主动用 key。

## 三、本项目的特殊约定

### 1. 需要交互的文件，第一行写 `"use client"`

```tsx
"use client"; // 必须是文件第一条语句，在 import 之前

import { useState } from "react";
```

漏了会报：`useState only works in Client Components. Add the "use client" directive at the top of the file...`

一个容易误解的点：**Client Component 也会在服务端预渲染一次（SSR）**。`"use client"` 只表示「这个组件要打包进浏览器、会水合（hydrate）」，不代表它只在浏览器跑。所以：

```tsx
// ❌ 渲染期读浏览器/时间/随机值：服务端和客户端结果不一致 → hydration mismatch
const [id] = useState(crypto.randomUUID());
const now = Date.now();

// ✅ 初始数据写死或来自常量；随机值放到事件处理里
const [todos, setTodos] = useState(initialTodos);
const add = () => setTodos((prev) => [...prev, { id: crypto.randomUUID(), ... }]);
```

本项目开了 `cacheComponents: true`，预渲染阶段读系统时间会直接构建报错（`app/learn/01-jsx/page.tsx` 里那条注释就是这个原因）。`localStorage`、`window`、`document` 也一样：渲染期碰不得，阶段 3 的 `useEffect` 里再碰。

### 2. 状态放哪、组件怎么拆

```
app/learn/07-forms/page.tsx        # 页面本体，加 "use client"
app/learn/07-forms/_components/    # 只被本页用到的子组件（下划线开头不产生路由）
app/learn/_components/             # 多个练习共用的 Card / Badge / Button
```

页面自己持有状态，子组件尽量**无状态、只收 props**。一个组件超过 80 行，或者出现「这个 state 只被某一块 UI 用」，就该往下拆。

### 3. 表单先用手写受控组件

阶段 6 会教你 Server Actions 那套（`<form action={...}>`、渐进增强、无 JS 也能提交）。现在老老实实 `useState` + `onSubmit`，把「数据怎么流」练明白，到阶段 6 才能看懂框架帮你省掉了什么。

## 四、逐日计划

| 课 | 文档 | 练习文件 | 内容 |
| --- | --- | --- | --- |
| 06 | [06-counter.md](./06-counter.md) | `app/learn/06-counter/page.tsx` | useState、事件、快照、派生值 |
| 07 | [07-forms.md](./07-forms.md) | `app/learn/07-forms/page.tsx` | 受控表单、校验、受控 vs 非受控 |
| 08 | [08-todo.md](./08-todo.md) | `app/learn/08-todo/page.tsx` | 增删勾选、筛选、不可变更新 |
| 09 | [09-lifting.md](./09-lifting.md) | `app/learn/09-lifting/page.tsx` | 状态提升、受控子组件 |
| 10 | [10-todo-final.md](./10-todo-final.md) | `app/learn/10-todo-final/page.tsx` | 结业作业 TodoList 完整版 |

课程编号**全局连续**：阶段 1 是 01~05，本阶段从 06 接上，不会再和 `02-props` 这类编号打架。

## 五、阶段总验收

- [ ] 给定一个表单需求（3~5 个字段 + 校验），能在 30 分钟内写出受控版本
- [ ] 看到 `setX(x + 1)` 这种写法能立刻判断是否有 bug
- [ ] 拿到一份 UI，能列出「哪些是 state、哪些是派生、state 该放哪一层」
- [ ] 能解释「状态提升」和「组件组合」各自的适用场景
- [ ] 能说清 Client Component 为什么还会在服务端跑一遍，以及由此带来的两条禁忌（渲染期读浏览器 API / 随机值）

## 六、自测题

1. 一次点击里执行 `setCount(count + 1)` 两次，界面加几？换成 `setCount((c) => c + 1)` 呢？
2. `setTodos([...todos, item])` 和 `setTodos((prev) => [...prev, item])` 在什么场景下结果不同？
3. 受控输入框只写了 `value` 忘了 `onChange`，会发生什么？控制台报什么？
4. `value={user.name}`，`user.name` 初始是 `undefined`，输入后为什么报 uncontrolled → controlled？怎么改？
5. 筛选后的列表、剩余数量、总价，为什么都不该用 `useState`？
6. 列表用 `index` 当 key，删除第一项后输入框内容错位，用「组件身份」解释这个现象。
7. 父组件把 `setKeyword` 直接传给子组件，和传 `(v) => setKeyword(v)` 有区别吗？
8. 复选框的值用 `value` 还是 `checked`？`e.target` 上的哪个字段能拿到它？
9. 为什么在组件体里写 `localStorage.getItem(...)` 或 `Date.now()` 会出问题？正确位置在哪（提示：下一个阶段）？
10. `<button>取消</button>` 放在 `<form>` 里，点击后表单提交了，为什么？怎么修？

## 七、常见错误对照

| 报错 / 现象 | 原因 | 修法 |
| --- | --- | --- |
| `useState only works in Client Components` | 文件没加指令 | 第一行加 `"use client";` |
| `useState is not defined` | 忘了 import | `import { useState } from "react";` |
| 点击后数据变了、界面没变 | 原地修改数组/对象 | 用展开 / `map` / `filter` / `toSorted` |
| 输入框打不了字 | 只写了 `value`，没写 `onChange` | 补 `onChange`，或改用 `defaultValue`（非受控） |
| `A component is changing an uncontrolled input to be controlled` | 初始值是 `undefined` | 初始值给 `""` / `false` / 明确的默认对象 |
| `Too many re-renders` | 在渲染期直接调 `setState` | 挪进事件处理，或用 `useEffect`（阶段 3） |
| `Objects are not valid as a React child` | 把整个 state 对象塞进 JSX | 取字段，或 `JSON.stringify` |
| 表单提交后整页刷新、数据清空 | 忘了 `e.preventDefault()` | `onSubmit` 第一行加 |
| `Each child in a list should have a unique "key"` | map 最外层没 key | `key={item.id}` |
| 删除后勾选/输入错位 | 用 index 当 key | 换成业务 id |
| 页面出现多余的 `0` | `{items.length && ...}` | 改 `items.length > 0 && ...` 或三元 |
| `Hydration failed` / 构建报时期相关错误 | 渲染期用了 `Date` / `Math.random` / `localStorage` | 初始值写死，随机/时间放事件处理 |
| 按钮点一下触发了两次提交 | 表单里的 `button` 默认 `type="submit"` | 非提交按钮写 `type="button"` |
| 中文输入时光标跳 / 丢字（少见） | 输入法组合事件与受控值竞争 | 用 `onCompositionStart/End` 跳过组合期，或先记住现象 |
| 勾选状态永远不变 | 用了 `value` 而不是 `checked` | `<input type="checkbox" checked={done} onChange={...} />` |

## 八、参考资料

本地（版本与项目一致，优先）：

- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`（`"use client"` 的边界）
- `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`（阶段 6 预告，现在只看开头知道有这回事）

在线：

- 添加交互（本阶段主线）：https://react.dev/learn/adding-interactivity
- 状态管理：https://react.dev/learn/managing-state
- `useState` API：https://react.dev/reference/react/useState
- 表单（受控 vs 非受控）：https://react.dev/reference/react-dom/components/input
- 状态提升示例：https://react.dev/learn/sharing-state-between-components

## 九、本阶段产出检查

完成后仓库里应该有：

```
app/learn/06-counter/page.tsx
app/learn/07-forms/page.tsx
app/learn/08-todo/page.tsx
app/learn/09-lifting/page.tsx
app/learn/10-todo-final/page.tsx
app/learn/10-todo-final/_components/   # 4 个左右的子组件
```

commit：`feat(learn): 阶段 2 状态与表单（TodoList）`

---

## 附：自测题参考答案（先自己写完再看）

1. 加 1；加 2。前者三次读到的都是同一次渲染的 `count`。
2. 同一次事件里连续新增多项时不同：直接读 `todos` 会覆盖掉前一次的结果，函数式更新每次都拿到最新队列值。
3. 输入框只读、无法输入；控制台提示 `You provided a 'value' prop to a form field without an 'onChange' handler`。
4. 初始 `value` 是 `undefined`，React 视为非受控；用户输入后变成字符串，React 视为受控。初始值给 `""` 或用 `?? ""` 兜底。
5. 它们都能由 `todos` / `filter` / 商品列表算出来；存成 state 会多一份需要手动同步的数据，容易不一致。
6. React 用 key 认组件。index 0 原本是 A 的状态，删掉 A 后 index 0 变成了 B，React 以为「还是同一个组件」，于是把 A 的输入值/展开状态留给了 B。
7. 本质上等价（`setKeyword` 接受 `string`，符合 `(v: string) => void`）。包一层的好处是将来要加日志/校验/转换时有地方写。
8. `checked`；`e.target.checked`（类型是 `boolean`）。`value` 是提交给表单的值，不是勾选状态。
9. Client Component 会在服务端预渲染，服务端没有 `localStorage`，而时间和随机值在两端不一致会导致 hydration 失败（本项目 `cacheComponents` 下还会构建报错）。正确位置是 `useEffect` 或事件处理，阶段 3 讲。
10. 表单内 `button` 的默认 `type` 是 `submit`。写 `type="button"`。
