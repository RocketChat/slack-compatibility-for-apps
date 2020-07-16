import { IHttpResponse, IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';

import { BlockKitViewResponseAction, IBlockKitViewEventResponsePayload } from '../customTypes/slack';
import { ViewsOpen } from '../endpoints/ViewsOpen';
import { ViewsUpdate } from '../endpoints/ViewsUpdate';

export async function handleViewEventResponse(
    res: IHttpResponse, triggerId: string, accessors: { app: IApp, modify: IModify, persis: IPersistence }
): Promise<void> {
    // Close the current view
    if (res.statusCode === 200 && !res.data) return;

    const { response_action, errors, view } = res.data as IBlockKitViewEventResponsePayload;

    if (!response_action) return;

    switch (response_action) {
        case BlockKitViewResponseAction.UPDATE:
            if (!view) return;

            try {
                await ViewsUpdate.executeViewUpdate(view, triggerId, accessors);
            } catch (err) {
                console.warn(err);
            }
            return;
        case BlockKitViewResponseAction.ERRORS:
            throw errors;
        case BlockKitViewResponseAction.PUSH:
            if (!view) return;

            try {
                await ViewsOpen.executeViewOpen(view, triggerId, accessors);
            } catch (err) {
                console.warn(err);
            }
            return;
        case BlockKitViewResponseAction.CLEAR:
            // Same as closing the current view
            return;
    }
}
