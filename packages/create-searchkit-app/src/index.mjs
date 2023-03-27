import { transformMappingIntoSupport } from "./MappingTransform.mjs"


export const connect = async (
  connection,
  indexName,
  functionUrl,
  method = "GET",
  body
) => {
  const url = `${connection.host}/${indexName}/${functionUrl}`;
  const auth = (Buffer.from(connection.username + ':' + connection.password).toString('base64'))
  const response = await fetch(url, {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
    headers: {
      "Authorization": `Basic ${auth}`,
      ...(connection.headers || {}),
      "content-type": "application/json",
    },
  });

  const res = await response.json();
  if (res.status === 401) {
    throw new Error("Unauthorized: Check API key or Basic auth header");
  } else if (res.ok === false) {
    throw new Error("Could not connect to Elasticsearch: Check host");
  } else if (res.status === 404) {
    throw new Error("Index not found. Check index name");
  }

  return res;
};

export const getApplicationFields = async (application) => {
  const mapping = await connect(
    application.connection,
    application.indexName,
    "_mapping"
  );

  const fields = transformMappingIntoSupport(mapping, application.indexName);

  return fields;
};

export const testConnection = async (
  connection,
  indexName
) => {
  const fields = await getApplicationFields({
    connection,
    indexName,
  });

  await connect(
    connection,
    indexName,
    "_search",
    "POST",
    {
      query: {
        match_all: {},
      },
    }
  );

  return fields;
};

