import { AlgoliaMultipleQueriesQuery, QueryRule, SearchSettingsConfig } from './types'

export interface QueryContextFilter {
  attribute: string
  value: string
}

export interface QueryContext {
  query: string
  context: readonly string[]
  filters: readonly QueryContextFilter[]
}

export interface QueryRuleActions {
  ruleIds: string[]
  pinnedDocs: string[]
  boostFunctions: any[]
  query: string
  userData: unknown[]
  facetAttributesOrder: string[] | undefined
  touched: boolean
}

const getFacetFilters = (
  facetFilters: string | readonly string[] | readonly (string | readonly string[])[] | undefined
): QueryContextFilter[] => {
  if (!facetFilters) {
    return []
  }
  if (typeof facetFilters === 'string') {
    const [attribute, value] = facetFilters.split(':')
    return [{ attribute, value }]
  } else {
    // @ts-ignore
    return facetFilters.reduce<QueryContextFilter[]>((sum: any, filter: any) => {
      if (typeof filter === 'string') {
        const [attribute, value] = filter.split(':')
        return [...sum, { attribute, value }]
      }
      return [...sum, ...getFacetFilters(filter)]
    }, [])
  }
}

export const getQueryRulesActionsFromRequest = (
  queryRules: QueryRule[],
  request: AlgoliaMultipleQueriesQuery
) => {
  const queryContext: QueryContext = {
    query: request.params?.query || '',
    context: request.params?.ruleContexts || [],
    filters: getFacetFilters(request.params?.facetFilters)
  }

  const satisfiedRules = getSatisfiedRules(queryContext, queryRules || [])

  const actions = satisfiedRules.reduce<QueryRuleActions>(
    (sum, rule) => {
      rule.actions.map((action) => {
        sum.touched = true
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
      ruleIds: satisfiedRules.map((rule) => rule.id),
      pinnedDocs: [],
      boostFunctions: [],
      query: queryContext.query,
      userData: [],
      facetAttributesOrder: undefined,
      touched: false
    }
  )

  return actions
}

export const getSatisfiedRules = (queryContext: QueryContext, rules: QueryRule[]) =>
  rules.filter(
    (ruleOrs) =>
      ruleOrs.conditions.find(
        (rule) =>
          rule.filter((condition) => {
            if (condition.context === 'query' && condition.match_type === 'exact') {
              return condition.value === queryContext.query
            }
            if (condition.context === 'query' && condition.match_type === 'contains') {
              return queryContext.query.includes(condition.value)
            }
            if (condition.context === 'query' && condition.match_type === 'prefix') {
              return queryContext.query.startsWith(condition.value)
            }
            if (condition.context === 'context') {
              return condition.value.some((value) => queryContext.context.includes(value))
            }
            if (condition.context === 'filterPresent') {
              return condition.values.every(
                (value) =>
                  queryContext.filters.find(
                    (filter) => filter.attribute === value.attribute && filter.value === value.value
                  ) !== undefined
              )
            }

            return false
          }).length === rule.length
      ) !== undefined
  )
