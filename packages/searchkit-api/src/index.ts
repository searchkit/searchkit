import { transformRequest } from "./transformRequest";
import type { MultipleQueriesQuery as AlgoliaMultipleQueriesQuery } from "@algolia/client-search";
import transformResponse, {
  transformFacetValuesResponse,
} from "./transformResponse";
import {
  ClientConfig,
  SearchRequest,
  RequestOptions,
  Transporter,
} from "./types";
import { ESTransporter } from "./Transporter";
export * from "./types";

class Client {
  transporter: Transporter;

  constructor(private config: ClientConfig) {
    this.transporter =
      "msearch" in config.connection
        ? config.connection
        : new ESTransporter(config.connection);
  }

  private async performSearch(requests: SearchRequest[]) {
    const responses = await this.transporter.msearch(requests);
    return responses;
  }

  async handleRequest(body: any, requestOptions?: RequestOptions) {
    const instantsearchRequests = body as AlgoliaMultipleQueriesQuery[];

    const instantsearchResponses = this.handleInstantSearchRequests(
      instantsearchRequests,
      requestOptions
    );

    return instantsearchResponses;
  }

  async handleInstantSearchRequests(
    instantsearchRequests: AlgoliaMultipleQueriesQuery[],
    requestOptions?: RequestOptions
  ) {
    const esRequests: SearchRequest[] = instantsearchRequests.map(
      (request, i) => {
        return {
          body: transformRequest(
            request,
            this.config.search_settings,
            requestOptions
          ),
          indexName: request.indexName,
        };
      }
    );

    const esResponses = await this.performSearch(esRequests);

    const instantsearchResponses = esResponses.map((response, i) => {
      // @ts-ignore
      if (instantsearchRequests[i].params?.facetName) {
        return transformFacetValuesResponse(response, instantsearchRequests[i]);
      }
      return transformResponse(
        response,
        instantsearchRequests[i],
        this.config.search_settings
      );
    });

    return {
      results: instantsearchResponses,
    };
  }
}

const createClient = (config: ClientConfig) => {
  return new Client(config);
};

export default createClient;
