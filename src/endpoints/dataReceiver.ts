import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

import { convertBlocksToUIKit } from '../converters/BlockKitToUIKit';

export class DataReceiver extends ApiEndpoint {
    public path = 'data-receiver';

    // tslint:disable-next-line:max-line-length
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        // @TODO this content is hardcoded. The logic must be rewriten
        const blockKitData = JSON.parse(request.content.blocks);

        const appUsername = this.app.getAppUserUsername();

        const roomName = 'general';
        const room = await read.getRoomReader().getByName(roomName) as IRoom;
        const sender = await read.getUserReader().getByUsername(appUsername);

        const blocks = convertBlocksToUIKit(blockKitData, this.app.getID());
        const message = 'test message';

        const messageStructure = await modify.getCreator().startMessage();

        messageStructure
            .setSender(sender)
            .setRoom(room)
            .setText(message)
            .setBlocks(blocks);

        await modify.getCreator().finish(messageStructure);

        return this.success();
    }
}
