import { describe, it } from 'mocha';
import { ResponseType, IParseMessageResponseResult } from '../../src/lib/messageResponsePayloadParser';
import { IResponseTokenContext, OriginalActionType } from '../../src/lib/ResponseTokens';
import { RESPONSE_URL_EXPIRATION_TIME } from '../../src/lib/constants';
import { IRead, IModify, IModifyCreator, INotifier } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { IRoom, RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser, UserType } from '@rocket.chat/apps-engine/definition/users';
import { MessageBuilderMock } from '../__mocks__/MessageBuilderMock';
import { handleSlashCommandResponsePayload } from '../../src/lib/registerSlashCommands';

const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);

const { expect } = chai;

const getValidExpiryTime = () => new Date(Date.now() + RESPONSE_URL_EXPIRATION_TIME);

const userRepository: {[K: string]: IUser} = {
    'a-user-id': {
        id: 'a-user-id',
        name: 'A User',
        username: 'user.name',
        type: UserType.USER,
    } as IUser,
}

const roomRepository: {[K: string]: IRoom} = {
    'a-room-id': {
        id: 'a-room-id',
        creator: userRepository['a-user-id'],
        slugifiedName: 'a-room',
        type: RoomType.CHANNEL,
        usernames: ['user.name'],
    }
}

describe('Slash Command Response Handler', () => {
    const mockTokenContext: IResponseTokenContext = {
        token: 'some-random-token',
        expiresAt: getValidExpiryTime(),
        originalAction: OriginalActionType.COMMAND,
        recipient: 'a-user-id',
        room: 'a-room-id',
        usageCount: 0,
        originalText: 'the original command here',
    };

    const mockRead = {
        getRoomReader: () => ({
            getById: (id: string) => roomRepository[id],
        }),
        getUserReader: () => ({
            getById: (id: string) => userRepository[id],
        }),
    } as any as IRead;

    const creatorMock = {} as IModifyCreator;
    const notifierMock = {} as INotifier;

    const mockModify = {
        getCreator: () => creatorMock,
        getNotifier: () => notifierMock,
    } as IModify;

    beforeEach(() => {
        chai.spy.on(creatorMock, 'finish');
        chai.spy.on(creatorMock, 'startMessage', (message: IMessage) => new MessageBuilderMock(message));
        chai.spy.on(notifierMock, 'notifyUser');
    });

    afterEach(() => {
        chai.spy.restore();
    });

    it('should handle an ephemeral response properly', async () => {
        const mockEphemeralResponse: IParseMessageResponseResult = {
            instructions: {
                responseType: ResponseType.EPHEMERAL,
                deleteOriginal: false,
                replaceOriginal: false,
            },
            message: {
                text: 'Ephemeral message',
            }
        };

        await handleSlashCommandResponsePayload(mockEphemeralResponse, mockTokenContext, mockRead, mockModify);

        expect(creatorMock.startMessage).to.have.been.called.with(mockEphemeralResponse.message);

        expect(notifierMock.notifyUser).to.have.been.called.with(userRepository['a-user-id'], {
            text: 'Ephemeral message',
            room: roomRepository['a-room-id']
        });
    });

    it('should handle an in_channel response properly', async () => {
        const mockEphemeralResponse: IParseMessageResponseResult = {
            instructions: {
                responseType: ResponseType.IN_CHANNEL,
                deleteOriginal: false,
                replaceOriginal: false,
            },
            message: {
                text: 'In channel message',
            }
        };

        await handleSlashCommandResponsePayload(mockEphemeralResponse, mockTokenContext, mockRead, mockModify);

        expect(creatorMock.startMessage).to.have.been.called.with(mockEphemeralResponse.message);

        // For in_channel messages, it has to send the original message first
        expect(creatorMock.finish).to.have.been.called.first.with(new MessageBuilderMock({
            text: mockTokenContext.originalText,
            room: roomRepository['a-room-id'],
            sender: userRepository['a-user-id'],
        } as IMessage));

        expect(creatorMock.finish).to.have.been.called.second.with(new MessageBuilderMock({
            text: 'In channel message',
            room: roomRepository['a-room-id']
        } as IMessage));
    })
});
