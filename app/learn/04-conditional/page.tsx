import { Badge, type BadgeTone } from "../_components/badge";
import { Card } from "../_components/card";

type ArticleStatus = "draft" | "published" | "archived";

type Article = { id: string; title: string; body: string; status: ArticleStatus };

type Comment = { id: string; text: string };

const comments: Comment[] = [];

const article: Article = {
  id: "conditional",
  title: "practice of if",
  body: "practice three ways to if",
  status: "draft",
};

const statusMeta: Record<ArticleStatus, { label: string; tone: BadgeTone; hint: string }> = {
  draft: { label: "草稿", tone: "gray", hint: "仅自己可见" },
  published: { label: "已发布", tone: "green", hint: "所有人可见" },
  archived: { label: "已归档", tone: "red", hint: "不再展示在列表页" },
};

function DraftBanner({ status }: { status: ArticleStatus }) {
  if (status !== "draft") return null;

  return (
    <p className="mb-3 rounded bg-amber-50 p-2 text-sm text-amber-700">
      only saw by self
    </p>
  );
}

export default function ConditionalPage() {
  const meta = statusMeta[article.status];

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-8">
      <h1 className="text-3xl font-semibold">条件渲染练习</h1>

      <Card title={article.title} footer={<Badge label={meta.label} tone={meta.tone} />}>
        <DraftBanner status={article.status} />

        <div
          className={`rounded p-3 ${
            article.status === "published" ? "bg-green-50" : "bg-zinc-50"
          }`}
        >
          {article.status === "published" ? (
            <p>{article.body}</p>
          ) : (
            <p className="text-zinc-600">
              {meta.hint}: {article.body}
            </p>
          )}
        </div>

        {article.status === "archived" && (
          <p className="mt-3 text-sm text-red-600">cannot edit cause archived.</p>
        )}
      </Card>

      <section aria-labelledby="comments-heading">
        <h2 id="comments-heading" className="mb-3 text-xl font-semibold">
          comments.
        </h2>
        {comments.length > 0 ? (
          <ul className="space-y-2">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded border border-zinc-200 p-2">
                {comment.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">no comments, add</p>
        )}
      </section>
    </main>
  );
}
