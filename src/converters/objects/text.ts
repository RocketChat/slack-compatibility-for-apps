import {
    ITextObject as UIKitTextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    PlainTextElement as BlockKitPlainText,
    MrkdwnElement as BlockKitMrkdwnText,
} from '../../../vendor/slack-types';

/**
 * Converts a Block Kit text object to UIKit
 *
 * @param originalObject PlainTextElement | MrkdwnElement
 * @returns ITextObject
 */
export function convertToUIKit(originalObject: BlockKitPlainText | BlockKitMrkdwnText): UIKitTextObject {
    const text: any = {
        ...originalObject,
    };

    if (originalObject.type === 'plain_text') {
        text.type = TextObjectType.PLAINTEXT;
    } else if(originalObject.type === 'mrkdwn') {
        text.type = TextObjectType.MARKDOWN;

        if (text.verbatim) {
            delete text.verbatim;
        }
    }

    return text as UIKitTextObject;
}

/**
 * Converts a UIKit text object to Block Kit
 *
 * @param originalObject ITextObject
 * @returns PlainTextElement | MrkdwnElement
 */
export function convertToBlockKit(originalObject: UIKitTextObject): BlockKitPlainText | BlockKitMrkdwnText {
    const text = {
        ...originalObject
    };

    if (text.type === TextObjectType.PLAINTEXT) {
        return text as BlockKitPlainText;
    } else {
        if (text.emoji) {
            delete text.emoji;
        }
        return text as BlockKitMrkdwnText;
    }
}
