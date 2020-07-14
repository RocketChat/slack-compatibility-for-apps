import { IRead, IEnvironmentRead } from '@rocket.chat/apps-engine/definition/accessors';
import { userRepository } from './userRepository';
import { roomRepository } from './roomRepository';

export const mockRead = {
    getEnvironmentReader: () => ({
        getServerSettings: () => ({
            getValueById: () => 'http://localhost:3000',
        }),
    } as any as IEnvironmentRead),
    getRoomReader: () => ({
        getById: (id: string) => roomRepository[id],
    }),
    getUserReader: () => ({
        getById: (id: string) => userRepository[id],
    }),
} as any as IRead;
