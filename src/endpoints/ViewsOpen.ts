import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';

import { convertViewToUIKit } from '../converters/BlockKitToUIKit';
import { IBlockKitView } from '../customTypes/slack';
import { parseCompatibleTriggerId, uuid } from '../helpers';
import { persistView } from '../storage/PersistView';

export class ViewsOpen extends ApiEndpoint {
    public path = 'views.open';

    public static async executeViewOpen(
        view: IBlockKitView | string, triggerId: string, accessors: { app: IApp, modify: IModify, persis: IPersistence }
    ): Promise<void> {
        if (!view || !triggerId) {
            throw { status: HttpStatusCode.BAD_REQUEST, content: { sucess: false, message: 'Invalid view or trigger_id' } };
        }

        const slackView = (() => {
            if (typeof view !== 'string') return view;

            try {
                return JSON.parse(view);
            } catch {
                return undefined;
            }
        })() as IBlockKitView | undefined;

        if (!slackView) {
            throw { status: HttpStatusCode.BAD_REQUEST, content: { success: false, message: 'Invalid view definition' } };
        }

        if (!slackView.id) {
            slackView.id = uuid();
        }

        const { app, modify, persis } = accessors;
        const [trigger_id, userId] = parseCompatibleTriggerId(triggerId);
        const uikitView = convertViewToUIKit(slackView, app.getID());
        const user = await app.getAccessors().reader.getUserReader().getById(userId);

        if (!trigger_id || !user) {
            throw { status: HttpStatusCode.BAD_REQUEST, content: { success: false, message: 'Invalid trigger_id' } };
        }

        // We need this to store the view
        await persistView(slackView, persis);
        await modify.getUiController().openModalView(uikitView, { triggerId }, user);
    }

    public async post(
        request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence
    ): Promise<IApiResponse> {
        const { view, trigger_id } = request.content;

        try {
            await ViewsOpen.executeViewOpen(view, trigger_id, { app: this.app, modify, persis });
        } catch (err) {
            return this.json(err);
        }

        return this.success();
    }
}
