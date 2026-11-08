import { DiscordIcon, GitHubIcon } from "nextra/icons";
import useSWR from "swr";

// One shared request: the API route caches the count, so the browser only
// ever hits our server. Undefined until loaded, so SSR and hydration match.
const fetchStars = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`stars ${r.status}`);
    return r.json() as Promise<{ stars: number }>;
  });

// Nextra already wraps these icons in the link from theme.config.js (project/chat),
// so they must not render their own <a>: nested anchors break hydration.
function Github() {
  const { data } = useSWR("/api/github-stars", fetchStars, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return (
    <span
      className="hidden text-current sm:flex hover:opacity-75"
      title="Searchkit GitHub repo"
    >
      {/* Nextra icons have a <title> attribute providing alt text */}
      {data && (
        <span className="pr-2 text-md font-semibold">
          {data.stars.toLocaleString("en-US")} Stars
        </span>
      )}
      <GitHubIcon />
    </span>
  );
}

function Discord() {
  return (
    <span
      className="hidden text-current sm:flex hover:opacity-75"
      title="Turbo Discord server"
    >
      <DiscordIcon />
    </span>
  );
}

export { Github, Discord };