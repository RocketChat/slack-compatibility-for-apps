import { IUIKitResponse, UIKitBlockInteractionContext, IBlock, BlockType, IActionsBlock, IInteractiveElement, BlockElementType, IButtonElement, IOverflowMenuElement, ISectionBlock } from '@rocket.chat/apps-engine/definition/uikit';
import { IPersistence, IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IUIKitBlockIncomingInteraction } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes';
import { SlackCompatibleApp } from '../../../SlackCompatibleApp';
import { BlockKitEventType, IBlockKitBlockActionsEventPayload, BlockKitBlockActionContainerType, IBlockKitBlockAction } from '../../customTypes/slack';
import { getTeamFields, getUserFields, generateResponseUrl, getChannelFields } from '../slackCommonFields';
import { OriginalActionType, persistResponseToken } from '../../storage/ResponseTokens';
import { generateCompatibleTriggerId, isInteractiveElement } from '../../helpers';
import { UIKitIncomingInteractionContainerType } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionContainer';
import { convertMessageToSlack } from '../../converters/message';
import { retrieveView } from '../../storage/PersistView';
import { convertToBlockKit as convertTextObjectToBlockKit } from "../../converters/objects/text";
import { convertToBlockKit as convertOptionObjectToBlockKit } from "../../converters/objects/option";
import { convertBlocksToUIKit } from '../../converters/BlockKitToUIKit';
import { Omit } from '../../customTypes/util';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

type BlockActionPayloadExtraFields = Omit<IBlockKitBlockActionsEventPayload, 'type' | 'trigger_id' | 'container' | 'user' | 'team' | 'api_app_id' | 'actions'>;

export async function handleBlockActionEvent(context: UIKitBlockInteractionContext, app: SlackCompatibleApp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
    const incomingInteraction = context.getInteractionData();

    const extraFields: BlockActionPayloadExtraFields = {};
    const actionDescriptor = {
        type: '', // type of the element that received the interaction, extracted from the container
        block_id: incomingInteraction.blockId,
        value: incomingInteraction.value,
        action_id: incomingInteraction.actionId,
        action_ts: String((Date.now() / 1000)),
    };

    const container = {
        type: BlockKitBlockActionContainerType.MESSAGE,
    };

    if (incomingInteraction.container.type === UIKitIncomingInteractionContainerType.MESSAGE) {
        const room = incomingInteraction.room as IRoom;

        Object.assign(container, {
            type: BlockKitBlockActionContainerType.MESSAGE,
            message_ts: incomingInteraction.container.id,
            channel_id: room.id,
            is_ephemeral: !incomingInteraction.message,
        });

        const { responseUrl, tokenContext } = await generateResponseUrl({
            action: OriginalActionType.BLOCK_ACTION,
            room: room,
            user: incomingInteraction.user,
        }, app);

        await persistResponseToken(tokenContext, persistence);

        Object.assign(extraFields, {
            channel: await getChannelFields(room),
            response_url: responseUrl,
        });

        if (incomingInteraction.message) {
            Object.assign(extraFields, {
                message: convertMessageToSlack(incomingInteraction.message),
            });

            Object.assign(actionDescriptor, parseAction(incomingInteraction.message.blocks as Array<IBlock>, incomingInteraction));
        } else {
            delete actionDescriptor.type;
        }

    } else if (incomingInteraction.container.type === UIKitIncomingInteractionContainerType.VIEW) {
        Object.assign(container, {
            type: BlockKitBlockActionContainerType.VIEW,
            view_id: incomingInteraction.container.id,
        });

        const view = await retrieveView(incomingInteraction.container.id, app.getAccessors().reader);

        if (!view) {
            throw new Error('Invalid view provided');
        }

        Object.assign(extraFields, { view });
        Object.assign(actionDescriptor, parseAction(convertBlocksToUIKit(view.blocks, app.getID()), incomingInteraction));
    }

    const eventPayload: IBlockKitBlockActionsEventPayload = {
        container,
        type: BlockKitEventType.BLOCK_ACTIONS,
        team: await getTeamFields(app.getAccessors().reader),
        user: await getUserFields(incomingInteraction.user, app.getAccessors().reader),
        api_app_id: incomingInteraction.appId,
        trigger_id: generateCompatibleTriggerId(incomingInteraction.triggerId, incomingInteraction.user),
        ...extraFields,
        actions: [actionDescriptor],
    };

    await app.sendInteraction(eventPayload);

    return context.getInteractionResponder().successResponse();
}

export function parseAction(blocks: Array<IBlock>, incomingInteraction: IUIKitBlockIncomingInteraction): Partial<IBlockKitBlockAction> {
    const block = blocks.find(block => block.blockId === incomingInteraction.blockId);

    if (!block) {
        throw new Error('Invalid block provided');
    }

    const element = (() => {
        switch (block.type) {
            case BlockType.ACTIONS: {
                return (block as IActionsBlock).elements.find(
                    (element) => isInteractiveElement(element) && element.actionId === incomingInteraction.actionId
                );
            }

            case BlockType.SECTION: {
                return (block as ISectionBlock).accessory;
            }

            default:
                return undefined;
        }
    })();

    if (!isInteractiveElement(element)) {
        throw new Error('Invalid action provided');
    }

    return extractActionDataFromElement(element, incomingInteraction);
}

export function extractActionDataFromElement(element: IInteractiveElement, incomingInteraction: IUIKitBlockIncomingInteraction): Partial<IBlockKitBlockAction> {
    switch (element.type) {
        case BlockElementType.BUTTON:
            const button = element as IButtonElement;
            return {
                type: button.type,
                text: convertTextObjectToBlockKit(button.text),
                value: button.value,
            };

        case BlockElementType.OVERFLOW_MENU:
            const menu = element as IOverflowMenuElement;
            const option = menu.options.find(option => option.value === incomingInteraction.value);

            if (!option) {
                throw new Error('Invalid interaction');
            }

            return {
                type: menu.type,
                selectedOption: convertOptionObjectToBlockKit(option),
            };

        default:
            return {};
    }
}
