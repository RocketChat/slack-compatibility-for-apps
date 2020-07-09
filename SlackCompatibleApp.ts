import {
    IAppAccessors, IConfigurationExtend, IEnvironmentRead, IHttp, ILogger, IModify, IPersistence, IRead
} from '@rocket.chat/apps-engine/definition/accessors';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import {
    IUIKitInteractionHandler, IUIKitResponse, UIKitBlockInteractionContext, UIKitViewCloseInteractionContext, UIKitViewSubmitInteractionContext
} from '@rocket.chat/apps-engine/definition/uikit';

import { convertViewToBlockKit } from './src/converters/UIKitToBlockKit';
import { handleViewEventResponse } from './src/lib/handleViewEventResponse';
import { BlockKitEventType, IBlockKitViewClosedPayload, IBlockKitViewSubmissionPayload } from './src/customTypes/slack';
import { DataReceiver } from './src/endpoints/dataReceiver';
import { ISlashCommandDescriptor, registerSlashCommands } from './src/lib/registerSlashCommands';
import { ResponseUrlEndpoint } from './src/endpoints/ResponseUrlEndpoint';
import { generateHash } from './src/helpers';
import { getTeamFields, getUserFields } from './src/lib/slackCommonFields';

export abstract class SlackCompatibleApp extends App implements IUIKitInteractionHandler {
    /**
     * Any interactions with modals, or interactive components (such as buttons, overflow menus)
     * will be sent to a URL you specify. [Learn more.](https://api.slack.com/messaging/interactivity#components)
     *
     * Rocket.Chat will send an HTTP POST request with information to this URL when users interact with a interactive component.
     */
    public interactiveEndpoint: string;
    public slashcommands?: Array<ISlashCommandDescriptor>;

    constructor(info: IAppInfo, logger: ILogger, accessors?: IAppAccessors) {
        super(info, logger, accessors);

        this.slashcommands = [].concat(this.slashcommands as any).filter((descriptor?: ISlashCommandDescriptor) => descriptor && descriptor.command && descriptor.shortDescription);
    }

    public async initialize(configurationExtend: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        configurationExtend.api.provideApi({
            security: ApiSecurity.UNSECURE,
            visibility: ApiVisibility.PUBLIC,
            endpoints: [
                new DataReceiver(this),
                new ResponseUrlEndpoint(this),
            ],
        });

        await registerSlashCommands(this, configurationExtend);

        return this.extendConfiguration(configurationExtend, environmentRead);
    }

    // tslint:disable-next-line:max-line-length
    public async executeViewSubmitHandler(context: UIKitViewSubmitInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        const { user, view } = context.getInteractionData();
        const payload: IBlockKitViewSubmissionPayload = {
            type: BlockKitEventType.VIEW_SUBMISSION,
            team: await getTeamFields(read),
            user: getUserFields(user),
            view: convertViewToBlockKit(view),
            hash: generateHash(),
        };

        const response = await http.post(this.interactiveEndpoint, {
            headers: {
                'Content-Type': 'application/json',
            },
            content: JSON.stringify(payload),
        });

        await handleViewEventResponse(response);

        return context.getInteractionResponder().successResponse();
    }

    // tslint:disable-next-line:max-line-length
    public async executeBlockActionHandler(context: UIKitBlockInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        return context.getInteractionResponder().successResponse();
    }

    // tslint:disable-next-line:max-line-length
    public async executeViewClosedHandler(context: UIKitViewCloseInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        const { user, view } = context.getInteractionData();
        const payload: IBlockKitViewClosedPayload = {
            type: BlockKitEventType.VIEW_SUBMISSION,
            team: await getTeamFields(read),
            user: getUserFields(user),
            view: convertViewToBlockKit(view),
            is_cleared: false, // Todo (shiqi.mei): should set value according the actual situation
        };

        const response = await http.post(this.interactiveEndponit, {
            headers: {
                'Content-Type': 'application/json',
            },
            content: JSON.stringify(payload),
        });

        await handleViewEventResponse(response);

        return context.getInteractionResponder().successResponse();
    }
}
