type BadgeTone = "green" | "red" | "grey";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

type CardProps = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

const toneClass: Record<BadgeTone, string> = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  grey: "bg-zinc-100 text-zinc-700",
};

function Badge({ label, tone = 'grey' }: BadgeProps) {
  return <span className={`rounded px-2 py-0.5 text-xs ${toneClass[tone]}`}>
    {label}
  </span>;
}

function Card({ title, children, footer, className = "" }: CardProps) {
  return (
    <article className={`rounded-lg border border-zinc-200 bg-white p-4 ${className}`}>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div className="text-zinc-700"> {children} </div>
      {footer && <div className="mt-3 border-t border-zinc-200 pt-2 text-sm">{footer}</div>}
    </article>
  );
}

export default function PropsPage() {
  return (
    <main>
      <h1>props practice</h1>

      <Card title="about me" footer={<Badge label="开放合作" tone="green" />}>
        <p>frontend beginner</p>
      </Card>

      <Card title="skills">
        <ul>
          <li>html / css / typescript</li>
          <li>react</li>
          <li>tailwind css</li>
        </ul>
      </Card>

      <Card
        title="recent programs"
        className="border-red-200 bg-red-50"
        footer={<Badge label="pause" tone="red" />}
      >
        <p>openwrt, docker, ...</p>
      </Card>
    </main>
  );
}
