# 01 · JSX 与组件

> 所属阶段：[阶段总览](../README.md)（React 基础）
> 预计：1~2 天 · 练习文件：`app/learn/01-jsx/page.tsx`

## 一、本课目标

- 知道 JSX 和 HTML 的差异，能解释为什么是 `className` / `htmlFor`。
- 知道 `{}` 里能放表达式、不能放语句，并会用三元和 `&&` 写条件。
- 能写函数组件、像标签一样组合组件，能解释组件名为什么首字母大写。
- 会用 `<>...</>` 返回多个并列节点。
- 会用语义化标签搭一个页面骨架（`main` / `header` / `section` / `footer`）。

## 二、JSX 不是 HTML

```tsx
// HTML                          // JSX
<div class="card">               <div className="card">
<label for="name">               <label htmlFor="name">
<img src="a.png">                <img src="a.png" />
<br>                             <br />
```

差异清单：

| HTML | JSX | 原因 |
| --- | --- | --- |
| `class` | `className` | `class` 是 JS 保留字 |
| `for` | `htmlFor` | 同上 |
| `onclick="fn()"` | `onClick={fn}` | 事件是函数引用，不是字符串 |
| `style="color:red"` | `style={{ color: "red" }}` | 样式是对象，属性名驼峰 |
| 标签可省略闭合 | 所有标签必须闭合 | JSX 会被编译成 JS 函数调用 |
| 可以返回多个根节点 | 只能返回一个根节点 | 函数只有一个返回值 |

需要并列多个节点又不想多包一层 `div` 时，用 Fragment：

```tsx
return (
  <>
    <h1>标题</h1>
    <p>说明</p>
  </>
);
```

> 为什么不是 HTML：JSX 是 `React.createElement(...)`（React 19 里是 `jsx(...)`）的语法糖，最终产出的是普通 JS 对象，React 再把这些对象变成 DOM。浏览器不认识 JSX，是 Next/SWC 在构建时把它编译掉的。

## 三、`{}` 里能放什么

**只能放表达式**（有返回值的东西），不能放语句（`if`、`for`、`while`、`var`）。

```tsx
const name = "George";
const age = 27;
const isAdult = age >= 18;

<p>{name}</p>                         // ✅ 变量
<p>{age * 2}</p>                      // ✅ 运算
<p>{isAdult ? "成年" : "未成年"}</p>   // ✅ 三元
<p>{skills.map((s) => s.name)}</p>    // ✅ 函数调用
<p>{isAdult && "已成年"}</p>           // ✅ 短路

{ if (isAdult) { ... } }              // ❌ 语句
<p>{for (let i = 0; i < 3; i++) {}}</p>// ❌ 语句
```

JSX 里的注释也要用表达式包起来：`{/* 这是注释 */}`。

> 小坑：`{0 && <p>x</p>}` 会渲染出一个 `0`。判断数字用 `> 0` 或三元，别用 `&&`。

## 四、组件

组件就是**返回 JSX 的函数**，名字必须大写开头：

```tsx
function Greeting() {
  return <p>hello</p>;
}

export default function JsxBasicsPage() {
  return (
    <main>
      <Greeting />       {/* ✅ 当标签用 */}
    </main>
  );
}
```

- 为什么必须大写：JSX 编译时靠首字母区分「HTML 标签」和「组件」。`<div>` 是小写，被当成字符串 `"div"`；`<Greeting />` 是大写，被当成变量 `Greeting`。写成 `<greeting />` 会渲染成一个未知的自定义标签，控制台还会提示组件名首字母要大写。
- 一个文件可以有多个组件，但 `page.tsx` 必须 `export default` 页面组件。
- 组件体里 `return` 之前可以写计算（`const age = ...`），不能写副作用（阶段 3 会讲为什么）。

## 五、语义化标签怎么选

页面骨架先问「这块内容是什么」，再选标签，不要默认 `<div>`。

```
这块内容是页面的主体吗？        → <main>（整页只有一个）
是页头（logo、标题、身份）吗？   → <header>
是页脚（版权、联系方式）吗？     → <footer>
是一篇能独立传播的完整内容吗？   → <article>（一条新闻、一张商品卡）
是一个有主题的内容块吗？        → <section>（必须有 h2/h3 当标题）
是导航链接组吗？                → <nav>
以上都不是，只是排版用的容器     → <div>

里面是文本段落吗？  → <p>
是并列的一串条目？  → <ul> + <li>（有序用 <ol>）
是「名称：值」成对的数据？ → <dl> / <dt> / <dd>
```

三条硬规则：

1. **`<h1>` 一页一个**，层级不跳级（`h1 → h2 → h3`）。字号用 Tailwind（`text-3xl`），不要靠标题标签调字号。
2. **`<section>` 必须带标题**，并用 `aria-labelledby` 关联；没有标题的内容块用 `<div>`。
3. **`<div>` 是最后的选择**，不是默认选择。

常见误用：

| 写法 | 问题 | 改成 |
| --- | --- | --- |
| `<div class="header">` | div 没有语义 | `<header>` |
| `<div onClick>` 当按钮 | 键盘不可用、无 role | `<button>` |
| `<h3 className="text-4xl">` 当大标题 | 标题层级乱 | `<h2 className="text-4xl">` |
| `<p>技能1<br />技能2</p>` | 用 `<br>` 造列表 | `<ul><li>` |
| 页面里 3 个 `<h1>` | 每个都是「最高级」 | 只留一个，其余降级 |
| `<a href="#">` 或 `onClick` + div | 不语义、不能新开标签页 | 站内用 `next/link` 的 `<Link>`，站外用 `<a href>` |

为什么值得花时间：屏幕阅读器靠标签判断「标题 / 列表 / 按钮」，全用 `<div>` 等于给盲人一张白纸；搜索引擎和阅读模式同样依赖标签结构。

## 六、动手练习

**文件**：`app/learn/01-jsx/page.tsx`

需求：

- 页面结构：`<main className="mx-auto max-w-2xl p-8">` 里放 `header` + 两个 `section` + `footer`。
- `header`：`<h1>` 标题、一句自我介绍、`{}` 里做一次运算（如 `2025 - 1998`）显示年龄，并用三元根据年龄显示「成年 / 未成年」。
- 第一个 `section`：技能列表，3 项，手写 `<ul><li>`，**先不要 map**（下一课练）。
- 第二个 `section`：调用一个独立组件 `<Greeting />`，组件返回一句问候语。
- 每个 `section` 有 `<h2>`，并用 `aria-labelledby` 关联。
- 全文件不需要 `"use client"`（没有交互）。

**验收**

- [ ] `/learn/01-jsx` 能访问，Tailwind 样式生效
- [ ] 能解释为什么是 `className` 而不是 `class`
- [ ] 能说出 `{}` 里为什么不能写 `if`，以及有 `if` 需求时怎么写
- [ ] 全文件只有一个 `<h1>`，`section` 都有标题
- [ ] 浏览器控制台 0 报错 0 警告

**自检**：把 `<Greeting />` 改成 `<greeting />`，看控制台报什么；再改回来。

## 七、本课易错点

| 现象 | 原因 | 修法 |
| --- | --- | --- |
| 页面空白、无报错 | 忘了 `export default` | 页面组件必须默认导出 |
| 样式不生效 | 写了 `class=` | 改 `className=` |
| `Adjacent JSX elements must be wrapped` | 返回了并列根节点 | 包一层父元素或 `<>...</>` |
| 标签报未闭合 | `<img>` / `<br>` / `<input>` 没写 `/` | 写成自闭合 |
| 组件渲染成未知标签 | 组件名小写 | 首字母大写 |
| 页面多出一个 `0` | `{items.length && ...}` | 改 `items.length > 0 && ...` 或三元 |
| 控制台警告嵌套结构不合法 | `<p>` 里套 `<div>`、`<li>` 不在 `<ul>` 里 | 按 HTML 内容模型改结构 |

## 八、自测题

1. JSX 是什么？浏览器能直接运行 `.tsx` 吗？
2. `class` 和 `for` 在 JSX 里分别写什么？为什么？
3. `{}` 里能放 `if` 吗？能放 `array.map()` 吗？区别是什么？
4. 为什么要用 `<>...</>`？它和 `<div>` 包一层有什么区别？
5. `<card />` 和 `<Card />` 有什么区别？
6. 页面里能不能出现两个 `<h1>`？`<section>` 没有标题可以吗？
7. `{0 && <p>x</p>}` 会渲染出什么？怎么改？
8. 为什么这一课的组件一个 `"use client"` 都不用写？

<details>
<summary>参考答案</summary>

1. JSX 是 `jsx()` 调用的语法糖，产出 JS 对象；浏览器不认识，需要构建工具编译。
2. `className`、`htmlFor`，因为 `class` / `for` 是 JS 保留字。
3. 不能放 `if` 语句；能放 `map()`，因为它是有返回值的表达式。
4. Fragment 只做分组，不产生真实 DOM 节点；`<div>` 会多一层节点，可能破坏 flex/grid 布局和语义结构。
5. 首字母大写才会被当作组件变量；小写会被当成字符串标签 `"card"`。
6. 只能有一个 `<h1>`；`section` 必须有标题，没有标题就用 `<div>`。
7. 渲染出 `0`，因为 `0` 是表达式的值且会被渲染。改成 `items.length > 0 && ...`。
8. 这些组件没有 state、事件、浏览器 API，在服务端渲染完就够了，不需要打包交互代码给浏览器。

</details>

## 九、下一课

[02-props.md](./02-props.md)：把写死的卡片变成可配置的组件。
