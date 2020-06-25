import {
    Option as BlockKitOptionObject,
} from '../../../vendor/slack-types';
import {
    IOptionObject as UIKitOptionObject,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    convertToUIKit as convertTextToUIKit,
    convertToBlockKit as convertTextToBlockKit,
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

export function convertToBlockKit(originalElement: UIKitOptionObject): BlockKitOptionObject {
    const option: any = {
        ...originalElement,
        text: convertTextToBlockKit(originalElement.text),
    };

    if (option.description) {
        delete option.description;
    }

    if (option.url) {
        delete option.url;
    }

    return option as BlockKitOptionObject;
}
