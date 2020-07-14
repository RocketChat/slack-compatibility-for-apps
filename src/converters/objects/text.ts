import {
    ITextObject as UIKitTextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';
import { BlockKitTextObject } from '../../customTypes/slack';

/**
 * Converts a Block Kit text object to UIKit
 *
 * @param originalObject PlainTextElement | MrkdwnElement
 * @returns ITextObject
 */
export function convertToUIKit(originalObject: BlockKitTextObject): UIKitTextObject {
    const text: any = {
        ...originalObject,
    };

    if (originalObject.type === 'plain_text') {
        text.type = TextObjectType.PLAINTEXT;
    } else if(originalObject.type === 'mrkdwn') {
        text.type = TextObjectType.MARKDOWN;
        delete text.verbatim;
    }

    return text as UIKitTextObject;
}

/**
 * Converts a UIKit text object to Block Kit
 *
 * @param originalObject ITextObject
 * @returns PlainTextElement | MrkdwnElement
 */
export function convertToBlockKit(originalObject: UIKitTextObject): BlockKitTextObject {
    const text = {
        ...originalObject
    };

    if (text.type !== TextObjectType.PLAINTEXT) {
        delete text.emoji;
    }

    return text as BlockKitTextObject;
}
