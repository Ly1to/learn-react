# 07 · 受控表单

> 所属阶段：[阶段总览](../README.md) · 课程 2/5
> 练习文件：`app/learn/07-forms/page.tsx`
> 前置：06 计数器

**需求：一个报名表单**

| 字段 | 控件 | 校验 |
| --- | --- | --- |
| 姓名 | text | 去空格后 ≥ 2 字 |
| 邮箱 | email | 含 `@` 且含 `.` |
| 年龄 | number | 1~120 的整数 |
| 同意条款 | checkbox | 必须勾选 |

要求：

- 一个 `form` state 对象存四个字段；`onChange` 用 `name` 属性 + 计算属性名复用同一个 handler。
- 校验写成**组件外的纯函数** `validate(form)`，返回值当派生值用，不要存进 state。
- 有错误时输入框标红 + 下方显示错误文案；`aria-invalid` 和 `aria-describedby` 关联上。
- 全部通过才能点「提交」；提交后 `preventDefault()`，把结果显示成一张卡片（用 `JSON.stringify` 也行）。
- 加一个「重置」按钮（`type="button"`），清空表单和结果。

**验收**

- [ ] 能说出受控组件的数据流：`state → value → 用户输入 → onChange → setState → 重渲染`
- [ ] 能解释为什么 `value` 不配 `onChange` 会变成只读，以及为什么 `value={undefined}` 会报「uncontrolled → controlled」
- [ ] 能说出 `e.target.value` 在 `type="number"` 时是什么类型（答案：`string`）
- [ ] 表单里非提交按钮都写了 `type="button"`（不写默认是 submit，会触发表单提交）
- [ ] 用 Tab 键能完整走完表单，label 点一下能聚焦输入框

**核心代码参考**

```tsx
"use client";

import { useState } from "react";

type FormState = { name: string; email: string; age: string; agree: boolean };

const EMPTY: FormState = { name: "", email: "", age: "", agree: false };

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.name.trim().length < 2) errors.name = "名字至少 2 个字";
  if (!form.email.includes("@") || !form.email.includes(".")) errors.email = "邮箱格式不对";
  const age = Number(form.age);
  if (!form.age || !Number.isInteger(age) || age < 1 || age > 120) errors.age = "年龄需为 1~120 的整数";
  if (!form.agree) errors.agree = "请先同意条款";
  return errors;
}

export default function FormPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  const errors = validate(form);                 // 派生
  const isValid = Object.keys(errors).length === 0;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    // 复选框用 checked，其他用 value；type 收窄后 TS 才认 checked
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // 不写会整页刷新，state 全丢
    if (!isValid) return;
    setSubmitted(form); // form 是不可变对象，这里存下的是一份快照
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <input
        id="name"
        name="name"
        value={form.name}
        onChange={handleChange}
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? "name-error" : undefined}
      />
      {errors.name && <p id="name-error" className="text-sm text-red-600">{errors.name}</p>}
      {/* email / age / checkbox 同理 */}
      <button type="submit" disabled={!isValid}>提交</button>
      <button type="button" onClick={() => { setForm(EMPTY); setSubmitted(null); }}>
        重置
      </button>
      {submitted && <pre>{JSON.stringify(submitted, null, 2)}</pre>}
    </form>
  );
}
```

**对照实验：非受控（uncontrolled）表单**

浏览器自己管值，提交时一次性读出来。适合文件上传、超大表单、接第三方库：

```tsx
<form
  onSubmit={(e) => {
    e.preventDefault();
    const formEl = e.currentTarget;       // 先存下来，异步里 currentTarget 会变 null
    const data = new FormData(formEl);    // 只能拿到带 name 的字段
    console.log(data.get("email"));
  }}
>
  <input name="email" defaultValue="" /> {/* 用 defaultValue，不是 value */}
  <button type="submit">提交</button>
</form>
```

| | 受控 | 非受控 |
| --- | --- | --- |
| 值的来源 | React state | DOM 自己 |
| 实时校验 / 联动 | 方便 | 麻烦 |
| 每次输入重渲染 | 会 | 不会 |
| 文件 `input[type=file]` | 拿不到 | 只能用它 |

---

[← 06-counter.md](./06-counter.md) · [08-todo.md →](./08-todo.md)
