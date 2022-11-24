import { getSatisfiedRules } from "../queryRules";
import { QueryRule } from "../types";

describe("getSatisfiedRules", () => {
  const rules: QueryRule[] = [
    {
      conditions: [{ context: "query", value: "test", match_type: "exact" }],
      actions: [],
    },
    {
      conditions: [{ context: "query", value: "bob", match_type: "prefix" }],
      actions: [],
    },
    {
      conditions: [{ context: "query", value: "ph", match_type: "contains" }],
      actions: [],
    },
  ];

  it("gets exact query rule match", () => {
    expect(
      getSatisfiedRules(
        {
          query: "test",
        },
        rules
      )
    ).toEqual([rules[0]]);
  });

  it("gets exact query rule match", () => {
    expect(
      getSatisfiedRules(
        {
          query: "bobtest",
        },
        rules
      )
    ).toEqual([rules[1]]);
  });

  it("gets exact query rule match", () => {
    expect(
      getSatisfiedRules(
        {
          query: "joseph",
        },
        rules
      )
    ).toEqual([rules[2]]);
  });
});
