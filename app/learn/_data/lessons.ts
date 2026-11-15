export type Lesson = {
  href: string;
  step: string;
  title: string;
  description: string;
  topics: string[];
};

export const lessons: Lesson[] = [
  {
    href: "/learn/01-jsx",
    step: "01",
    title: "JSX 与语义化标签",
    description: "用 JSX 写页面结构，按内容选择 main / header / section / article / footer。",
    topics: ["JSX", "语义化", "标题层级"],
  },
  {
    href: "/learn/02-props",
    step: "02",
    title: "Props 传参",
    description: "把组件拆成可复用的卡片与徽章，通过 props 传入标题、内容和页脚。",
    topics: ["props", "children", "组件复用"],
  },
  {
    href: "/learn/03-list",
    step: "03",
    title: "列表渲染",
    description: "用 map 渲染技能与项目列表，给每一项一个稳定的 key。",
    topics: ["map", "key", "排序"],
  },
  {
    href: "/learn/04-conditional",
    step: "04",
    title: "条件渲染",
    description: "根据状态决定显示什么：提前 return、三元表达式、逻辑与。",
    topics: ["if", "三元", "&&"],
  },
  {
    href: "/learn/05-final",
    step: "05",
    title: "阶段结业页",
    description: "把前面几课合起来，做成一个纯服务端渲染的个人主页。",
    topics: ["server component", "组合", "结业"],
  },
  {
    href: "/learn/06-counter",
    step: "06",
    title: "计数器：useState 与事件",
    description: "第一次让页面动起来：用 state 存计数与步长，点击事件通过函数式更新改它，并把取值卡在 0~100。",
    topics: ["useState", "事件", "函数式更新"],
  },
];
