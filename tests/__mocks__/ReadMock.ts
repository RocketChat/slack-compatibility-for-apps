import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { userRepository } from './userRepository';
import { roomRepository } from './roomRepository';

export const mockRead = {
    getRoomReader: () => ({
        getById: (id: string) => roomRepository[id],
    }),
    getUserReader: () => ({
        getById: (id: string) => userRepository[id],
    }),
} as any as IRead;
