import { getHighlightFields, highlightTerm } from "../highlightUtils";
import { ElasticsearchHit } from "../types";

describe("highlight utils", () => {
  it("should highlight one match", () => {
    expect(highlightTerm("some random string", "some")).toBe(
      "<ais-highlight-0000000000>some</ais-highlight-0000000000> random string"
    );
  });

  describe("getHighlightFields", () => {
    it("should match on a field", () => {
      const hit: ElasticsearchHit = {
        _id: "test",
        _index: "index",
        _source: {
          title: "The Lion King",
        },
        highlight: {
          title: [
            "The <ais-highlight-0000000000>Lion</ais-highlight-0000000000> King",
          ],
        },
      };

      expect(getHighlightFields(hit)).toMatchInlineSnapshot(`
        {
          "title": [
            {
              "fullyHighlighted": false,
              "matchLevel": "full",
              "matchedWords": [
                "Lion",
              ],
              "value": "The <ais-highlight-0000000000>Lion</ais-highlight-0000000000> King",
            },
          ],
        }
      `);
    });
  });

  it("should have matches and source value is an array", () => {
    const hit: ElasticsearchHit = {
      _id: "test",
      _index: "index",
      _source: {
        actors: ["Robert De Niro", "Al Pacino"],
      },
      highlight: {
        actors: [
          "The <ais-highlight-0000000000>Robert</ais-highlight-0000000000> De Niro",
        ],
      },
    };

    expect(getHighlightFields(hit)).toMatchInlineSnapshot(`
      {
        "actors": [
          {
            "fullyHighlighted": false,
            "matchLevel": "full",
            "matchedWords": [
              "Robert",
            ],
            "value": "The <ais-highlight-0000000000>Robert</ais-highlight-0000000000> De Niro",
          },
        ],
      }
    `);
  });

  it("should not have matches and source value is an array", () => {
    const hit: ElasticsearchHit = {
      _id: "test",
      _index: "index",
      _source: {
        actors: ["Robert De Niro", "Al Pacino"],
      },
      highlight: {},
    };

    expect(getHighlightFields(hit)).toMatchInlineSnapshot(`
      {
        "actors": [
          {
            "matchLevel": "none",
            "matchedWords": [],
            "value": "Robert De Niro",
          },
          {
            "matchLevel": "none",
            "matchedWords": [],
            "value": "Al Pacino",
          },
        ],
      }
    `);
  });

  it("should have no matches", () => {
    const hit: ElasticsearchHit = {
      _id: "test",
      _index: "index",
      _source: {
        title: "The Lion King",
      },
      highlight: {},
    };

    expect(getHighlightFields(hit)).toMatchInlineSnapshot(`
      {
        "title": {
          "matchLevel": "none",
          "matchedWords": [],
          "value": "The Lion King",
        },
      }
    `);
  });
});
