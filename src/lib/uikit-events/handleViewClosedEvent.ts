import { IUIKitResponse, UIKitViewCloseInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IBlockKitViewClosedPayload, BlockKitEventType } from '../../customTypes/slack';
import { getTeamFields, getUserFields } from '../slackCommonFields';
import { convertViewToBlockKit } from '../../converters/UIKitToBlockKit';
import { handleViewEventResponse } from '../handleViewEventResponse';
import { SlackCompatibleApp } from '../../../SlackCompatibleApp';

export async function handleViewClosedEvent(context: UIKitViewCloseInteractionContext, app: SlackCompatibleApp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
    const { user, view } = context.getInteractionData();
    const payload: IBlockKitViewClosedPayload = {
        type: BlockKitEventType.VIEW_SUBMISSION,
        team: await getTeamFields(app.getAccessors().reader),
        user: await getUserFields(user, app.getAccessors().reader),
        view: convertViewToBlockKit(view),
        is_cleared: false, // Todo (shiqi.mei): should set value according the actual situation
    };

    const response = await app.sendInteraction(payload);

    await handleViewEventResponse(response);

    return context.getInteractionResponder().successResponse();
}
