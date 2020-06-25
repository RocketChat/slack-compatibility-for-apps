import { IAppAccessors, IConfigurationExtend, IEnvironmentRead, IHttp, ILogger, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IUIKitInteractionHandler, IUIKitResponse, UIKitBlockInteractionContext, UIKitViewCloseInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { DataReceiver } from './src/endpoints/dataReceiver';
import { ISlashCommandDescriptor, registerSlashCommands } from './src/registerSlashCommands';
import { ResponseUrlEndpoint } from './src/endpoints/ResponseUrlEndpoint';


export abstract class SlackCompatibleApp extends App implements IUIKitInteractionHandler {
    public interactiveEndpoint: string;
    public slashcommands?: Array<ISlashCommandDescriptor>;

    constructor(info: IAppInfo, logger: ILogger, accessors?: IAppAccessors) {
        super(info, logger, accessors);

        this.slashcommands = [].concat(this.slashcommands).filter(descriptor => descriptor.command && descriptor.description);
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
        return context.getInteractionResponder().successResponse();
    }

    // tslint:disable-next-line:max-line-length
    public async executeBlockActionHandler(context: UIKitBlockInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {


        return context.getInteractionResponder().successResponse();
    }

    // tslint:disable-next-line:max-line-length
    public async executeViewClosedHandler(context: UIKitViewCloseInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        return context.getInteractionResponder().successResponse();
    }
}
