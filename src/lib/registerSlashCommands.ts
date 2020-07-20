import { SlackCompatibleApp } from '../../SlackCompatibleApp';
import { IConfigurationExtend, IRead, IModify, IHttp, IPersistence, IMessageBuilder } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { URLSearchParams } from 'url';
import { getTeamFields, generateResponseUrl, getChannelFields, getUserFields } from './slackCommonFields';
import { OriginalActionType, persistResponseToken, IResponseTokenContext } from '../storage/ResponseTokens';
import { IMessageResponsePayload, parseMessageResponsePayload, IParseMessageResponseResult, ResponseType } from './messageResponsePayloadParser';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { generateCompatibleTriggerId } from '../helpers';

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
    if (!app.slashcommands) return Promise.resolve();

    return Promise.all(app.slashcommands.map(descriptor => configuration.slashCommands.provideSlashCommand({
        command: descriptor.command[0] === '/' ? descriptor.command.substring(1) : descriptor.command,
        i18nDescription: descriptor.shortDescription,
        i18nParamsExample: descriptor.usageHint || '',
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
        const command = descriptor.command[0] === '/' ? descriptor.command : `/${descriptor.command}`;

        const originalMessage = `${command} ${context.getArguments().join(' ')}`;

        const {responseUrl: response_url, tokenContext} = await generateResponseUrl({
            action: OriginalActionType.COMMAND,
            room: context.getRoom(),
            user: context.getSender(),
            text: originalMessage,
        }, app);

        await persistResponseToken(tokenContext, persis);

        const { id: team_id, domain: team_domain } = await getTeamFields(read);
        const { id: user_id, name: user_name } = await getUserFields(context.getSender(), read);

        const payload: ISlashCommandPayload = {
            command,
            token: '', // Slack deprecated
            enterprise_id: undefined, // we have no equivalent
            enterprise_name: undefined, // we have no equivalent
            response_url,
            text: context.getArguments().join(' '),
            trigger_id: generateCompatibleTriggerId(context.getTriggerId() || '', context.getSender()),
            team_id,
            team_domain,
            user_id,
            user_name,
            ...await getChannelFields(context.getRoom()),
        };

        const response = await http.post(descriptor.requestURL, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            content: encodePayload(payload as any as { [K: string]: string }),
        });

        const responsePayload = ((): IMessageResponsePayload | string => {
            try {
                return JSON.parse(response.content || '');
            } catch {
                return response.content || '';
            }
        })();

        if (!responsePayload) return;

        await handleSlashCommandResponsePayload(
            parseMessageResponsePayload(responsePayload, app.getID()),
            tokenContext,
            read,
            modify,
        );
    }
}

export async function handleSlashCommandResponsePayload({instructions, message}: IParseMessageResponseResult, tokenContext: IResponseTokenContext, read: IRead, modify: IModify): Promise<void> {
    if (!message || !tokenContext.room) return;

    const recipient = await read.getUserReader().getById(tokenContext.recipient);
    const room = await read.getRoomReader().getById(tokenContext.room);

    if (!recipient || !room) {
        throw new Error('Invalid token');
    }

    const builder = modify.getCreator().startMessage(message as IMessage);
    builder.setRoom(room);

    if (instructions.responseType === ResponseType.IN_CHANNEL) {
        await handleInChannelResponse(builder, recipient, tokenContext, modify);
    } else {
        await handleEphemeralResponse(builder, recipient, modify);
    }
}

const handleEphemeralResponse = async (messageBuilder: IMessageBuilder, recipient: IUser, modify: IModify) => {
    modify.getNotifier().notifyUser(recipient, messageBuilder.getMessage());
};

const handleInChannelResponse = async (messageBuilder: IMessageBuilder, recipient: IUser, tokenContext: IResponseTokenContext, modify: IModify) => {
    const originalMessageBuilder = modify.getCreator().startMessage();

    originalMessageBuilder
        .setText(tokenContext.originalText || '')
        .setRoom(messageBuilder.getRoom())
        .setSender(recipient);

    await modify.getCreator().finish(originalMessageBuilder);

    await modify.getCreator().finish(messageBuilder);
}
