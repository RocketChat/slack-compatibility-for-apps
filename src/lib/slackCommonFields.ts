import { IRead, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { OriginalActionType, IResponseTokenContext, persistResponseToken } from "./ResponseTokens";
import { RESPONSE_URL_EXPIRATION_TIME, RESPONSE_URL_ENDPOINT_BASE_PATH } from "./constants";
import { generateToken, calculateExpiryDate } from "../helpers";
import { SlackCompatibleApp } from "../../SlackCompatibleApp";

export const getTeamFields = async (read: IRead) => ({
    team_id: await read.getEnvironmentReader().getServerSettings().getValueById('uniqueID'),
    team_domain: await read.getEnvironmentReader().getServerSettings().getValueById('Site_Url'),
});

export const getChannelFields = (room: IRoom) => ({
    channel_id: room.id,
    channel_name: room.slugifiedName,
});

export const getUserFields = (user: IUser) => ({
    user_id: user.id,
    user_name: user.name,
});

export interface IGenerateResponseUrlParams {
    user: IUser;
    room: IRoom;
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
    read: IRead,
    app: SlackCompatibleApp):
    Promise<{ responseUrl: string, tokenContext: IResponseTokenContext, }>
{
    const tokenContext: IResponseTokenContext = {
        token: generateToken(),
        room: room.id,
        recipient: user.id,
        originalAction: action,
        originalText: text,
        expiresAt: calculateExpiryDate(new Date(), RESPONSE_URL_EXPIRATION_TIME),
        usageCount: 0,
    };

    const siteUrl = await read.getEnvironmentReader().getServerSettings().getValueById('Site_Url');
    const apiRoute = app.getAccessors().providedApiEndpoints.find(metadata => metadata.path.indexOf(RESPONSE_URL_ENDPOINT_BASE_PATH));

    return {
        tokenContext,
        responseUrl: siteUrl + apiRoute.computedPath.replace(':token', tokenContext.token),
    }
}
