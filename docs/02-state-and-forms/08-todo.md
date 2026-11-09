# 08 · 列表状态：TodoList 第一版

> 所属阶段：[阶段总览](../README.md) · 课程 3/5
> 练习文件：`app/learn/08-todo/page.tsx`
> 前置：07 受控表单

第一版 TodoList：**只做增、删、勾选、筛选**，先不做编辑。

**需求**

- `type Todo = { id: string; title: string; done: boolean }`，初始数据用固定 id 的常量数组（3 条即可）。
- 顶部一个 `<form onSubmit>` 加输入框 + 按钮：回车和点击都能新增；输入为空不新增；新增后清空输入。
- 每项：复选框切换完成、删除按钮、完成后文字加 `line-through`。
- 筛选：`all | active | done` 三个按钮（受控，当前项高亮）。
- 下面显示「剩余 N 项未完成」和「共 M 项」。
- 筛选结果为空时显示「暂无数据」。

**验收**

- [ ] 更新数组时只用了 `map` / `filter` / 展开，没有 `push` / `splice`
- [ ] `visible`、`remaining` 都是派生值，state 里没有它们
- [ ] 新增用 `crypto.randomUUID()` 生成 id（在事件处理里调用，不在渲染期）
- [ ] 删除中间项后，剩余项的复选框状态没有错位
- [ ] 输入框在 `<form>` 里，按回车能提交

**核心代码参考**

```tsx
type Todo = { id: string; title: string; done: boolean };
type Filter = "all" | "active" | "done";

const [todos, setTodos] = useState<Todo[]>(initialTodos);
const [filter, setFilter] = useState<Filter>("all");

const visible = todos.filter((t) =>
  filter === "all" ? true : filter === "active" ? !t.done : t.done
);
const remaining = todos.filter((t) => !t.done).length;

// 切换
setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
// 删除
setTodos((prev) => prev.filter((t) => t.id !== id));
// 新增
setTodos((prev) => [...prev, { id: crypto.randomUUID(), title, done: false }]);
```

**故意踩一次的坑**：把 `key={todo.id}` 改成 `key={index}`，然后在每项里放一个 `<input>`，删掉第一项，观察输入框内容怎么跑偏。这个现象就是「key 决定组件身份」。

---

[← 07-forms.md](./07-forms.md) · [09-lifting.md →](./09-lifting.md)
