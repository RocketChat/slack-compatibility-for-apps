import { IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUIKitView } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IBlockKitView } from '../customTypes/slack';
import { convertViewToUIKit } from '../converters/BlockKitToUIKit';
import { uuid } from '../helpers';
import { persistView } from '../storage/PersistView';
import { parseCompatibleTriggerId } from '../helpers';

/**
 * Handles parsing of an incoming trigger_id
 *
 * @param trigger_id string The incoming triggerId in the format "triggerId.userId"
 * @param read IRead
 *
 * @returns Promise<[string, IUser]>
 */
export async function incomingTriggeridHandler(trigger_id: string, read: IRead): Promise<[string, IUser]> {
        if(!trigger_id) {
            throw new Error('No trigger_id provided');
        }

        const [triggerId, userId] = parseCompatibleTriggerId(trigger_id);

        if(!triggerId) {
            throw new Error('No triggerId provided');
        }

        if (!userId) {
            throw new Error('No userId provided');
        }

        const user = await read.getUserReader().getById(userId);

        return [triggerId, user];
}

/**
 * Handles parsing and storage of an incoming view
 *
 * @param view any The object that represents the view
 * @param appId string The uuid of the App
 * @param persis IPersistence
 *
 * @returns Promise<IUIKitView>
 */
export async function incomingViewHandler(view: any, appId: string, persis: IPersistence): Promise<IUIKitView> {
    const slackView = (() => {
        if (typeof view !== 'string') return view;

        try {
            return JSON.parse(view);
        } catch {
            return undefined;
        }
    })() as IBlockKitView | undefined;

    if (!slackView) {
        throw new Error('Invalid view definition');
    }

    // We need this to store the view
    if (!slackView.id) {
        slackView.id = uuid();
    }

    await persistView(slackView, persis);

    return convertViewToUIKit(slackView, appId);
}
