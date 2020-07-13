import { IUIKitResponse, UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IPersistence, IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { SlackCompatibleApp } from '../../../SlackCompatibleApp';
import { BlockKitTextObject, BlockKitEventType, IBlockKitBlockActionsEventPayload, BlockKitBlockActionContainerType } from '../../customTypes/slack';
import { getTeamFields, getUserFields, generateResponseUrl, getChannelFields } from '../slackCommonFields';
import { OriginalActionType, persistResponseToken } from '../ResponseTokens';
import { generateCompatibleTriggerId } from '../../helpers';
import { UIKitIncomingInteractionContainerType } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionContainer';
import { convertMessageToSlack } from '../../converters/message';

export async function handleBlockActionEvent(context: UIKitBlockInteractionContext, app: SlackCompatibleApp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
    const incomingInteraction = context.getInteractionData();

    const extraFields = {};
    const container = {
        type: BlockKitBlockActionContainerType.MESSAGE,
    };

    if (incomingInteraction.container.type === UIKitIncomingInteractionContainerType.MESSAGE) {
        Object.assign(container, {
            type: BlockKitBlockActionContainerType.MESSAGE,
            message_ts: incomingInteraction.container.id,
            channel_id: incomingInteraction.message.room.id,
            is_ephemeral: false,
        });

        const { responseUrl, tokenContext } = await generateResponseUrl({
            action: OriginalActionType.BLOCK_ACTION,
            room: incomingInteraction.room,
            user: incomingInteraction.user,
        }, app);

        await persistResponseToken(tokenContext, persistence);

        Object.assign(extraFields, {
            message: convertMessageToSlack(incomingInteraction.message),
            channel: await getChannelFields(incomingInteraction.room),
            response_url: responseUrl,
        });
    } else if (incomingInteraction.container.type === UIKitIncomingInteractionContainerType.VIEW) {
        Object.assign(container, {
            type: BlockKitBlockActionContainerType.VIEW,
            view_id: incomingInteraction.container.id,
        });

        // @TODO d-gubert fetch the view persisted by `views.open` endpoint
        Object.assign(extraFields, {
            view: {},
        })
    }

    const eventPayload: IBlockKitBlockActionsEventPayload = {
        container,
        type: BlockKitEventType.BLOCK_ACTIONS,
        team: await getTeamFields(app.getAccessors().reader),
        user: await getUserFields(incomingInteraction.user, app.getAccessors().reader),
        api_app_id: incomingInteraction.appId,
        trigger_id: generateCompatibleTriggerId(incomingInteraction.triggerId, incomingInteraction.user),
        ...extraFields,
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
