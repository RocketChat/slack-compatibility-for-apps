import { IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IUIKitResponse, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';

import { SlackCompatibleApp } from '../../../SlackCompatibleApp';
import { convertViewToBlockKit } from '../../converters/UIKitToBlockKit';
import { BlockKitEventType, IBlockKitView, IBlockKitViewSubmissionPayload } from '../../customTypes/slack';
import { generateCompatibleTriggerId, generateRandomHash } from '../../helpers';
import { OriginalActionType, persistResponseToken } from '../../storage/ResponseTokens';
import { handleViewEventResponse } from '../handleViewEventResponse';
import { generateResponseUrl, getTeamFields, getUserFields } from '../slackCommonFields';

export function getBlockKitViewSkeleton(appId: string, teamId: string, appUserId: string): Partial<IBlockKitView> {
    return {
        root_view_id: null,
        app_id: appId,
        external_id: '',
        app_installed_team_id: teamId,
        bot_id: appUserId,
        private_metadata: '',
        blocks: [],
        callback_id: '',
        clear_on_close: false,
        notify_on_close: false
    };
}

export async function handleViewSubmitEvent(context: UIKitViewSubmitInteractionContext, app: SlackCompatibleApp, persis: IPersistence, modify: IModify): Promise<IUIKitResponse> {
    const { user, view, triggerId, appId, room } = context.getInteractionData();

    if (!triggerId) return context.getInteractionResponder().successResponse();

    const { responseUrl, tokenContext } = await generateResponseUrl({
        action: OriginalActionType.VIEW_SUBMISSION,
        room: room,
        user: user,
    }, app);

    await persistResponseToken(tokenContext, persis);

    const team = await getTeamFields(app.getAccessors().reader);
    const appUser = await app.getAccessors().reader.getUserReader().getAppUser(app.getID());

    if (!appUser) {
        app.getLogger().error(['Failed to obtain app user']);
        return context.getInteractionResponder().successResponse();
    }

    const payload: IBlockKitViewSubmissionPayload = {
        api_app_id: appId,
        trigger_id: generateCompatibleTriggerId(triggerId, user),
        token: tokenContext.token,
        type: BlockKitEventType.VIEW_SUBMISSION,
        team,
        user: await getUserFields(user, app.getAccessors().reader),
        view: {
            ...getBlockKitViewSkeleton(appId, team.id, appUser.id),
            ...convertViewToBlockKit(view),
        },
        hash: generateRandomHash(),
        response_urls: [responseUrl],
    };

    const response = await app.sendInteraction(payload);

    await handleViewEventResponse(response, triggerId, { app, modify, persis });

    return context.getInteractionResponder().successResponse();
}

expo
