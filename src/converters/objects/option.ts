import {
    Option as BlockKitOptionObject,
} from '../../../vendor/slack-types';
import {
    IOptionObject as UIKitOptionObject,
} from '@rocket.chat/apps-engine/definition/uikit';
import { ElementConverter } from '../ElementConverter';
import { TextObjectConverter } from './text';


type ConversionOptionObject = UIKitOptionObject | BlockKitOptionObject;

export class OptionObjectConverter extends ElementConverter<ConversionOptionObject> {
    constructor(option: ConversionOptionObject) {
        super(option);
    }

    public convertToUIKit(): ConversionOptionObject {
        const option: any = {
            ...this.element,
            text: new TextObjectConverter(this.element.text).convertToUIKit(),
        };

        if (option.description) {
            delete option.description;
        }

        if (option.url) {
            delete option.url;
        }

        return option as UIKitOptionObject;
    }
}
