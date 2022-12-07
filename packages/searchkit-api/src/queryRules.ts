import { AlgoliaMultipleQueriesQuery, QueryRule, SearchSettingsConfig } from './types'

export interface QueryContext {
  query: string
}

export interface QueryRuleActions {
  pinnedDocs: string[]
  boostFunctions: any[]
  query: string
  userData: unknown[]
  facetAttributesOrder: string[] | undefined
}

export const getQueryRulesActionsFromRequest = (
  queryRules: QueryRule[],
  request: AlgoliaMultipleQueriesQuery
) => {
  const queryContext: QueryContext = {
    query: request.params?.query || ''
  }

  const satisfiedRules = getSatisfiedRules(queryContext, queryRules || [])

  const actions = satisfiedRules.reduce<QueryRuleActions>(
    (sum, rule) => {
      rule.actions.map((action) => {
        if (action.action === 'PinnedResult') {
          sum.pinnedDocs.push(...action.documentIds)
        } else if (action.action === 'QueryRewrite') {
          sum.query = action.query
        } else if (action.action === 'QueryAttributeBoost') {
          sum.boostFunctions.push({
            filter: {
              match: { [action.attribute]: { query: action.value } }
            },
            weight: action.boost
          })
        } else if (action.action === 'RenderUserData') {
          sum.userData.push(JSON.parse(action.userData))
        } else if (action.action === 'RenderFacetsOrder') {
          sum.facetAttributesOrder = action.facetAttributesOrder
        }
      })
      return sum
    },
    {
      pinnedDocs: [],
      boostFunctions: [],
      query: queryContext.query,
      userData: [],
      facetAttributesOrder: undefined
    }
  )
  return actions
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
