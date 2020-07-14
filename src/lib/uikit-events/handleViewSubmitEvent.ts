import { IUIKitResponse, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IBlockKitViewSubmissionPayload, BlockKitEventType } from '../../customTypes/slack';
import { getTeamFields, getUserFields } from '../slackCommonFields';
import { convertViewToBlockKit } from '../../converters/UIKitToBlockKit';
import { generateRandomHash } from '../../helpers';
import { handleViewEventResponse } from '../handleViewEventResponse';
import { SlackCompatibleApp } from '../../../SlackCompatibleApp';

export async function handleViewSubmitEvent(context: UIKitViewSubmitInteractionContext, app: SlackCompatibleApp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
    const { user, view } = context.getInteractionData();
    const payload: IBlockKitViewSubmissionPayload = {
        type: BlockKitEventType.VIEW_SUBMISSION,
        team: await getTeamFields(app.getAccessors().reader),
        user: await getUserFields(user, app.getAccessors().reader),
        view: convertViewToBlockKit(view),
        hash: generateRandomHash(),
    };

    const response = await app.sendInteraction(payload);

    await handleViewEventResponse(response);

    return context.getInteractionResponder().successResponse();

}
