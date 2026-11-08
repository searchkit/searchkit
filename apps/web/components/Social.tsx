import { DiscordIcon, GitHubIcon } from "nextra/icons";

// Nextra already wraps these icons in the link from theme.config.js (project/chat),
// so they must not render their own <a>: nested anchors break hydration.
function Github() {
  return (
    <span
      className="hidden text-current sm:flex hover:opacity-75"
      title="Searchkit GitHub repo"
    >
      {/* Nextra icons have a <title> attribute providing alt text */}
      <span className="pr-2 text-md font-semibold">4563 Stars</span><GitHubIcon />
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