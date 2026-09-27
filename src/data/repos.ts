export type Repo = {
  name: string
  language: string
  description: string
  url: string
}

export const repos: Repo[] = [
  {
    name: "MADINegypt_online_store",
    language: "JavaScript",
    description:
      "Clothing marketplace on the MERN stack: auth, categories, cart, admin panel.",
    url: "https://github.com/MalakSeddik/MADINegypt_online_store",
  },
  {
    name: "data-entry-cleaning-tool",
    language: "Python",
    description:
      "pandas pipeline that standardizes and validates messy customer data (248 rows in, 220 clean out).",
    url: "https://github.com/MalakSeddik/data-entry-cleaning-tool",
  },
]
