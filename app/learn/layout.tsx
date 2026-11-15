import Link from "next/link";

export default function LearnLayout({ children }: LayoutProps<"/learn">) {
  return (
    <div className="flex flex-1 flex-col">
      <nav
        aria-label="课程导航"
        className="border-b border-zinc-200 px-6 py-3 text-sm dark:border-zinc-800"
      >
        <Link
          href="/"
          className="font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← 返回课程目录
        </Link>
      </nav>

      {children}
    </div>
  );
}
