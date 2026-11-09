# 10 · 结业作业：TodoList 完整版

> 所属阶段：[阶段总览](../README.md) · 课程 5/5
> 练习文件：`app/learn/10-todo-final/page.tsx`
> 前置：08、09

在 [08-todo.md](./08-todo.md) 的基础上补齐：

1. **编辑**：点「编辑」变成输入框，回车保存、Esc 取消、失焦取消（或保存，二选一但要一致）。
   - 需要两个 state：`editingId: string | null` 和 `draft: string`。
   - 空标题不允许保存。
2. **全选 / 清空已完成**：两个批量操作，仍然只能用 `map` / `filter`。
3. **计数与空状态**：筛选为空、整个列表为空，文案要区分。
4. **组件拆分**：`page.tsx` < 80 行，把 `TodoItem`、`TodoFilters`、`AddTodoForm` 抽到 `app/learn/10-todo-final/_components/`。
5. **无障碍**：删除/编辑按钮有可读文案（不要只有 ✕），复选框有 `<label>`，筛选按钮有 `aria-pressed`。

**验收（结业标准）**

- [ ] 增 / 删 / 改 / 勾选 / 筛选 / 全选 / 清空已完成全部可用
- [ ] 组件数 ≥ 4，`page.tsx` 本体 < 80 行
- [ ] 全文件没有 `any`、没有 `useEffect`、没有 `localStorage`、没有 `index` 当 key
- [ ] 每种操作后「剩余 N 项」都正确（说明没有重复 state）
- [ ] 浏览器控制台 0 报错 0 警告，`pnpm lint` 通过
- [ ] 能用 3 分钟讲清楚：state 有哪几个、每个为什么必须存在、数据怎么流动

**推荐的数据结构**

```
10-todo-final/
├── page.tsx                # 持有 todos / filter / editingId / draft + 四个 handler
└── _components/
    ├── AddTodoForm.tsx     # 受控输入 + onSubmit(title)
    ├── TodoFilters.tsx     # 受控 filter + 计数
    ├── TodoItem.tsx        # 单条展示 / 编辑态，收 onToggle / onDelete / onSave
    └── TodoList.tsx        # 空状态 + map
```

> 阶段 3 会把「刷新不丢数据」补上（`useEffect` + `localStorage`），正好检验今天拆的组件好不好接。

---

[← 09-lifting.md](./09-lifting.md)
