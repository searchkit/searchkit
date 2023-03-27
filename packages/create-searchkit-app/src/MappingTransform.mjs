const deriveField = (
  validTypes,
  key,
  properties,
  nestedPath
) => {
  const facetDefs = validTypes;

  const facetableTypes = Object.keys(facetDefs);
  const fields = [];
  if (facetableTypes.includes(properties.type)) {
    fields.push({
      label: nestedPath ? `${nestedPath}.${key}` : key,
      field: key,
      type: facetDefs[properties.type],
      ...(nestedPath ? { nestedPath } : {}),
    });
  }

  Object.keys(properties.fields || {}).forEach((subField) => {
    fields.push({
      label: nestedPath ? `${nestedPath}.${key}` : key,
      field: `${key}.${subField}`,
      type: facetDefs[properties.fields[subField].type],
      ...(nestedPath ? { nestedPath } : {}),
    });
  });

  return fields;
};

const getFields = (
  validTypes,
  key,
  properties
) => {
  if (properties.type === "nested") {
    return Object.keys(properties.properties).reduce(
      (acc, subField) => {
        return acc.concat(
          deriveField(
            validTypes,
            `${subField}`,
            properties.properties[subField] || {},
            key
          )
        );
      },
      []
    );
  } else if (properties.properties) {
    return Object.keys(properties.properties).reduce(
      (acc, subField) => {
        return acc.concat(
          deriveField(
            validTypes,
            `${key}.${subField}`,
            properties.properties[subField]
          )
        );
      },
      []
    );
  } else {
    return deriveField(validTypes, key, properties);
  }
};

const getFacetableFields = (key, properties) => {
  const facetDefs = {
    keyword: "string",
    long: "numeric",
    integer: "numeric",
    float: "numeric",
    double: "numeric",
  };
  return getFields(facetDefs, key, properties);
};

const getFilterableFields = (key, properties) => {
  const facetDefs = {
    keyword: "string",
    long: "numeric",
    integer: "numeric",
    float: "numeric",
    double: "numeric",
    date: "date",
  };
  return getFields(facetDefs, key, properties);
};

const getSearchableFields = (key, properties) => {
  const getChildFields = (key, properties) => {
    const searchableTypes = ["text"];
    const fields = [];
    if (searchableTypes.includes(properties.type) && !properties.properties) {
      fields.push({ label: key, field: key, type: properties.type });
    }
    Object.keys(properties.fields || {}).forEach((subField) => {
      if (searchableTypes.includes(properties.fields[subField].type)) {
        fields.push({
          label: key,
          field: `${key}.${subField}`,
          type: properties.fields[subField].type,
        });
      }
    });
    if (properties.properties) {
      Object.keys(properties.properties).forEach((subField) => {
        fields.push(
          ...getChildFields(
            `${key}.${subField}`,
            properties.properties[subField]
          )
        );
      });
    }
    return fields;
  };

  return getChildFields(key, properties);
};

const getResultFields = (key, property) => {
  const isNested = property.type === "nested";
  const isObject = !!property.properties;

  if (isNested || isObject) {
    return `${key}.*`;
  } else {
    return key;
  }
};

export const transformMappingIntoSupport = (
  mapping,
  indexName
) => {
  const properties = mapping[indexName].mappings.properties;
  const fields = Object.keys(properties)
    .filter((key) => !["id"].includes(key))
    .map((key) => {
      const property = properties[key];

      return {
        facetableField: getFacetableFields(key, property),
        searchableField: getSearchableFields(key, property),
        filterableField: getFilterableFields(key, property),
        resultField: getResultFields(key, property),
      };
    })
    .reduce(
      (acc, field) => {
        acc.searchable.push(...field.searchableField);
        acc.facetable.push(...field.facetableField);
        acc.filterable.push(...field.filterableField);
        acc.result.push(field.resultField);
        return acc;
      },
      { searchable: [], facetable: [], result: [], filterable: [] }
    );
  return fields;
};
