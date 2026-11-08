// 语义化标签的选择依据：先问「这块内容是什么」，再选标签。
// 页面结构 => main；页头 => header；带主题的内容块 => section + h2；
// 可独立传播的完整内容（一篇文章/一张卡片）=> article；页脚 => footer。
// 标题层级：h1 只出现一次，往下按 h2 / h3 递进，不跳级。

export default function JsxBasicsPage() {
  // 不要改成 new Date()：本项目开了 cacheComponents，预渲染时读系统时间会构建报错
  const age = 2025 - 1998;

  return (
    <main className="mx-auto max-w-2xl space-y-10 p-8">
      {/* 页头：整页的身份信息 */}
      <header className="space-y-2 border-b pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {"I'm George"}
        </h1>
        <p className="text-zinc-600">a beginner of frontend</p>
        <p className="text-sm text-zinc-500">
          年龄：{age} · 身份状态：{age >= 18 ? "成年" : "未成年"}
        </p>
      </header>

      {/* section 必须有自己的标题，用 aria-labelledby 关联起来 */}
      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="mb-3 text-xl font-semibold">
          技能
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-zinc-700">
          <li>精通 HTML5 / CSS3 / JavaScript (ES6+)，熟悉页面响应式布局与跨浏览器兼容性优化</li>
          <li>熟悉 TypeScript，能编写强类型约束的高阶代码与接口定义</li>
          <li>掌握 CSS 预处理器（Sass/Less）及 Modern CSS 框架（Tailwind CSS）</li>
        </ul>
      </section>

      <section aria-labelledby="greeting-heading">
        <h2 id="greeting-heading" className="mb-3 text-xl font-semibold">
          打个招呼
        </h2>
        <Greeting />
      </section>

      {/* 页脚：版权、联系方式这类附属信息放最后 */}
      <footer className="border-t pt-6 text-sm text-zinc-500">
        <p>© 2025 George</p>
      </footer>
    </main>
  );
}

function Greeting() {
  return <p>hello</p>;
}
