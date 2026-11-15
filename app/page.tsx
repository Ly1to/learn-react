import Link from "next/link";
import { lessons } from "./learn/_data/lessons";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <header className="space-y-3 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <p className="font-mono text-sm text-blue-600 dark:text-blue-400">
          learn-react
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          React 学习笔记
        </h1>
        <p className="max-w-prose text-zinc-600 dark:text-zinc-400">
          跟着课程一步步写页面，每一课都是一个可以访问的路由。从带序号的列表选一课开始。
        </p>
      </header>

      <section aria-labelledby="lessons-heading" className="py-8">
        <h2
          id="lessons-heading"
          className="mb-4 text-xl font-semibold tracking-tight"
        >
          课程目录
        </h2>

        <ol className="space-y-3">
          {lessons.map((lesson) => (
            <li key={lesson.href}>
              <Link
                href={lesson.href}
                className="group flex gap-4 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-zinc-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-lg text-zinc-400 group-hover:text-blue-600 dark:text-zinc-600 dark:group-hover:text-blue-400"
                >
                  {lesson.step}
                </span>

                <span className="min-w-0 flex-1 space-y-1">
                  <span className="block font-semibold text-zinc-900 group-hover:text-blue-700 dark:text-zinc-100 dark:group-hover:text-blue-300">
                    {lesson.title}
                  </span>
                  <span className="block text-sm text-zinc-600 dark:text-zinc-400">
                    {lesson.description}
                  </span>
                  <span className="flex flex-wrap gap-1 pt-1">
                    {lesson.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {topic}
                      </span>
                    ))}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="self-center text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500 dark:text-zinc-700"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <footer className="border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        <p>
          直接访问任意一课：{" "}
          <Link
            href="/learn/05-final"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            /learn/05-final
          </Link>
        </p>
      </footer>
    </main>
  );
}
