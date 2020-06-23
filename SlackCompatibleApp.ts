import { IAppAccessors, IConfigurationExtend, IEnvironmentRead, IHttp, ILogger, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IUIKitInteractionHandler, IUIKitResponse, UIKitBlockInteractionContext, UIKitViewCloseInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { DataReceiver } from './src/endpoints/dataReceiver';

export abstract class SlackCompatibleApp extends App implements IUIKitInteractionHandler {
    constructor(info: IAppInfo, logger: ILogger, accessors?: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async initialize(configurationExtend: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        configurationExtend.api.provideApi({
            security: ApiSecurity.UNSECURE,
            visibility: ApiVisibility.PUBLIC,
            endpoints: [new DataReceiver(this)],
        });

        await this.extendConfiguration(configurationExtend, environmentRead);
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
