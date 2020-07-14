import { MessageAttachment } from '../../vendor/slack-types';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { convertBlocksToUIKit } from '../converters/BlockKitToUIKit';
import { SlackCompatibleApp } from '../../SlackCompatibleApp';

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

export function parseMessageResponsePayload(payload: IMessageResponsePayload | string | undefined, app: SlackCompatibleApp): IParseMessageResponseResult {
    if (!payload) {
        return { instructions: DEFAULT_INSTRUCTIONS };
    }

    if (typeof payload === 'string') {
        return {
            instructions: DEFAULT_INSTRUCTIONS,
            message: convertSlackMessageToRocketChatMessage({ text: payload }, app.getID()),
        };
    }

    return {
        instructions: {
            responseType: payload.response_type || ResponseType.EPHEMERAL,
            replaceOriginal: !!payload.replace_original,
            deleteOriginal: !!payload.delete_original,
        },
        message: convertSlackMessageToRocketChatMessage(payload, app.getID()),
    }
}

function convertSlackMessageToRocketChatMessage(message: IMessagePayload | undefined, appId: string): ResponseMessage | undefined {
    if (!message || (!message.text && !message.blocks)) return undefined;

    const blocks = (() => {
        if (typeof message.blocks === 'object') return message.blocks;

        try {
            return JSON.parse(message.blocks || '""');
        } catch {
            return [];
        }
    })();

    return {
        text: message.text,
        blocks: convertBlocksToUIKit(blocks, appId),
        attachments: [], // deprecated by Slack, should we support?
        threadId: message.thread_ts,
    };
}
