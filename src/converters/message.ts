import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { ISlackMessage } from '../customTypes/slack';
import { convertBlocksToBlockKit } from './UIKitToBlockKit';

export function convertMessageToSlack(message: IMessage): ISlackMessage {
    return {
        ts: message.id,
        blocks: convertBlocksToBlockKit(message.blocks),
        text: message.text,
        type: 'message',
        user: message.sender.id,
        bot_id: '', // we don't have this information
        team: '', // we don't have this information
    }
}
