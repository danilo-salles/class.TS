import { SerializableStatic } from "../types.js";
import { DomainError } from "./DomainError.js";

export class EmptyDependecyError extends DomainError {
    constructor(dependent: SerializableStatic, relation: SerializableStatic) {
        super(`${dependent.name} mut have at least one ${relation.name}`,
            dependent,
            {
                code: 'EMPTY_DEPENDENCY',
                status: 403
            });
    }
}