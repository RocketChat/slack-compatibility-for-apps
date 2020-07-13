import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parseMessageResponsePayload, ResponseType, IMessageResponsePayload } from '../../src/lib/messageResponsePayloadParser';
import { SlackCompatibleApp } from '../../SlackCompatibleApp';

describe('Message Response Payload Parser', () => {
    const mockApp = {
        getID: () => 'mockAppId',
    } as SlackCompatibleApp;

    it('should correctly parse a plain text response', () => {
        const parsedResponse = parseMessageResponsePayload('Plain text response', mockApp);

        expect(parsedResponse).to.deep.equal({
            instructions: {
                responseType: ResponseType.EPHEMERAL,
                replaceOriginal: false,
                deleteOriginal: false,
            },
            message: {
                text: 'Plain text response',
                blocks: [],
                attachments: [],
                threadId: undefined,
            }
        });
    });

    it('should correctly parse a complex message payload', () => {
        const mockPayload: IMessageResponsePayload = {
            text: 'Complex response',
            delete_original: true,
            replace_original: true,
            response_type: ResponseType.IN_CHANNEL,
            thread_ts: 'random_thread_ts',
        };

        const parsedResponse = parseMessageResponsePayload(mockPayload, mockApp);

        expect(parsedResponse).to.deep.equal({
            instructions: {
                responseType: ResponseType.IN_CHANNEL,
                deleteOriginal: true,
                replaceOriginal: true,
            },
            message: {
                text: 'Complex response',
                blocks: [],
                attachments: [],
                threadId: 'random_thread_ts',
            }
        })
    });

    it('should not return a message if no message fields appear in the payload', () => {
        const mockPayload: IMessageResponsePayload = {
            delete_original: true,
        };

        const parsedResponse = parseMessageResponsePayload(mockPayload, mockApp);

        expect(parsedResponse).to.deep.equal({
            instructions: {
                responseType: ResponseType.EPHEMERAL,
                replaceOriginal: false,
                deleteOriginal: true,
            },
            message: undefined,
        });
    })
});
