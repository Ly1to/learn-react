# 06 · 计数器：useState 与事件

> 所属阶段：[阶段总览](../README.md) · 课程 1/5
> 练习文件：`app/learn/06-counter/page.tsx`
> 前置：阶段 1 全部课程

**需求**

- 计数器：当前值大字显示，`+步长` / `-步长` / `重置` 三个按钮。
- 步长用一个受控 `<select>` 选 `1 / 5 / 10`（先别查资料，想想 `value` 和 `onChange` 怎么写）。
- 边界：不能小于 0、不能大于 100；到边界时按钮 `disabled`，并显示「到顶了 / 到底了」。
- 复用阶段 1 的 `Badge`：`count >= 100` 显示红色「已满」，否则灰色「可继续」。

**验收**

- [ ] 能解释为什么用 `setCount((c) => c + step)` 而不是 `setCount(count + step)`
- [ ] 能解释 `atMax` / `atMin` 为什么不该用 `useState` 存
- [ ] 连点「+」时不会越界（`Math.min` / `Math.max` 兜底）
- [ ] 控制台 0 警告

**参考骨架**（类型和样式自己补全）：

```tsx
"use client";

import { useState } from "react";

export default function CounterPage() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const atMin = count === 0;
  const atMax = count >= 100;

  const increase = () => setCount((c) => Math.min(100, c + step));
  const decrease = () => setCount((c) => Math.max(0, c - step));

  return (
    <main className="mx-auto max-w-xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">计数器</h1>
      <p className="font-mono text-5xl tabular-nums">{count}</p>
      <div className="flex gap-3">
        <button onClick={decrease} disabled={atMin}>-{step}</button>
        <button onClick={increase} disabled={atMax}>+{step}</button>
        <button onClick={() => setCount(0)}>重置</button>
      </div>
      {/* select 的 value 要转数字，e.target.value 永远是 string */}
      <select value={step} onChange={(e) => setStep(Number(e.target.value))}>
        {[1, 5, 10].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button onClick={handleTriple}>一次 +3（快照实验）</button>
    </main>
  );
}
```

`handleTriple` 自己实现：先写三个 `setCount(count + 1)` 点一下看结果，再改成函数式更新对比。

---

[07-forms.md →](./07-forms.md)
