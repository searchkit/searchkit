## Default Queries
Sometimes we need to apply a default query which affects the entire search and is not serialized to the browser url.

`SearchkitManager` allows ability to add these

```js
  import {
    SearchkitManager,
    TermQuery,
    BoolMust
  } from "searchkit";
  const searchkit = new SearchkitManager("/");
  searchkit.addDefaultQuery((query)=> {
    return query.addQuery(BoolMust([
        TermQuery("colour", "red"),
        TermQuery("colour", "orange")
      ])
    );
  })
```

### ImmutableQuery + QueryBuilders
To see more detail on these apis have a look at these pages

- [ImmutableQuery](../core/ImmutableQuery.md)
- [QueryDSL](../core/QueryDSL.md)
