import { BlockElementType, IInputBlock } from "@rocket.chat/apps-engine/definition/uikit";

export function snakeCaseToCamelCase(input: string): string {
    return input.toLowerCase()
    .replace(/_([a-z])/g, i => i.toUpperCase())
    .replace(/_/g, '');
}

export function camelCaseToSnakeCase(input: string): string {
    return input.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function renameObjectProperties(renameFunction: Function, source: object): object {
    return Object
    .keys(source)
    .map(key => {
        return {[renameFunction(key)]: source[key as keyof object]};
    })
    .reduce((acc, curr) => (Object.assign(acc, curr)), {});
}

export function removeObjectProperties(source: object, properties: string[] = []): object {
    return Object
    .keys(source)
    .filter(key => !properties.includes(key))
    .map(key => {
        return {[key]: source[key as keyof object]};
    })
    .reduce((acc, curr) => Object.assign(acc, curr), {});
}

export function generateToken(): string {
    return  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function calculateExpiryDate(date: Date, millisecondsToExpire: number): Date {
    return new Date(date.valueOf() + millisecondsToExpire);
}

export function findUIKitInputBlockElementTypeByBlockIdAndActionId(blocks: Array<IInputBlock>, blockId: string, actionId: string): BlockElementType | undefined {
    const block = blocks.find(((block) => block.blockId === blockId && block.element.actionId === actionId));

    return block && block.element && block.element.type;
}
