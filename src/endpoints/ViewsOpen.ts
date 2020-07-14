import { IHttp, IModify, IPersistence, IRead, HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';
import { convertViewToUIKit } from '../converters/BlockKitToUIKit';
import { parseCompatibleTriggerId } from '../helpers';
import { persistView } from '../storage/PersistView';
import { IBlockKitView } from '../customTypes/slack';


export class ViewsOpen extends ApiEndpoint {
    public path = 'views.open';

    // tslint:disable-next-line:max-line-length
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const { view, trigger_id } = request.content;

        if(!view || !trigger_id) {
            return this.json({ status: HttpStatusCode.BAD_REQUEST });
        }

        const [triggerId, userId] = parseCompatibleTriggerId(trigger_id);

        if(!triggerId || !userId) {
            return this.json({ status: HttpStatusCode.BAD_REQUEST });
        }

        const slackView = JSON.parse(view) as IBlockKitView;

        const uikitView = convertViewToUIKit(slackView, this.app.getID());

        await persistView(slackView, persis);

        const user = await read.getUserReader().getById(userId);

        await modify.getUiController().openModalView(uikitView, { triggerId }, user);

        return this.success();
    }
}
