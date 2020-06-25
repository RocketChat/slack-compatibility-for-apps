import {
    IMultiStaticSelectElement as UIKitMultiStaticSelect,
    BlockElementType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    MultiStaticSelect as BlockKitMultiStaticSelect,
    Option as BlockKitOptionObject,
    PlainTextElement,
} from '../../../vendor/slack-types';
import {
    convertToUIKit as convertTextElementToUIKit
} from '../objects/text';
import { convertToUIKit as convertOptionToUIKit } from '../objects/option';

export function convertToUIKit(originalElement: BlockKitMultiStaticSelect): UIKitMultiStaticSelect {
    let select: any = {
        actionId: originalElement.action_id,
        type: BlockElementType.MULTI_STATIC_SELECT,
        placeholder: convertTextElementToUIKit(originalElement.placeholder as PlainTextElement),
    };

    if (originalElement.initial_options) {
        // @TODO the data is set correctly, but I didn't get to make it render
        select.initialValue = originalElement.initial_options.map(opt => opt.value);
    }


    if (originalElement.options) {
        select.options = originalElement.options
        .map(option => convertOptionToUIKit(option as BlockKitOptionObject));
    }

    return select as UIKitMultiStaticSelect;
}
