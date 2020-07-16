import { IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IUIKitResponse, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';

import { SlackCompatibleApp } from '../../../SlackCompatibleApp';
import { convertViewToBlockKit } from '../../converters/UIKitToBlockKit';
import { BlockKitEventType, IBlockKitViewSubmissionPayload } from '../../customTypes/slack';
import { generateCompatibleTriggerId, generateRandomHash } from '../../helpers';
import { OriginalActionType, persistResponseToken } from '../../storage/ResponseTokens';
import { handleViewEventResponse } from '../handleViewEventResponse';
import { generateResponseUrl, getTeamFields, getUserFields } from '../slackCommonFields';

export async function handleViewSubmitEvent(context: UIKitViewSubmitInteractionContext, app: SlackCompatibleApp, persis: IPersistence, modify: IModify): Promise<IUIKitResponse> {
    const { user, view, triggerId, appId, room } = context.getInteractionData();

    if (!triggerId) return context.getInteractionResponder().successResponse();

    const { responseUrl, tokenContext } = await generateResponseUrl({
        action: OriginalActionType.VIEW_SUBMISSION,
        room: room,
        user: user,
    }, app);

    await persistResponseToken(tokenContext, persis);

    const payload: IBlockKitViewSubmissionPayload = {
        api_app_id: appId,
        trigger_id: generateCompatibleTriggerId(triggerId, user),
        token: tokenContext.token,
        type: BlockKitEventType.VIEW_SUBMISSION,
        team: await getTeamFields(app.getAccessors().reader),
        user: await getUserFields(user, app.getAccessors().reader),
        view: convertViewToBlockKit(view),
        hash: generateRandomHash(),
        response_urls: [responseUrl],
    };

    const response = await app.sendInteraction(payload);

    await handleViewEventResponse(response, triggerId, { app, modify, persis });

    return context.getInteractionResponder().successResponse();
}
