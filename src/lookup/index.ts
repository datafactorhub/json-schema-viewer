import { JsonSchema, JsonSchema1 } from '../schema';
import { get as pointerGet } from 'jsonpointer';

export interface Lookup {
  getSchema: (s: JsonSchema) => JsonSchema | undefined;
}

function isReference(s: JsonSchema1): boolean {
  return s.$ref !== undefined;
}

export class IdLookup implements Lookup {
  public getSchema(s: JsonSchema): JsonSchema | undefined {
    if (typeof s === 'boolean') {
      return s;
    }

    if (isReference(s)) {
      return undefined;
    }

    return s;
  }
}

export class InternalLookup implements Lookup {
  private schema: JsonSchema;

  constructor(schema: JsonSchema) {
    this.schema = schema;
  }

  public getSchema(s: JsonSchema): JsonSchema | undefined {
    if (typeof s === 'boolean') {
      return s;
    }

    if (s.$ref === undefined) {
      return s;
    }

    const ref = s.$ref;
    if (!ref.startsWith('#')) {
      // This class does not support non-internal references
      return undefined;
    }

    const result = pointerGet(this.schema, ref.slice(1));

    if (result === undefined) {
      return undefined;
    }

    // TODO add in a type check on the result to ensure that it is of the right type

    return this.getSchema(result);
  }
}