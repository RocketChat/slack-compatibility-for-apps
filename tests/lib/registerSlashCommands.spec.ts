import { describe, it } from 'mocha';
import { ResponseType, IParseMessageResponseResult } from '../../src/lib/messageResponsePayloadParser';
import { IResponseTokenContext, OriginalActionType } from '../../src/storage/ResponseTokens';
import { RESPONSE_URL_EXPIRATION_TIME } from '../../src/lib/constants';
import { IModify, IModifyCreator, INotifier } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { MessageBuilderMock } from '../__mocks__/MessageBuilderMock';
import { handleSlashCommandResponsePayload } from '../../src/lib/registerSlashCommands';
import { mockRead } from '../__mocks__/ReadMock';
import { userRepository } from '../__mocks__/userRepository';
import { roomRepository } from '../__mocks__/roomRepository';

const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);

const { expect } = chai;

const getValidExpiryTime = () => new Date(Date.now() + RESPONSE_URL_EXPIRATION_TIME);

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
