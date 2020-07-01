import { expect } from 'chai';
import { describe, it } from 'mocha';
import { IRoom, RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser, UserType } from '@rocket.chat/apps-engine/definition/users';
import { getChannelFields, getUserFields, IGenerateResponseUrlParams, generateResponseUrl } from "../../src/lib/slackCommonFields";
import { OriginalActionType } from '../../src/lib/ResponseTokens';
import { IEnvironmentRead, IAppAccessors } from '@rocket.chat/apps-engine/definition/accessors';
import { SlackCompatibleApp } from '../../SlackCompatibleApp';
import { RESPONSE_URL_ENDPOINT_BASE_PATH } from '../../src/lib/constants';

describe('Slack common fields getters', () => {
    it('should return correct channel fields based on room info', () => {
        const mockRoom: IRoom = {
            creator: {} as IUser,
            id: 'room_id',
            slugifiedName: 'mock-room',
            type: RoomType.CHANNEL,
            usernames: [],
        };

        const roomFields = getChannelFields(mockRoom);

        expect(roomFields).to.deep.equal({
            channel_id: 'room_id',
            channel_name: 'mock-room',
        });
    });

    it('should return correct user fields based on user info', () => {
        const mockUser = {
            id: 'user_id',
            name: 'User Name',
            type: UserType.USER,
        } as IUser;

        const userFields = getUserFields(mockUser);

        expect(userFields).to.deep.equal({
            user_id: 'user_id',
            user_name: 'User Name',
        });
    });

    it('should generate a valid response_url', async () => {
        const mockParams: IGenerateResponseUrlParams = {
            action: OriginalActionType.COMMAND,
            room: {
                creator: {} as IUser,
                id: 'room_id',
                slugifiedName: 'mock-room',
                type: RoomType.CHANNEL,
                usernames: [],
            },
            user: {
                id: 'user_id',
                name: 'User Name',
                type: UserType.USER,
            } as IUser,
            text: 'The original command that the user typed',
        };

        const mockApp = {
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

        const {responseUrl, tokenContext} = await generateResponseUrl(mockParams, mockApp);

        expect(responseUrl).to.equal(`http://localhost:3000/api/apps/public/RANDOM_APP_ID/${RESPONSE_URL_ENDPOINT_BASE_PATH}/${tokenContext.token}`);
        expect(tokenContext).to.include({
            room: 'room_id',
            recipient: 'user_id',
            originalAction: OriginalActionType.COMMAND,
            originalText: 'The original command that the user typed',
            usageCount: 0,
        });
    });
});
