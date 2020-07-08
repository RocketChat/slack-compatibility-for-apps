import { IUIKitResponse, UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IPersistence, IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { SlackCompatibleApp } from '../../../SlackCompatibleApp';
import { BlockKitTextObject } from '../../customTypes/slack';
import { getTeamFields, getUserFields, generateResponseUrl } from '../slackCommonFields';
import { OriginalActionType, persistResponseToken } from '../ResponseTokens';
import { generateCompatibleTriggerId } from '../../helpers';

export enum InteractionType {
    BLOCK_ACTION = 'block_action',
    INTERACTIVE_MESSAGE = 'interactive_message',
}

export enum BlockActionContainerType {
    VIEW = 'view',
    MESSAGE = 'message',
}

export interface ISlackBlockActionPayload {
    type: InteractionType;
    trigger_id: string;
    response_url: string;
    container: {
        type: BlockActionContainerType;
        view_id?: string;
        message_ts?: string;
        channel_id?: string;
        is_ephemeral?: boolean;
    }
    user: {
        id: string;
        username: string;
        name: string;
    };
    team: {
        id: string;
        domain: string;
    };
    api_app_id: string; // undocumented, not sure what it does
    actions: Array<{
        type: string;
        block_id: string;
        action_id: string;
        text: BlockKitTextObject;
        value: string;
        action_ts: string;
    }>
}


export async function handleBlockActionEvent(context: UIKitBlockInteractionContext, app: SlackCompatibleApp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
    const incomingInteraction = context.getInteractionData();
    const { team_domain, team_id } = await getTeamFields(app.getAccessors().reader);
    const { user_id, user_name } = await getUserFields(incomingInteraction.user);
    const { responseUrl, tokenContext } = await generateResponseUrl({
        action: OriginalActionType.BLOCK_ACTION,
        room: incomingInteraction.room,
        user: incomingInteraction.user,
    }, app);

    await persistResponseToken(tokenContext, persistence);

    const eventPayload: ISlackBlockActionPayload = {
        type: InteractionType.BLOCK_ACTION,
        team: {
            id: team_id,
            domain: team_domain,
        },
        user: {
            id: user_id,
            name: user_name,
            username: '',
        },
        response_url: responseUrl,
        api_app_id: incomingInteraction.appId,
        trigger_id: generateCompatibleTriggerId(incomingInteraction.triggerId, incomingInteraction.user),
        actions: [
            {
                type: '', // we don't have this information
                block_id: '', // we don't have this information
                text: {} as BlockKitTextObject, // we don't have this information
                value: incomingInteraction.value,
                action_id: incomingInteraction.actionId,
                action_ts: String((Date.now() / 1000))
            }
        ]
    };

    await app.sendInteraction(eventPayload);

    return context.getInteractionResponder().successResponse();
}
