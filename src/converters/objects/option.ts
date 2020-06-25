import {
    Option as BlockKitOptionObject,
} from '../../../vendor/slack-types';
import {
    IOptionObject as UIKitOptionObject,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    convertToUIKit as convertTextToUIKit,
} from './text';

export function convertToUIKit(originalElement: BlockKitOptionObject): UIKitOptionObject {
    const option: any = {
        ...originalElement,
        text: convertTextToUIKit(originalElement.text),
    };

    if (option.description) {
        delete option.description;
    }

    if (option.url) {
        delete option.url;
    }

    return option as UIKitOptionObject;
}
