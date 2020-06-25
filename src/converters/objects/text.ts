import {
    ITextObject as UIKitTextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    PlainTextElement as BlockKitPlainText,
    MrkdwnElement as BlockKitMrkdwnText,
} from '../../../vendor/slack-types';

export function convertToUIKit(originalObject: BlockKitPlainText | BlockKitMrkdwnText): UIKitTextObject {
    let text: any = {};

    if (originalObject.type === 'plain_text') {
        text = {
            ...originalObject,
            type: TextObjectType.PLAINTEXT,
        };
    } else if(originalObject.type === 'mrkdwn') {
        text = {
            ...originalObject,
            type: TextObjectType.MARKDOWN,
        };

        if (text.verbatim) {
            delete text.verbatim;
        }
    }

    return text as UIKitTextObject;
}

export function convertToBlockKit(originalObject: UIKitTextObject): BlockKitPlainText | BlockKitMrkdwnText {
    const text = { ...originalObject };

    if (text.type === TextObjectType.PLAINTEXT) {
        return text as BlockKitPlainText;
    } else {
        if (text.emoji) {
            delete text.emoji;
        }
        return text as BlockKitMrkdwnText;
    }
}
