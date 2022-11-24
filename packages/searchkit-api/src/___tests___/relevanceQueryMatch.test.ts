import { RelevanceQueryMatch } from "../transformRequest";

describe("relevance query match", () => {
  it("should work", () => {
    expect(
      RelevanceQueryMatch("test", ["title", "description"], {
        result_attributes: [],
        search_attributes: [],
        query_rules: [
          {
            actions: [{ action: "PinnedResult", documentIds: ["1"] }],
            conditions: [
              {
                context: "query",
                match_type: "exact",
                value: "test",
              },
            ],
          },
        ],
      })
    ).toMatchInlineSnapshot(`
      {
        "function_score": {
          "functions": [],
          "query": {
            "pinned": {
              "ids": [
                "1",
              ],
              "organic": {
                "combined_fields": {
                  "fields": [
                    "title",
                    "description",
                  ],
                  "query": "test",
                },
              },
            },
          },
        },
      }
    `);
  });

  it("should work with function score", () => {
    expect(
      RelevanceQueryMatch("test", ["title", "description"], {
        result_attributes: [],
        search_attributes: [],
        query_rules: [
          {
            actions: [
              { action: "PinnedResult", documentIds: ["1"] },
              {
                action: "QueryAttributeBoost",
                attribute: "categories",
                value: "televisions",
                boost: 3,
              },

              {
                action: "QueryRewrite",
                query: "televisions",
              },
            ],

            conditions: [
              {
                context: "query",
                match_type: "exact",
                value: "test",
              },
            ],
          },
        ],
      })
    ).toMatchInlineSnapshot(`
      {
        "function_score": {
          "functions": [
            {
              "filter": {
                "match": {
                  "categories": {
                    "query": "televisions",
                  },
                },
              },
              "weight": 3,
            },
          ],
          "query": {
            "pinned": {
              "ids": [
                "1",
              ],
              "organic": {
                "combined_fields": {
                  "fields": [
                    "title",
                    "description",
                  ],
                  "query": "televisions",
                },
              },
            },
          },
        },
      }
    `);
  });
});
