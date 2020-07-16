import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';

import { RESPONSE_URL_CALL_LIMIT_FOR_TOKEN, RESPONSE_URL_ENDPOINT_BASE_PATH } from '../lib/constants';
import { parseMessageResponsePayload } from '../lib/messageResponsePayloadParser';
import { handleSlashCommandResponsePayload } from '../lib/registerSlashCommands';
import { persistResponseToken, retrieveResponseToken } from '../storage/ResponseTokens';

export class ResponseUrlEndpoint extends ApiEndpoint implements IApiEndpoint {
    public path = `${RESPONSE_URL_ENDPOINT_BASE_PATH}/:token`;

    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const { token } = request.params;

        if (!token) {
            return this.json({ status: HttpStatusCode.BAD_REQUEST });
        }

        const tokenContext = await retrieveResponseToken(token, read);

        if (!tokenContext) {
            return this.json({ status: HttpStatusCode.BAD_REQUEST });
        }

        if (tokenContext.expiresAt < new Date()) {
            return this.json({ status: HttpStatusCode.BAD_REQUEST });
        }

        tokenContext.usageCount++;

        if (tokenContext.usageCount > RESPONSE_URL_CALL_LIMIT_FOR_TOKEN) {
            return this.json({ status: HttpStatusCode.BAD_REQUEST });
        }

        await persistResponseToken(tokenContext, persis);

        await handleSlashCommandResponsePayload(parseMessageResponsePayload(request.content, this.app.getID()), tokenContext, read, modify);

        return this.success();
    }
}
