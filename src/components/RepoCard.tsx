import type { Repo } from "../data/repos"
import "./RepoCard.css"

export function RepoCard({ repo }: { repo: Repo }) {
  return (
    <a className="repo-card" href={repo.url} target="_blank" rel="noopener">
      <div className="repo-card__header">
        <h3 className="repo-card__name">{repo.name}</h3>
        <span className="tag">{repo.language}</span>
      </div>
      <p className="repo-card__description">{repo.description}</p>
    </a>
  )
}
