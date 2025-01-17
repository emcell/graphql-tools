import { DocumentNode, DefinitionNode, Kind } from 'graphql';
import { env } from 'process';

/**
 * @internal
 */
export const filterKind = (content: DocumentNode | undefined, filterKinds: null | string[]) => {
  if (content && content.definitions && content.definitions.length && filterKinds && filterKinds.length > 0) {
    const invalidDefinitions: DefinitionNode[] = [];
    const validDefinitions: DefinitionNode[] = [];
    for (const definitionNode of content.definitions) {
      if (filterKinds.includes(definitionNode.kind)) {
        invalidDefinitions.push(definitionNode);
      } else {
        validDefinitions.push(definitionNode);
      }
    }

    if (invalidDefinitions.length > 0) {
      invalidDefinitions.forEach(d => {
        if (env['DEBUG']) {
          console.error(`Filtered document of kind ${d.kind} due to filter policy (${filterKinds.join(', ')})`);
        }
      });
    }

    return {
      kind: Kind.DOCUMENT,
      definitions: validDefinitions,
    };
  }
  return content;
};
