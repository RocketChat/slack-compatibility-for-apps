import { IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IUIKitView } from '@rocket.chat/apps-engine/definition/uikit';

export async function PersistView(view: IUIKitView, persis: IPersistence): Promise<void> {
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, view.id);
    await persis.createWithAssociation({ view }, association);
}
