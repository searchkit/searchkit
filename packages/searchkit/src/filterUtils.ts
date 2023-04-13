export const TermFilter = (field: string, value: string) => {
  return { term: { [field]: value } }
}

export const MatchFilter = (field: string, value: string) => {
  return { match: { [field]: value } }
}
