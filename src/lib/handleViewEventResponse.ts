import { IHttpResponse, IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { BlockType, IInputBlock, IUIKitResponse, IUIKitView } from '@rocket.chat/apps-engine/definition/uikit';
import { UIKitInteractionResponder } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';

import { convertViewToUIKit } from '../converters/BlockKitToUIKit';
import { BlockKitViewResponseAction, IBlockKitViewEventResponsePayload } from '../customTypes/slack';

export async function handleViewEventResponse(
    uikitView: IUIKitView, res: IHttpResponse, responder: UIKitInteractionResponder,
    accessors: { app: IApp, modify: IModify, persis: IPersistence }, triggerId?: string,
): Promise<IUIKitResponse> {
    // Close the current view
    if (res.statusCode === 200 && !res.data) return responder.successResponse();

    const { response_action, errors, view } = res.data as IBlockKitViewEventResponsePayload;

    if (!response_action) return responder.successResponse();

    switch (response_action) {
        case BlockKitViewResponseAction.UPDATE:
            if (!view || !view.id) return responder.successResponse();

            return responder.updateModalViewResponse(convertViewToUIKit(view, accessors.app.getID()));
        case BlockKitViewResponseAction.ERRORS:
            if (!uikitView || !uikitView.id || !errors) return responder.successResponse();

            const blocks = uikitView.blocks.filter(({ type }) => type === BlockType.INPUT) as Array<IInputBlock>;

            return responder.viewErrorResponse({ viewId: uikitView.id, errors: convertBlockKitErrorsToUIKit(errors, blocks) });
        case BlockKitViewResponseAction.PUSH:
            if (!view) return responder.successResponse();

            return responder.openModalViewResponse(convertViewToUIKit(view, accessors.app.getID()));
        case BlockKitViewResponseAction.CLEAR:
            // Same as closing the current view
            return responder.successResponse();
    }
}

/**
 * @note
 * BlockKit errors format is {
 *     [block_id: string]: string;
 * }
 * UIKit errors format is {
 *     [actionId: string]: string
 * }
 */
function convertBlockKitErrorsToUIKit(errors: { [block_id: string]: string }, blocks: Array<IInputBlock>): { [actionId: string]: string } {
    return Object.entries(errors)
        .map(([block_id, value]) => {
            const block = blocks.find(({ blockId }) => blockId === block_id);

            if (!block) return { [block_id]: value };

            return { [block.element.actionId]: value };
        })
        .reduce((acc, cur) => Object.assign(acc, cur), {});
}
