import { 
    camelCaseToSnakeCase,
    snakeCaseToCamelCase,
} from '../helpers';

export interface IElementConverter<T> {
    convertToUIKit(): T;
}

export class ElementConverter<T> implements IElementConverter<T> {
    constructor(protected element: T) {}

    public convertToUIKit(): T {
        return this.renameProperties(snakeCaseToCamelCase);
    }

    public convertToBlockKit(): T {
        return this.renameProperties(camelCaseToSnakeCase);
    }

    private renameProperties(renameFunction: Function): T {
        return Object
        .keys(this.element)
        .map(key => {
            return {[renameFunction(key)]: this.element[key as keyof T]};
        })
        .reduce((acc, curr) => (Object.assign(acc, curr)), {} as T);
    }
}
