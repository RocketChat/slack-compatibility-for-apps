import { IUIKitResponse, UIKitViewCloseInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IBlockKitViewClosedPayload, BlockKitEventType } from '../../customTypes/slack';
import { generateResponseUrl, getTeamFields, getUserFields } from '../slackCommonFields';
import { convertViewToBlockKit } from '../../converters/UIKitToBlockKit';
import { handleViewEventResponse } from '../handleViewEventResponse';
import { SlackCompatibleApp } from '../../../SlackCompatibleApp';
import { OriginalActionType, persistResponseToken } from '../../storage/ResponseTokens';

export async function handleViewClosedEvent(context: UIKitViewCloseInteractionContext, app: SlackCompatibleApp, persis: IPersistence, modify: IModify): Promise<IUIKitResponse> {
    const { user, view, triggerId, appId, room } = context.getInteractionData();

    if (!view.notifyOnClose) {
        return context.getInteractionResponder().successResponse();
    }

    const { tokenContext } = await generateResponseUrl({
        action: OriginalActionType.VIEW_CLOSED,
        room: room,
        user: user,
    }, app);

    await persistResponseToken(tokenContext, persis);

    const payload: IBlockKitViewClosedPayload = {
        api_app_id: appId,
        token: tokenContext.token,
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
