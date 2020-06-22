import {
    ITextObject as UIKitTextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    PlainTextElement as BlockKitPlainText,
    MrkdwnElement as BlockKitMrkdwnText,
} from '../../../vendor/slack-types';
import { ElementConverter } from '../ElementConverter';

type ConversionTextObject = UIKitTextObject | BlockKitPlainText | BlockKitMrkdwnText;

export class TextObjectConverter extends ElementConverter<ConversionTextObject> {
    constructor(text: ConversionTextObject) {
        super(text);
    }

    public convertToUIKit(): UIKitTextObject {
        let text: any = {};

        if (this.element.type === 'plain_text') {
            text = {
                ...this.element,
                type: TextObjectType.PLAINTEXT,
            };
        } else if(this.element.type === 'mrkdwn') {
            text = {
                ...this.element,
                type: TextObjectType.MARKDOWN,
            };

            if (text.verbatim) {
                delete text.verbatim;
            }
        }

        return text as UIKitTextObject;
    }

    public convertToBlockKit(): ConversionTextObject {
        let text: any = {};

        text = { ...this.element };

        if (text.type === 'mrkdwn' && text.emoji) {
            delete text.emoji;
        }

        return text as ConversionTextObject;
    }

}
