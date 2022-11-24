import { SearchSettingsConfig } from "./types";
import { getHighlightFields, highlightTerm } from "./highlightUtils";
import { stringify } from "querystring";
import {
  AlgoliaMultipleQueriesQuery,
  ElasticsearchResponseBody,
} from "./types";
import { getFacetFieldType } from "./utils";

type FacetsList = Record<string, Record<string, number>>;
type FacetsStats = Record<
  string,
  { min: number; max: number; avg: number; sum: number }
>;

const getHits = (
  response: ElasticsearchResponseBody,
  config: SearchSettingsConfig
) => {
  const { hits } = response;

  return hits.hits.map((hit) => ({
    objectID: hit._id,
    ...(hit._source || {}),
    _highlightResult: getHighlightFields(hit),
  }));
};

const getFacets = (
  response: ElasticsearchResponseBody,
  config: SearchSettingsConfig
) => {
  const { aggregations } = response;

  if (!aggregations) {
    return {};
  }

  return Object.keys(aggregations).reduce<{
    facets: FacetsList;
    facets_stats: FacetsStats;
  }>(
    (sum, f) => {
      const facet = f.split("$")[0];
      const fieldType = getFacetFieldType(config.facet_attributes || [], facet);

      if (fieldType === "numeric") {
        const facetValues = aggregations[facet + "$_stats"] as any;
        const { buckets } = aggregations[facet + "$_entries"] as {
          buckets: any[];
        };

        return {
          ...sum,
          facets: {
            ...sum.facets,
            [facet]: buckets.reduce<Record<string, number>>(
              (sum, bucket) => ({
                ...sum,
                [bucket.key]: bucket.doc_count,
              }),
              {}
            ),
          },
          facets_stats: {
            ...sum.facets_stats,
            [facet]: {
              min: facetValues.min,
              avg: facetValues.avg,
              max: facetValues.max,
              sum: facetValues.sum,
            },
          },
        };
      }

      const { buckets } = aggregations[facet] as { buckets: any[] };

      return {
        ...sum,
        facets: {
          ...sum.facets,
          [facet]: buckets.reduce<Record<string, number>>(
            (sum, bucket) => ({
              ...sum,
              [bucket.key]: bucket.doc_count,
            }),
            {}
          ),
        },
      };
    },
    {
      facets: {},
      facets_stats: {},
    }
  );
};

const getRenderingContent = (config: SearchSettingsConfig) => {
  return {
    renderingContent: {
      facetOrdering: {
        facets: {
          order: config.facet_attributes?.map((facet) => {
            return typeof facet === "string" ? facet : facet.attribute;
          }),
        },
        values: config.facet_attributes?.reduce<
          Record<string, { sortRemainingBy: "count" }>
        >((sum, facet) => {
          const facetName = typeof facet === "string" ? facet : facet.attribute;
          return {
            ...sum,
            [facetName]: {
              sortRemainingBy: "count",
            },
          };
        }, {}),
      },
    },
  };
};

const getPageDetails = (
  response: ElasticsearchResponseBody,
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
) => {
  const { params = {} } = request;
  const { hitsPerPage = 20, page = 0, query = "" } = params;

  const { total } = response.hits;
  const totalHits = typeof total === "number" ? total : total?.value;
  const nbPages = Math.ceil(
    (typeof total === "number" ? total : total?.value || 0) / hitsPerPage
  );

  return {
    hitsPerPage,
    processingTimeMS: response.took,
    nbHits: totalHits,
    page: page,
    nbPages,
    query,
  };
};

export default function transformResponse(
  response: ElasticsearchResponseBody,
  instantsearchRequest: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
) {
  return {
    exhaustiveNbHits: true,
    exhaustiveFacetsCount: true,
    exhaustiveTypo: true,
    exhaustive: { facetsCount: true, nbHits: true, typo: true },
    ...getPageDetails(response, instantsearchRequest, config),
    ...getRenderingContent(config),
    ...getFacets(response, config),
    hits: getHits(response, config),
    index: instantsearchRequest.indexName,
    params: stringify(instantsearchRequest.params as any),
  };
}

export const transformFacetValuesResponse = (
  response: ElasticsearchResponseBody,
  instantsearchRequest: AlgoliaMultipleQueriesQuery
) => {
  const aggregations = response.aggregations || {};
  return {
    facetHits: (aggregations[Object.keys(aggregations)[0]] as any).buckets.map(
      (entry: any) => ({
        value: entry.key,
        highlighted: highlightTerm(
          entry.key,
          // @ts-ignore
          instantsearchRequest.params.facetQuery || ""
        ),
        count: entry.doc_count,
      })
    ),
    exhaustiveFacetsCount: true,
    processingTimeMS: response.took,
  };
};
