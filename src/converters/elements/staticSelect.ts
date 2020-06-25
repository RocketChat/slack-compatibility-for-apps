import {
    IStaticSelectElement as UIKitStaticSelect,
    BlockElementType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    StaticSelect as BlockKitStaticSelect,
    Option as BlockKitOptionObject,
    PlainTextElement,
} from '../../../vendor/slack-types';
import {
    convertToUIKit as convertTextElementToUIKit
} from '../objects/text';
import { convertToUIKit as convertOptionToUIKit } from '../objects/option';

export function convertToUIKit(originalElement: BlockKitStaticSelect): UIKitStaticSelect {
    const select: any = {
        actionId: originalElement.action_id,
        type: BlockElementType.STATIC_SELECT,
        placeholder: convertTextElementToUIKit(originalElement.placeholder as PlainTextElement),
    };

    if (originalElement.initial_option) {
       select.initialValue = originalElement.initial_option.value;
    }

    if (originalElement.options) {
        select.options = originalElement.options
        .map(option => convertOptionToUIKit(option as BlockKitOptionObject));
    }

    return select as UIKitStaticSelect;
}
