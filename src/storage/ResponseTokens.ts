import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { RocketChatAssociationRecord, RocketChatAssociationModel } from "@rocket.chat/apps-engine/definition/metadata";

export enum OriginalActionType {
    COMMAND = 'command',
    BLOCK_ACTION = 'block_action',
    VIEW_SUBMISSION = 'view_submission',
    VIEW_CLOSED = 'view_closed'
}

export interface IResponseTokenContext {
    token: string;
    recipient: IUser['id'];
    room?: IRoom['id'];
    originalAction: OriginalActionType;
    originalText?: string;
    expiresAt: Date;
    usageCount: number;
}

function createTokenAssociation(token: string): Array<RocketChatAssociationRecord> {
    return [
        new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, token),
        new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'responseToken'),
    ];
}

export function persistResponseToken(context: IResponseTokenContext, persistence: IPersistence): Promise<string> {
    return persistence.updateByAssociations(createTokenAssociation(context.token), context, true);
}

export async function retrieveResponseToken(token: string, read: IRead): Promise<IResponseTokenContext | undefined> {
    return read.getPersistenceReader().readByAssociations(createTokenAssociation(token)).then(([result]: Array<IResponseTokenContext>) => result);
}
