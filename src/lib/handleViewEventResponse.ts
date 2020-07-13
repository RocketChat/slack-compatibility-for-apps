import { IHttpResponse } from "@rocket.chat/apps-engine/definition/accessors";
import { BlockKitViewResponseAction, IBlockKitViewEventResponsePayload } from "../customTypes/slack";

export async function handleViewEventResponse(res: IHttpResponse): Promise<void> {
    // Close the current view
    if (res.statusCode === 200 && !res.data) return;

    const { response_action, errors } = res.data as IBlockKitViewEventResponsePayload;

    if (!response_action) return;

    switch (response_action) {
        case BlockKitViewResponseAction.UPDATE:
            // todo (shiqi.mei): wait for @thassio.carvalho's work
            break;
        case BlockKitViewResponseAction.ERRORS:
            throw errors;
        case BlockKitViewResponseAction.PUSH:
            // RocketChat doesn't support this feature yet, ignored.
            return;
        case BlockKitViewResponseAction.CLEAR:
            // Same as closing the current view
            return;
    }
}
