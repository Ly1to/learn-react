import type { Profile, SocialLink } from "../data";

export function ProfileHeader({ profile, links }: { profile: Profile; links: SocialLink[]; }) {
  return (
    <header className="flex flex-col gap-6 border-b border-zinc-200 pb-8 sm:flex-row sm:items-center">
      <div aria-hidden="true" className="flex size-20 shrink-0
        items-center justify-center rounded-full 
        bg-zinc-200 font-mono text-2xl text-zinc-600
        ">
        {profile.initials}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{profile.name}</h1>
        <p className="text-zinc-600">{profile.headline}</p>
        <p className="max-w-prose text-sm text-zinc-500">{profile.bio}</p>

        {links.length > 0 && (
          <ul className="flex flex-wrap gap-3 pt-1 text-sm">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  className="text-blue-600 underline-offset-4 hover:underline"
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
