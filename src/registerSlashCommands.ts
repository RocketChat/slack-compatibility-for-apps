import { SlackCompatibleApp } from "../SlackCompatibleApp";
import { IConfigurationExtend, IRead, IModify, IHttp, IPersistence, IMessageBuilder } from "@rocket.chat/apps-engine/definition/accessors";
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { URLSearchParams } from "url";
import { getTeamFields, generateResponseUrl, getChannelFields, getUserFields } from "./lib/slackCommonFields";
import { OriginalActionType, persistResponseToken, IResponseTokenContext } from "./lib/ResponseTokens";
import { IResponsePayload, parseResponsePayload, IParseResponseResult, ResponseType } from "./lib/responsePayloadParser";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";

const noop = ()=>{};

const encodePayload = (payload: { [K: string]: string }): string =>
    new URLSearchParams(Object.entries(payload).filter(([key, value]) => !!value)).toString();

export interface ISlashCommandDescriptor {
    command: string;
    requestURL: string;
    shortDescription: string;
    usageHint?: string;
    // escapeChannels: boolean; will not support now
}

export interface ISlashCommandPayload {
    token: string; // deprecated in Slack
    command: string;
    text: string;
    response_url: string;
    trigger_id: string;
    user_id: string;
    user_name: string;
    team_id: string;
    team_domain: string;
    channel_id: string;
    channel_name: string;
    enterprise_id?: string;
    enterprise_name?: string;
}

export function registerSlashCommands(app: SlackCompatibleApp, configuration: IConfigurationExtend): Promise<void> {
    return Promise.all(app.slashcommands.map(descriptor => configuration.slashCommands.provideSlashCommand({
        command: descriptor.command,
        i18nDescription: descriptor.shortDescription,
        i18nParamsExample: descriptor.usageHint,
        providesPreview: false,
        executor: createSlashcommandExecutor(app, descriptor),
    }))).then(noop);
}

/**
 * Factory higher order function that creates
 * a proper slash command executor function
 * with the defined descriptor as context
 */
function createSlashcommandExecutor(app: SlackCompatibleApp, descriptor: ISlashCommandDescriptor): ISlashCommand['executor'] {
    return async (context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> => {
        const originalMessage = `${descriptor.command} ${context.getArguments().join(' ')}`;

        const {responseUrl: response_url, tokenContext} = await generateResponseUrl({
            action: OriginalActionType.COMMAND,
            room: context.getRoom(),
            user: context.getSender(),
            text: originalMessage,
        }, read, app);

        await persistResponseToken(tokenContext, persis);

        const payload: ISlashCommandPayload = {
            token: '', // Slack deprecated
            enterprise_id: undefined, // we have no equivalent
            enterprise_name: undefined, // we have no equivalent
            response_url,
            command: descriptor.command,
            text: context.getArguments().join(' '),
            trigger_id: context.getTriggerId(),
            ...await getTeamFields(read),
            ...getChannelFields(context.getRoom()),
            ...getUserFields(context.getSender()),
        };

        const response = await http.post(descriptor.requestURL, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            content: encodePayload(payload as unknown as { [K: string]: string }),
        });

        const responsePayload = ((): IResponsePayload | string => {
            try {
                return JSON.parse(response.content);
            } catch {
                return response.content;
            }
        })();

        await handleSlashCommandResponsePayload(
            parseResponsePayload(responsePayload),
            tokenContext,
            read,
            modify,
        );
    }
}

export async function handleSlashCommandResponsePayload({instructions, message}: IParseResponseResult, tokenContext: IResponseTokenContext, read: IRead, modify: IModify): Promise<void> {
    if (!message) return;

    const recipient = await read.getUserReader().getById(tokenContext.recipient);
    const room = await read.getRoomReader().getById(tokenContext.room);

    let method = (message: IMessageBuilder) => modify.getNotifier().notifyUser(recipient, message.getMessage());

    if (instructions.responseType === ResponseType.IN_CHANNEL) {
        method = (message: IMessageBuilder) => modify.getCreator().finish(message).then();

        await method(modify.getCreator().startMessage({ text: tokenContext.originalText, room, sender: recipient }));
    }

    return method(modify.getCreator().startMessage({ ...message, room, sender: undefined }));
}
