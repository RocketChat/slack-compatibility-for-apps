import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';
import { incomingTriggeridHandler, incomingViewHandler } from './ViewsEndpointHelpers';

export class ViewsOpen extends ApiEndpoint {
    public path = 'views.open';

    // tslint:disable-next-line:max-line-length
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const { view, trigger_id } = request.content;

        let uikitView, triggerId, user;
        try {
            [uikitView, [triggerId, user]] = await Promise.all([
                incomingViewHandler(view, persis),
                incomingTriggeridHandler(trigger_id, read),
            ]);
        } catch (viewHandlingError) {
            return this.json({
                status: HttpStatusCode.BAD_REQUEST,
                content: { success: false, message: viewHandlingError.message || '' }
            });
        }

        await modify.getUiController().openModalView(uikitView, { triggerId }, user);

        return this.success();
    }
}
