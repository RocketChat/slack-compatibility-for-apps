import { SlackCompatibleApp } from "../SlackCompatibleApp";
import { IConfigurationExtend, IRead, IModify, IHttp, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { URLSearchParams } from "url";

const noop = ()=>{};

const encodePayload = (payload: { [K: string]: string }): string =>
    new URLSearchParams(Object.entries(payload).filter(([key, value]) => !!value)).toString();

export interface ISlashCommandDescriptor {
    command: string;
    requestURL: string;
    shortDescription: string;
    usageHint: string;
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
function createSlashcommandExecutor(app: SlackCompatibleApp, command: ISlashCommandDescriptor): ISlashCommand['executor'] {
    return async (context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> => {
        const payload: ISlashCommandPayload = {
            token: '', // Slack deprecated
            team_id: '', // Not sure what we could send
            team_domain: await read.getEnvironmentReader().getServerSettings().getValueById('Site_Url'),
            enterprise_id: undefined, // we have no equivalent
            enterprise_name: undefined, // we have no equivalent
            channel_id: context.getRoom().id,
            channel_name: context.getRoom().slugifiedName,
            user_id: context.getSender().id,
            user_name: context.getSender().name,
            command: command.command,
            text: context.getArguments().join(' '),
            trigger_id: context.getTriggerId(),
            response_url: '',
        };

        await http.post(command.requestURL, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            content: encodePayload(payload as unknown as { [K: string]: string }),
        });
    }
}
