import { Badge } from "../_components/badge";
import { Card } from "../_components/card";

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
