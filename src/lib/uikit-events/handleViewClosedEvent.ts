import { IUIKitResponse, UIKitViewCloseInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IBlockKitViewClosedPayload, BlockKitEventType } from '../../customTypes/slack';
import { getTeamFields, getUserFields } from '../slackCommonFields';
import { convertViewToBlockKit } from '../../converters/UIKitToBlockKit';
import { handleViewEventResponse } from '../handleViewEventResponse';
import { SlackCompatibleApp } from '../../../SlackCompatibleApp';

export async function handleViewClosedEvent(context: UIKitViewCloseInteractionContext, app: SlackCompatibleApp, persis: IPersistence, modify: IModify): Promise<IUIKitResponse> {
    const { user, view, triggerId } = context.getInteractionData();

    if (!triggerId) return context.getInteractionResponder().successResponse();

    const payload: IBlockKitViewClosedPayload = {
        type: BlockKitEventType.VIEW_SUBMISSION,
        team: await getTeamFields(app.getAccessors().reader),
        user: await getUserFields(user, app.getAccessors().reader),
        view: convertViewToBlockKit(view),
        is_cleared: false, // UIKit doesn't support clearing the whole view stack, so it's always false
    };

    const response = await app.sendInteraction(payload);

    await handleViewEventResponse(response, triggerId, { app, modify, persis });

    return context.getInteractionResponder().successResponse();
}
