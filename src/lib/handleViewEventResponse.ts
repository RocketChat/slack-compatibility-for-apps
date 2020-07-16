import { IHttpResponse, IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { IUIKitResponse } from '@rocket.chat/apps-engine/definition/uikit';
import { UIKitInteractionResponder } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';

import { convertViewToUIKit } from '../converters/BlockKitToUIKit';
import { BlockKitViewResponseAction, IBlockKitViewEventResponsePayload } from '../customTypes/slack';

export async function handleViewEventResponse(
    res: IHttpResponse, responder: UIKitInteractionResponder, accessors: { app: IApp, modify: IModify, persis: IPersistence }, triggerId?: string,
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
            if (!view || !view.id || !errors) return responder.successResponse();

            return responder.viewErrorResponse({ viewId: view.id, errors });
        case BlockKitViewResponseAction.PUSH:
            if (!view) return responder.successResponse();

            return responder.openModalViewResponse(convertViewToUIKit(view, accessors.app.getID()));
        case BlockKitViewResponseAction.CLEAR:
            // Same as closing the current view
            return responder.successResponse();
    }
}
