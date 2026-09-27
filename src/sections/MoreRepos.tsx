import { repos } from "../data/repos"
import { RepoCard } from "../components/RepoCard"
import { profile } from "../data/profile"
import "./MoreRepos.css"

export function MoreRepos() {
  return (
    <section id="repos" className="section container">
      <p className="section-kicker">More repos</p>
      <h2 className="section-heading">Other projects</h2>
      <div className="repos-grid">
        {repos.map((repo) => (
          <RepoCard key={repo.url} repo={repo} />
        ))}
      </div>
      <a
        className="text-link repos__all-link"
        href={profile.githubAllRepos}
        target="_blank"
        rel="noopener"
      >
        Browse all {profile.githubRepoCount} repos on GitHub {"↗"}
      </a>
    </section>
  )
}
