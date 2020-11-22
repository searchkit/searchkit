### With Prisma Example
Example of two schemas (Prisma Nexus Schema & Searchkit Schema) being stitched together via stitchSchema function. 

### Get Started

1. yarn
2. yarn run migrate:up
3. yarn run dev

### Important Queries

Create Post 

```gql
mutation {
  createPost(title: "hello", content: "dddd") {
		id
    title
    content
  }
}
```

Query Post

```gql
query {
  feed {
    id
  }
}
```

Query Searchkit
```gql
query {
  feed {
    id
  }
  results {
    hits {
      items {
        id
      }
    }
  }
}
```
