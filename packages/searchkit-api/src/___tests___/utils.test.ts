import {
  getFacetField,
  getFacetAttribute,
  getFacetFieldType,
  createRegexQuery,
} from "../utils";

describe("utils", () => {
  describe("createRegexQuery", () => {
    it("should create regex", () => {
      expect(createRegexQuery("test")).toBe("([a-zA-Z]+ )+?[tT][eE][sS][tT].*");
    });

    it("should create empty regex", () => {
      expect(createRegexQuery("")).toBe(".*");
    });

    it("should create empty regex", () => {
      expect(createRegexQuery("a")).toBe("[aA].*");
    });
  });

  describe("getFacetField", () => {
    it("getFacetField - default config", () => {
      expect(
        getFacetField(
          ["type", { attribute: "imdbRating", type: "numeric" }],
          "type"
        )
      ).toBe("type");
    });

    it("getFacetField - complex config", () => {
      expect(
        getFacetField(
          ["type", { attribute: "imdbRating", type: "numeric" }],
          "imdbRating"
        )
      ).toBe("imdbRating");
    });

    it("getFacetField - complex config with override", () => {
      expect(
        getFacetField(
          [
            "type",
            {
              attribute: "imdbRating",
              field: "field.override",
              type: "numeric",
            },
          ],
          "imdbRating"
        )
      ).toBe("field.override");
    });
  });

  describe("getFacetAttribute", () => {
    it("getFacetAttribute - default config", () => {
      expect(
        getFacetAttribute(
          ["type", { attribute: "imdbRating", type: "numeric" }],
          "type"
        )
      ).toBe("type");
    });

    it("getFacetAttribute - complex config", () => {
      expect(
        getFacetAttribute(
          ["type", { attribute: "imdbRating", type: "numeric" }],
          { attribute: "imdbRating", type: "numeric" }
        )
      ).toBe("imdbRating");
    });
  });

  describe("getFacetFieldType", () => {
    it("getFacetFieldType - default config", () => {
      expect(
        getFacetFieldType(
          ["type", { attribute: "imdbRating", type: "numeric" }],
          "type"
        )
      ).toBe("string");
    });

    it("getFacetFieldType - complex config", () => {
      expect(
        getFacetFieldType(
          ["type", { attribute: "imdbRating", type: "numeric" }],
          { attribute: "imdbRating", type: "numeric" }
        )
      ).toBe("numeric");
    });

    it("getFacetFieldType - complex config", () => {
      expect(
        getFacetFieldType(
          ["type", { attribute: "imdbRating", type: "numeric" }],
          "imdbRating"
        )
      ).toBe("numeric");
    });
  });
});
