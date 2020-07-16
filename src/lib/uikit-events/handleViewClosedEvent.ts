import { IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IUIKitResponse, UIKitViewCloseInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';

import { SlackCompatibleApp } from '../../../SlackCompatibleApp';
import { convertViewToBlockKit } from '../../converters/UIKitToBlockKit';
import { BlockKitEventType, IBlockKitViewClosedPayload } from '../../customTypes/slack';
import { OriginalActionType, persistResponseToken } from '../../storage/ResponseTokens';
import { handleViewEventResponse } from '../handleViewEventResponse';
import { generateResponseUrl, getTeamFields, getUserFields } from '../slackCommonFields';
import { getBlockKitViewSkeleton } from './handleViewSubmitEvent';

export async function handleViewClosedEvent(context: UIKitViewCloseInteractionContext, app: SlackCompatibleApp, persis: IPersistence, modify: IModify): Promise<IUIKitResponse> {
    const { user, view, appId } = context.getInteractionData();

    if (!view.notifyOnClose) {
        return context.getInteractionResponder().successResponse();
    }

    const { tokenContext } = await generateResponseUrl({
        action: OriginalActionType.VIEW_CLOSED,
        user: user,
    }, app);

    await persistResponseToken(tokenContext, persis);

    const team = await getTeamFields(app.getAccessors().reader);
    const appUser = await app.getAccessors().reader.getUserReader().getAppUser(app.getID());

    if (!appUser) {
        app.getLogger().error(['Failed to obtain app user']);
        return context.getInteractionResponder().successResponse();
    }

    const payload: IBlockKitViewClosedPayload = {
        api_app_id: appId,
        token: tokenContext.token,
        type: BlockKitEventType.VIEW_SUBMISSION,
        team,
        user: await getUserFields(user, app.getAccessors().reader),
        view: {
            ...getBlockKitViewSkeleton(appId, team.id, appUser.id),
            ...convertViewToBlockKit(view)
        },
        is_cleared: false, // UIKit doesn't support clearing the whole view stack, so it's always false
    };

    const response = await app.sendInteraction(payload);

    return handleViewEventResponse(view, response, context.getInteractionResponder(), { app, modify, persis });
}
