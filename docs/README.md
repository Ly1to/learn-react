# React 学习文档（本项目专用）

这套文档是为 **learn-react** 这个仓库写的，不是通用教程。所有示例、路径、约定都以本项目的实际配置为准：

| 项 | 版本 / 说明 |
| --- | --- |
| Next.js | 16.4.5（App Router，`cacheComponents: true`） |
| React | 19.3.0 |
| 语言 | TypeScript（`strict: true`） |
| 样式 | Tailwind CSS v4（`@import "tailwindcss"`） |
| 包管理 | pnpm（仓库里同时存在 `package-lock.json`，建议删掉只留 pnpm） |
| 路径别名 | `@/*` → 项目根目录（`tsconfig.json`） |

## 文档结构

**阶段 = 一个总览文件，课 = 一个独立文件。** 编号全局连续，不会出现「阶段 2 的第 1 课」和「阶段 1 的第 2 课」都叫 02 的情况。

```
docs/
├── 00-setup.md                 # 阶段 0
├── 01-react-core/              # 阶段 1
│   ├── README.md               # 阶段总览（目标 / 知识点 / 验收 / 自测 / 参考）
│   ├── 01-jsx.md               # ✅ 已就绪
│   ├── 02-props.md             # ✅ 已就绪
│   ├── 03-list.md              # 🚧 预留
│   ├── 04-conditional.md       # 🚧 预留
│   └── 05-final.md             # 🚧 预留（结业作业）
└── 02-state-and-forms/         # 阶段 2
    ├── README.md               # 阶段总览
    └── 06-counter.md ...       # 课程 06~10
```

课程编号 = `app/learn/` 下的目录编号：01-jsx、02-props、……、06-counter、07-forms、……，文档和代码一眼对得上。

## 怎么用这套文档

1. **先读阶段总览，再按课程编号顺序做**，不要跳。每课都是下一课的前置。
2. 每课文件的结构固定：**目标 → 知识点 → 动手练习 → 验收 → 自测题 → 参考资料**。
3. 练习写到 `app/learn/<课程号>-<主题>/page.tsx`，访问 `http://localhost:3000/learn/...` 就能看。标记「预留」的课不要提前写。
   - 不要改 `app/page.tsx` 当练习场，那是项目入口，保持干净。
4. **先自己写，卡住 20 分钟以上再翻 AI**。跑不通时先读报错的第一行。
5. 学完一个阶段，在下面的进度表里打勾，并把练习代码 commit 一次。

## 阶段总览

> 目前**课程 01、02 与阶段 2（06~10）已就绪**，阶段 1 的 03~05 及后续阶段按进度补齐，不要提前看。
> 阶段 2 开头的「10 分钟自查」会帮你确认阶段 1 的 props / 列表 / 条件渲染是否真的掌握。

| 阶段 | 状态 | 文档 | 核心内容 |
| --- | --- | --- | --- |
| 0 | ✅ 已就绪 | [00-setup.md](./00-setup.md) | 跑起来、认目录、三条硬规则 |
| 1 | 🚧 01~02 就绪 | [01-react-core.md](./01-react-core/README.md) | 课程 01~05：JSX、组件、props、列表、条件渲染 |
| 2 | ✅ 已就绪 | [02-state-and-forms.md](./02-state-and-forms/README.md) | 课程 06~10：useState、事件、受控表单、状态提升 |
| 3 | ⬜ 待写 | `03-effects-and-refs.md` | useEffect、useRef、自定义 hook |
| 4 | ⬜ 待写 | `04-next-routing.md` | 路由、layout、Link、loading/error |
| 5 | ⬜ 待写 | `05-server-client.md` | RSC 与 Client 的边界 |
| 6 | ⬜ 待写 | `06-data-and-cache.md` | 数据获取、`use cache`、表单与服务端函数 |
| 7 | ⬜ 待写 | `07-state-scaling.md` | Context、useReducer、URL 状态、状态库 |
| 8 | ⬜ 待写 | `08-quality-ship.md` | TS 类型、测试、性能、部署 |

后续阶段会沿用同一套结构（阶段总览 + 一课一文件），并在写之前根据你阶段 1 的实际掌握情况调整难度。

## 进度表

- [ ] 阶段 0 环境跑通
- [ ] 阶段 1 React 基础（产出：静态个人主页）
- [ ] 阶段 2 状态与表单（产出：TodoList）
- [ ] 阶段 3 副作用与 ref（产出：搜索防抖 / 计时器）
- [ ] 阶段 4 路由（产出：多页面小站）
- [ ] 阶段 5 Server / Client 组件
- [ ] 阶段 6 数据获取与缓存
- [ ] 阶段 7 状态管理（产出：完整 CRUD 应用）
- [ ] 阶段 8 类型 / 测试 / 部署

## 贯穿全程的两个小项目

1. **静态个人主页**（阶段 1 结业）→ 升级成 **TodoList**（阶段 2~3）—— 纯客户端，练 React 本身。
2. **迷你博客 / 图书管理**（阶段 4~7）—— 列表页 + 详情页 + 新增表单 + 假数据源，练 Next 的能力。

小项目比 20 个 demo 有用。做完一个能跑、能部署、能讲清楚数据怎么流动的项目，等于过了初级门槛。
