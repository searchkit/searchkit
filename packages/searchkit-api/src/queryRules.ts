import { QueryRule } from './types'

interface QueryContext {
  query: string
}

export const getSatisfiedRules = (queryContext: QueryContext, rules: QueryRule[]) =>
  rules.filter(
    (rule) =>
      rule.conditions.filter((condition) => {
        if (condition.context === 'query' && condition.match_type === 'exact') {
          return condition.value === queryContext.query
        }
        if (condition.context === 'query' && condition.match_type === 'contains') {
          return queryContext.query.includes(condition.value)
        }
        if (condition.context === 'query' && condition.match_type === 'prefix') {
          return queryContext.query.startsWith(condition.value)
        }

        return false
      }).length > 0
  )
