"use client";

import { Badge } from "../_components/badge";
import { useState } from "react";

export default function CounterPage() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const atMin = count === 0;
  const atMax = count >= 100;

  const increase = () => setCount(c => Math.min(100, c + step));
  const decrease = () => setCount(c => Math.max(0, c - step));

  const handleTriple = () => setCount(c => Math.min(100, c + 3));

  const buttonClass =
    "inline-flex h-9 items-center rounded-lg border border-zinc-300 px-3 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800";

  const secondaryButtonClass =
    "inline-flex h-9 items-center rounded-lg px-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800";

  return (
    <main className="mx-auto w-full max-w-xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">计数器</h1>

      <div className="flex items-baseline gap-3">
        <p className="font-mono text-5xl tabular-nums">{count}</p>
        <Badge label={atMax ? "已满" : "可继续"} tone={atMax ? "red" : "gray"} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={`${buttonClass} w-20 tabular-nums`} onClick={decrease} disabled={atMin}>-{step}</button>
        <button type="button" className={`${buttonClass} w-20 tabular-nums`} onClick={increase} disabled={atMax}>+{step}</button>
        <button type="button" className={buttonClass} onClick={() => setCount(0)}>重置</button>
      </div>

      <p className="h-5 text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
        {atMax ? "到顶了，最大值 100" : atMin ? "到底了，最小值 0" : ""}
      </p>

      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        步长
        <span className="relative inline-flex">
          <select
            className="h-9 w-20 cursor-pointer appearance-none rounded-lg border border-zinc-300 bg-transparent pl-3 pr-8 text-sm tabular-nums transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-700 dark:hover:bg-zinc-800"
            value={step}
            onChange={e => setStep(Number(e.target.value))}
          >
            {[1, 5, 10].map(s => (
              <option value={s} key={s}>{s}</option>
            ))}
          </select>

          <span
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400"
            aria-hidden="true"
          >
            ▾
          </span>
        </span>
      </label>

      <button
        type="button"
        className={secondaryButtonClass}
        onClick={handleTriple}
        disabled={atMax}
        title="演示：一次函数式更新 +3，步长不会影响到它"
      >
        一次 +3
      </button>

    </main>
  );
}
