import { IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IBlockKitView } from '../customTypes/slack';

export async function persistView(view: IBlockKitView, persis: IPersistence): Promise<string> {
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, view.id);
    return persis.createWithAssociation({ view }, association);
}

export async function retrieveView(viewId: IBlockKitView["id"], read: IRead): Promise<IBlockKitView | undefined> {
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, viewId);
    const [result] = await read.getPersistenceReader().readByAssociation(association);
    return result as IBlockKitView | undefined;
}

export async function deleteView(viewId: IBlockKitView["id"], persis: IPersistence): Promise<void> {
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, viewId);
    return persis.removeByAssociation(association).then(()=>{});
}
