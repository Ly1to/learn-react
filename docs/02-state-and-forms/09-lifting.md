# 09 · 状态提升与受控子组件

> 所属阶段：[阶段总览](../README.md) · 课程 4/5
> 练习文件：`app/learn/09-lifting/page.tsx`
> 前置：08 TodoList 第一版

**需求：商品筛选 + 统计**

- 常量商品数组（`id`、`name`、`price`、`category`）。
- 三个子组件，**全部无状态**：
  - `<SearchBox value={keyword} onChange={setKeyword} />`：受控输入框。
  - `<CategoryTabs value={category} onChange={setCategory} />`：分类按钮组。
  - `<Summary count={visible.length} total={total} />`：显示命中数量和总价。
- 页面组件持有 `keyword`、`category`；`visible`、`total` 从它们派生（总价用 `reduce`）。
- 再补一个「只看 ¥100 以下」的复选框，状态同样放在页面里。

**验收**

- [ ] `SearchBox` / `CategoryTabs` 里没有自己的 `useState`（编辑草稿除外）
- [ ] 能画出数据流：`page state → props ↓`，`子组件事件 → 回调 ↑ → page setState`
- [ ] 子组件 props 类型写成 `onChange: (next: string) => void`，父组件直接传 `setKeyword` 能通过类型检查
- [ ] 能说出「为什么把 state 放子组件里会导致 Summary 拿不到数据」

**判断是否该提升**

- 两个组件要显示同一份数据 → 提升到共同父级。
- 一个组件的操作要改变另一个组件 → 提升。
- 只有自己用、别人不关心（如「是否展开」）→ 留在自己身上，别什么都往上提。

**进阶：不想提升怎么办？**

把子组件当 `children` 传下去，而不是在父组件里 import 再传一堆 props。这叫组件组合，阶段 5 讲 Server/Client 边界时会大量用到：

```tsx
<Layout sidebar={<Filters value={filter} onChange={setFilter} />}>
  <List items={visible} />
</Layout>
```

---

[← 08-todo.md](./08-todo.md) · [10-todo-final.md →](./10-todo-final.md)
