/**
 * SQL identifiers (tables and columns). Every identifier comes from the adapter configuration
 * (`indices`) or the search settings, never from the request. Each one is validated against
 * `IDENTIFIER` and double-quoted, so it can never break out of the statement. Values are never
 * identifiers: they are always bound parameters (see `Params`).
 */

const IDENTIFIER = /^[a-z_][a-z0-9_]*$/i

export class InvalidIdentifierError extends Error {}

const quotePart = (part: string, kind: string, name: string) => {
  if (!IDENTIFIER.test(part)) {
    throw new InvalidIdentifierError(
      `@searchkit/adapter-postgres: invalid ${kind} name "${name}". Use a plain ${kind} name (letters, digits and underscores, not starting with a digit)${
        kind === 'table' ? ', optionally schema-qualified (schema.table)' : ''
      }.`
    )
  }
  return `"${part}"`
}

/** A validated, quoted column name: `price` -> `"price"`. */
export const quoteColumn = (name: string): string => quotePart(name, 'column', name)

/** A validated, quoted table name, optionally schema-qualified: `shop.products` -> `"shop"."products"`. */
export const quoteTable = (name: string): string => {
  const parts = name.split('.')
  if (parts.length > 2) {
    return quotePart(name, 'table', name)
  }
  return parts.map((part) => quotePart(part, 'table', name)).join('.')
}

/** Collects bound parameters and returns their placeholders (`$1`, `$2`, ...). */
export class Params {
  readonly values: unknown[] = []

  add(value: unknown): string {
    this.values.push(value)
    return '$' + this.values.length
  }

  /**
   * Adds a SQL fragment with its own placeholders (`$1` is `values[0]`, ...), as returned by the
   * `getWhere` request option: renumbers its placeholders after the parameters already added and adds
   * its values.
   */
  addSql(text: string, values: unknown[] = []): string {
    const offset = this.values.length
    const sql = text.replace(/\$(\d+)/g, (placeholder, n: string) => {
      const i = Number(n)
      if (i < 1 || i > values.length) {
        throw new Error(
          `@searchkit/adapter-postgres: placeholder ${placeholder} in "${text}" has no value (${values.length} params)`
        )
      }
      return '$' + (offset + i)
    })
    this.values.push(...values)
    return sql
  }
}
