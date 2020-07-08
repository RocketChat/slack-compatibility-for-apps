import { IUser } from '@rocket.chat/apps-engine/definition/users';

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

export function generateCompatibleTriggerId(originalTriggerId: string, user: IUser): string {
    return `${originalTriggerId}.${user.id}`;
}

export function generateToken(): string {
    return  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function calculateExpiryDate(date: Date, millisecondsToExpire: number): Date {
    return new Date(date.valueOf() + millisecondsToExpire);
}
