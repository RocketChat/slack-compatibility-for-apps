import { MessageAttachment } from '../../vendor/slack-types';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { convertBlocksToUIKit } from '../converters/BlockKitToUIKit';

export enum ResponseType {
    IN_CHANNEL = 'in_channel',
    EPHEMERAL = 'ephemeral',
}

export interface IMessagePayload {
    text?: string;
    blocks?: string;
    attachments?: Array<MessageAttachment>;
    thread_ts?: string;
    mrkdwn?: boolean;
}

export interface IMessageResponsePayload extends IMessagePayload {
    response_type?: ResponseType;
    replace_original?: boolean;
    delete_original?: boolean;
}

export type ResponseMessage = Pick<IMessage, 'text' | 'blocks' | 'attachments' | 'threadId'>;

export interface IParseMessageResponseResult {
    instructions: {
        responseType: ResponseType;
        replaceOriginal: boolean;
        deleteOriginal: boolean;
    };
    message?: ResponseMessage;
}

const DEFAULT_INSTRUCTIONS = {
    responseType: ResponseType.EPHEMERAL,
    replaceOriginal: false,
    deleteOriginal: false,
}

export function parseMessageResponsePayload(payload: IMessageResponsePayload | string | undefined): IParseMessageResponseResult {
    if (!payload) {
        return { instructions: DEFAULT_INSTRUCTIONS };
    }

    if (typeof payload === 'string') {
        return {
            instructions: DEFAULT_INSTRUCTIONS,
            message: convertSlackMessageToRocketChatMessage({ text: payload }),
        };
    }

    return {
        instructions: {
            responseType: payload.response_type || ResponseType.EPHEMERAL,
            replaceOriginal: !!payload.replace_original,
            deleteOriginal: !!payload.delete_original,
        },
        message: convertSlackMessageToRocketChatMessage(payload),
    }
}

function convertSlackMessageToRocketChatMessage(message?: IMessagePayload): ResponseMessage | undefined {
    if (!message || (!message.text && !message.blocks)) return undefined;

    return {
        text: message.text,
        blocks: convertBlocksToUIKit(JSON.parse(message.blocks || '""')),
        attachments: [], // deprecated by Slack, should we support?
        threadId: message.thread_ts,
    };
}
