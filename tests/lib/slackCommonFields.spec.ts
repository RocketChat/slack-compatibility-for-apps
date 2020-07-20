import { expect } from 'chai';
import { describe, it } from 'mocha';
import { IRoom, RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser, UserType } from '@rocket.chat/apps-engine/definition/users';
import { getChannelFields, getUserFields, IGenerateResponseUrlParams, generateResponseUrl } from "../../src/lib/slackCommonFields";
import { OriginalActionType } from '../../src/storage/ResponseTokens';
import { RESPONSE_URL_ENDPOINT_BASE_PATH } from '../../src/lib/constants';
import { mockRead } from '../__mocks__/ReadMock';
import { mockApp } from '../__mocks__/SlackCompatibleAppMock';
import { userRepository } from '../__mocks__/userRepository';

describe('Slack common fields getters', () => {
    it('should return correct channel fields based on room info', async () => {
        const mockRoom: IRoom = {
            creator: {} as IUser,
            id: 'room_id',
            slugifiedName: 'mock-room',
            type: RoomType.CHANNEL,
            usernames: [],
        };

        const roomFields = await getChannelFields(mockRoom);

        expect(roomFields).to.deep.equal({
            channel_id: 'room_id',
            channel_name: 'mock-room',
        });
    });

    it('should return correct user fields based on user info', async () => {
        const userFields = await getUserFields(userRepository['a-user-id'], mockRead);

        expect(userFields).to.deep.equal({
            id: 'a-user-id',
            name: 'A User',
            username: 'user.name',
            team_id: 'http://localhost:3000',
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
