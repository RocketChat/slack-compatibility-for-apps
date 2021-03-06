import { IAppAccessors, IConfigurationExtend, IEnvironmentRead, IHttp, ILogger, IModify, IPersistence, IRead, IHttpResponse } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import {
    IUIKitInteractionHandler, IUIKitResponse, UIKitBlockInteractionContext, UIKitViewCloseInteractionContext, UIKitViewSubmitInteractionContext
} from '@rocket.chat/apps-engine/definition/uikit';

import { ViewsOpen } from './src/endpoints/ViewsOpen';
import { ViewsUpdate } from './src/endpoints/ViewsUpdate';
import { ISlashCommandDescriptor, registerSlashCommands } from './src/lib/registerSlashCommands';
import { ResponseUrlEndpoint } from './src/endpoints/ResponseUrlEndpoint';
import { handleBlockActionEvent } from './src/lib/uikit-events/handleBlockActionEvent';
import { handleViewSubmitEvent } from './src/lib/uikit-events/handleViewSubmitEvent';
import { handleViewClosedEvent } from './src/lib/uikit-events/handleViewClosedEvent';

export interface ISlackCompatibleAppConfig {
    /**
     * Any interactions with modals, or interactive components (such as buttons, overflow menus)
     * will be sent to a URL you specify. [Learn more.](https://api.slack.com/messaging/interactivity#components)
     *
     * Rocket.Chat will send an HTTP POST request with information to this URL when users interact with a interactive component.
     */
    interactiveEndpoint?: string;
    slashCommands?: Array<ISlashCommandDescriptor>;
}

const DEFAULT_CONFIG: ISlackCompatibleAppConfig = {
    interactiveEndpoint: '',
    slashCommands: [],
};

export abstract class SlackCompatibleApp extends App implements IUIKitInteractionHandler {
    public config: ISlackCompatibleAppConfig = DEFAULT_CONFIG;

    constructor(info: IAppInfo, logger: ILogger, accessors?: IAppAccessors) {
        super(info, logger, accessors);

        if (this.config === DEFAULT_CONFIG) {
            logger.warn("This app hasn't defined any configuration, it's basically an empty shell. Make sure to configure it properly before deploying to production");
        }

        this.config.slashCommands = [].concat(this.config.slashCommands as any).filter((descriptor?: ISlashCommandDescriptor) => descriptor && descriptor.command && descriptor.shortDescription);
    }

    public async initialize(configurationExtend: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        configurationExtend.api.provideApi({
            security: ApiSecurity.UNSECURE,
            visibility: ApiVisibility.PUBLIC,
            endpoints: [
                new ResponseUrlEndpoint(this),
                new ViewsOpen(this),
                new ViewsUpdate(this),
            ],
        });

        await registerSlashCommands(this, configurationExtend);

        return this.extendConfiguration(configurationExtend, environmentRead);
    }

    // tslint:disable-next-line:max-line-length
    public async executeViewSubmitHandler(context: UIKitViewSubmitInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        return handleViewSubmitEvent(context, this, persistence, modify);
    }

    // tslint:disable-next-line:max-line-length
    public async executeBlockActionHandler(context: UIKitBlockInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        return handleBlockActionEvent(context, this, persistence, modify);
    }

    // tslint:disable-next-line:max-line-length
    public async executeViewClosedHandler(context: UIKitViewCloseInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        return handleViewClosedEvent(context, this, persistence, modify);
    }

    public sendInteraction(payload: object): Promise<IHttpResponse> {
        return this.getAccessors().http.post(this.config.interactiveEndpoint, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            content: `payload=${encodeURIComponent(JSON.stringify(payload))}`
        });
    }
}
