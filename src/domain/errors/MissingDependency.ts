import { SerializableStatic } from "../types.js";
import { DomainError } from "./DomainError.js";

export class MissingDependency extends DomainError {
    constructor(searched: SerializableStatic, locator: any, dependent: SerializableStatic) {
        super(`${searched.name} could be not found in ${dependent.name}`,
            searched,
            {
                code: 'MISSING_DEPENDENCY',
                status: 404
            });
    }
}