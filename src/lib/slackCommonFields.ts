import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { OriginalActionType, IResponseTokenContext } from '../storage/ResponseTokens';
import { RESPONSE_URL_EXPIRATION_TIME, RESPONSE_URL_ENDPOINT_BASE_PATH } from './constants';
import { generateToken, calculateExpiryDate } from '../helpers';
import { SlackCompatibleApp } from '../../SlackCompatibleApp';
import { ISlackTeam, ISlackChannel, ISlackUser } from '../customTypes/slack';

export const getTeamFields = async (read: IRead): Promise<ISlackTeam> => ({
    id: await read.getEnvironmentReader().getServerSettings().getValueById('uniqueID'),
    domain: await read.getEnvironmentReader().getServerSettings().getValueById('Site_Url'),
});

export const getChannelFields = async (room: IRoom): Promise<ISlackChannel> => ({
    channel_id: room.id,
    channel_name: room.slugifiedName,
});

export const getUserFields = async (user: IUser, read: IRead): Promise<ISlackUser> => ({
    id: user.id,
    name: user.name,
    username: user.username,
    team_id: await read.getEnvironmentReader().getServerSettings().getValueById('uniqueID'),
});

export interface IGenerateResponseUrlParams {
    user: IUser;
    room?: IRoom;
    action: OriginalActionType;
    text?: string;
}

export async function generateResponseUrl(
    {
        action,
        room,
        user,
        text,
    }: IGenerateResponseUrlParams,
    app: SlackCompatibleApp):
    Promise<{ responseUrl: string, tokenContext: IResponseTokenContext, }>
{
    const tokenContext: IResponseTokenContext = {
        token: generateToken(),
        recipient: user && user.id,
        originalAction: action,
        originalText: text,
        expiresAt: calculateExpiryDate(new Date(), RESPONSE_URL_EXPIRATION_TIME),
        usageCount: 0,
    };

    if (room) {
        tokenContext.room = room.id;
    }

    const siteUrl = await app.getAccessors().environmentReader.getServerSettings().getValueById('Site_Url');
    const apiRoute = app.getAccessors().providedApiEndpoints.find(metadata => metadata.path.indexOf(RESPONSE_URL_ENDPOINT_BASE_PATH) !== -1);

    if (!siteUrl || !apiRoute) {
        throw new Error('Configuration error');
    }

    return {
        tokenContext,
        responseUrl: siteUrl + apiRoute.computedPath.replace(':token', tokenContext.token),
    }
}
