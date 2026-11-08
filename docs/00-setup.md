# 阶段 0：环境、目录与约定

> 目标：能启动、能改、能看到效果，并且知道每个文件是干嘛的。
> 预计：1 天。

## 一、先跑起来

```bash
cd ~/Projects/web/react/learn-react
pnpm dev
```

打开 http://localhost:3000 。

然后做三件事验证工具链：

1. 打开 `app/page.tsx`，把标题里的 `page.tsx` 改成 `Hello React`，保存 → 浏览器自动更新（HMR）。
2. 保存时故意写错一个标签 → 看错误覆盖层的样式和报错位置。
3. 打开 `app/globals.css`，给 `body` 加一句 `background: #111;`，看是否生效（Tailwind v4 + `@theme`）。

顺手清理：仓库里同时有 `package-lock.json` 和 `pnpm-lock.yaml`。

```bash
rm package-lock.json
```

以后统一用 `pnpm`，否则依赖版本会打架。

## 二、认识目录

```
learn-react/
├── app/                 # 路由都在这，文件夹 = URL
│   ├── layout.tsx       # 根布局，必须有 <html> <body>，包住所有页面
│   ├── page.tsx         # 首页 "/"
│   ├── globals.css      # 全局样式（Tailwind 入口）
│   └── favicon.ico
├── public/              # 静态文件，直接 /next.svg 这样引用
├── docs/                # 你现在看的这套文档
├── next.config.ts       # Next 配置（本项目开了 cacheComponents）
├── tsconfig.json        # TS 配置，@/* 别名在这里
├── eslint.config.mjs
└── package.json
```

关键认知：**没有 `index.html`，没有 `src/main.tsx`，没有 `ReactDOM.createRoot`。**

这是 Next.js 和「用 Vite 创建的纯 React」最大的区别：入口由框架接管，你只写页面。

## 三、本项目的三条硬规则

### 1. 文件即路由

| 文件 | URL |
| --- | --- |
| `app/page.tsx` | `/` |
| `app/learn/page.tsx` | `/learn` |
| `app/learn/01-jsx/page.tsx` | `/learn/01-jsx` |
| `app/blog/[slug]/page.tsx` | `/blog/任意值` |

一个文件夹里必须有 `page.tsx` 才能被访问。只有 `layout.tsx` 没有 `page.tsx` 的文件夹不产生路由。

### 2. 默认是 Server Component，交互要加 `"use client"`

`app/` 下的组件默认在**服务端**渲染，所以：

```tsx
// ❌ 报错：useState / onClick 在服务端组件里不存在
export default function Page() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

```tsx
// ✅ 文件第一行加指令
"use client";

import { useState } from "react";

export default function Page() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

规则记牢：**用到 state / 事件 / useEffect / 浏览器 API（localStorage、window）/ 自定义 hook → 这个文件第一行必须 `"use client"`。**

### 3. 样式用 Tailwind 类名，直接写在 `className`

```tsx
<div className="flex items-center gap-4 rounded-lg border p-4">
```

不需要单独建 css 文件。本项目 Tailwind v4 已经配好（`app/globals.css` + `next.config.ts` 里的 turbopack 规则）。

## 四、练习目录约定

所有练习放：

```
app/learn/<编号>-<主题>/page.tsx
```

第一个练习文件：

`app/learn/01-jsx/page.tsx`

以后再回来看自己写过的练习，是最好的复习材料。

## 五、验收标准

- [ ] `pnpm dev` 能启动，首页能打开
- [ ] 改文字能看到 HMR 生效
- [ ] 能说出 `app/layout.tsx` 和 `app/page.tsx` 的区别
- [ ] 能说出为什么有些文件要写 `"use client"`
- [ ] 建出 `app/learn/hello/page.tsx`，访问 `/learn/hello` 显示一行字

## 六、自测题

1. 为什么删除 `app/layout.tsx` 项目会报错？
2. `app/learn/page.tsx` 和 `app/learn/hello.tsx` 哪个能访问？为什么？
3. 在浏览器里按 Ctrl+U 查看源代码，能看到页面文字吗？这说明什么？（提示：想想「服务端渲染」）

## 参考资料

- 本地文档：`node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- 本地文档：`node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- 在线：https://nextjs.org/docs/app/getting-started/project-structure
