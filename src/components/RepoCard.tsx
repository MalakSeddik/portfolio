import { Fragment } from "react"
import type { Repo } from "../data/repos"
import "./RepoCard.css"

// Offer a line break after each _ or - so long names wrap at word-ish
// boundaries ("MADINegypt_ / online_store") instead of mid-word.
function breakableName(name: string) {
  return name.split(/(?<=[_-])/).map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <wbr />}
      {part}
    </Fragment>
  ))
}

export function RepoCard({ repo }: { repo: Repo }) {
  return (
    <a className="repo-card" href={repo.url} target="_blank" rel="noopener">
      <div className="repo-card__header">
        <h3 className="repo-card__name">{breakableName(repo.name)}</h3>
        <span className="tag">{repo.language}</span>
      </div>
      <p className="repo-card__description">{repo.description}</p>
    </a>
  )
}
