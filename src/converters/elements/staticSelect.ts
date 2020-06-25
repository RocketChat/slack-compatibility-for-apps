import {
    IStaticSelectElement as UIKitStaticSelect,
    BlockElementType,
    ITextObject,
    IOptionObject as UIKitOptionObject,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    StaticSelect as BlockKitStaticSelect,
    Option as BlockKitOptionObject,
    PlainTextElement,
} from '../../../vendor/slack-types';
import {
    convertToUIKit as convertTextElementToUIKit,
    convertToBlockKit as convertTextElementToBlockKit,
} from '../objects/text';
import {
    convertToUIKit as convertOptionToUIKit,
    convertToBlockKit as convertOptionToBlockKit,
} from '../objects/option';

/**
 * Converts a Block Kit static select element to UIKit
 *
 * @param originalElement StaticSelect
 * @returns IStaticSelectElement
 */
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

/**
 * Converts a UIKit static select element to Block Kit
 *
 * @param originalElement IStaticSelectElement
 * @returns StaticSelect
 */
export function convertToBlockKit(originalElement: UIKitStaticSelect): BlockKitStaticSelect {
    const select: any = {
        action_id: originalElement.actionId,
        type: 'static_select',
        placeholder: convertTextElementToBlockKit(originalElement.placeholder as ITextObject),
    };

    if (originalElement.initialValue) {
        const initialValue = originalElement.initialValue;
        select.initial_option = originalElement.options
        .filter(option => option.value === initialValue)
        .reduce((acc, curr) => ({ ...acc, ...curr }) ,{});
    }

    select.options = originalElement.options
    .map(option => convertOptionToBlockKit(option as UIKitOptionObject));

    return select as BlockKitStaticSelect;
}
