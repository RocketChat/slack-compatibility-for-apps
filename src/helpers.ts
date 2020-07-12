import { IUser } from '@rocket.chat/apps-engine/definition/users';
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

export function generateCompatibleTriggerId(originalTriggerId: string, user: IUser): string {
    return `${originalTriggerId}.${user.id}`;
}

/**
 * It returns a tuple containing a `triggerId` and `userId` based on a provided
 * `compatibleTriggerId` ("triggerId.userId")
 *
 * @param compatibleTriggerId string
 * @returns [triggerId: string, userId: string]
 */
export function parseCompatibleTriggerId(compatibleTriggerId: string): [string, string] {
    return compatibleTriggerId.split('.') as [string, string];
}

export function generateToken(): string {
    return  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function generateHash(): string {
    return `${Math.random().toString(10).substring(2, 11)}.${Math.random().toString(16).substring(2, 10)}`;
}

export function calculateExpiryDate(date: Date, millisecondsToExpire: number): Date {
    return new Date(date.valueOf() + millisecondsToExpire);
}

export function findInputBlockElementType(blocks: Array<IInputBlock>, blockId: string, actionId: string): BlockElementType | undefined {
    const block = blocks.find(((block) => block.blockId === blockId && block.element.actionId === actionId));

    return block && block.element && block.element.type;
}

export function uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
