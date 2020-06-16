interface ICaseTranslator {
    (input: string): string,
};

export function snakeCaseToCamelCase(input: string): string {
    return input.toLowerCase()
    .replace(/_([a-z])/g, i => i.toUpperCase())
    .replace(/_/g, '');
}

export function camelCaseToSnakeCase(input: string): string {
    return input.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function renameObjectProperties(obj: any, translator: ICaseTranslator) {}
