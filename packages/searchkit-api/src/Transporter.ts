import { ClientConfigConnection, SearchRequest } from "./types";
import { ElasticsearchResponseBody, Transporter } from "./types";

export class ESTransporter implements Transporter {
  constructor(public config: ClientConfigConnection) {}

  async msearch(
    requests: SearchRequest[]
  ): Promise<ElasticsearchResponseBody[]> {
    // @ts-ignore
    const response = await fetch(`${this.config.host}/_msearch`, {
      headers: {
        ...(this.config.apiKey
          ? { authorization: `ApiKey ${this.config.apiKey}` }
          : {}),
        "content-type": "application/json",
      },
      body: requests
        .reduce<string[]>(
          (sum, request) => [
            ...sum,
            JSON.stringify({ index: request.indexName }),
            "\n",
            JSON.stringify(request.body),
            "\n",
          ],
          []
        )
        .join(""),
      method: "POST",
    });

    const responses = await response.json();
    return responses.responses;
  }
}
