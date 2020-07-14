import { IEnvironmentRead, IAppAccessors } from '@rocket.chat/apps-engine/definition/accessors';
import { RESPONSE_URL_ENDPOINT_BASE_PATH } from '../../src/lib/constants';
import { SlackCompatibleApp } from '../../SlackCompatibleApp';

export const mockApp = {
    getID: () => 'mockAppId',
    getAccessors: () => ({
        environmentReader: {
            getServerSettings: () => ({
                getValueById: () => 'http://localhost:3000',
            }),
        } as any as IEnvironmentRead,
        providedApiEndpoints: [
            {
                path: `${RESPONSE_URL_ENDPOINT_BASE_PATH}/:token`,
                computedPath: `/api/apps/public/RANDOM_APP_ID/${RESPONSE_URL_ENDPOINT_BASE_PATH}/:token`,
                methods: [],
            },
        ]
    }) as IAppAccessors,
} as SlackCompatibleApp;
