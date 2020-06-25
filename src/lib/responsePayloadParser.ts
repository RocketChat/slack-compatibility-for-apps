import { Block, MessageAttachment } from "../../vendor/slack-types";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { convertToUIKit } from "../converters/BlockKitToUIKit";

export enum ResponseType {
    IN_CHANNEL = 'in_channel',
    EPHEMERAL = 'ephemeral',
}

export interface IMessagePayload {
    text: string;
    blocks?: Array<Block>;
    attachments?: Array<MessageAttachment>;
    thread_ts?: string;
    mrkdwn?: boolean;
}

export interface IResponsePayload extends IMessagePayload {
    response_type?: ResponseType;
    replace_original?: boolean;
    delete_original?: boolean;
}

export type ResponseMessage = Pick<IMessage, 'text' | 'blocks' | 'attachments' | 'threadId'>;

export interface IParseResponseResult {
    instructions: {
        responseType: ResponseType;
        replaceOriginal: boolean;
        deleteOriginal: boolean;
    };
    message?: ResponseMessage;
}

export function parseResponsePayload(payload: IResponsePayload): IParseResponseResult {
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
    if (!message) return undefined;

    return {
        text: message.text,
        blocks: convertToUIKit(message.blocks),
        attachments: [], // deprecated by Slack, should we support?
        threadId: message.thread_ts,
    };
}
