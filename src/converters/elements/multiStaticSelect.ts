import {
    IMultiStaticSelectElement as UIKitMultiStaticSelect,
    BlockElementType,
    ITextObject,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    MultiStaticSelect as BlockKitMultiStaticSelect,
    Option as BlockKitOptionObject,
    PlainTextElement,
} from '../../../vendor/slack-types';
import {
    convertToUIKit as convertTextElementToUIKit,
    convertToBlockKit as convertTextElementToBlockKit,
} from '../objects/text';
import { convertToUIKit as convertOptionToUIKit } from '../objects/option';

/**
 * Converts a Block Kit multi static select element to UIKit
 *
 * @param originalElement MultiStaticSelect
 * @returns IMultiStaticSelectElement
 */
export function convertToUIKit(originalElement: BlockKitMultiStaticSelect): UIKitMultiStaticSelect {
    const select: any = {
        actionId: originalElement.action_id,
        type: BlockElementType.MULTI_STATIC_SELECT,
        placeholder: convertTextElementToUIKit(originalElement.placeholder as PlainTextElement),
    };

    if (originalElement.initial_options) {
        select.initialValue = originalElement.initial_options.map(opt => opt.value);
    }

    if (originalElement.options) {
        select.options = originalElement.options
        .map(option => convertOptionToUIKit(option as BlockKitOptionObject));
    }

    return select as UIKitMultiStaticSelect;
}

/**
 * Converts a UIKit multi static select element to Block Kit
 *
 * @param originalElement IMultiStaticSelectElement
 * @returns MultiStaticSelect
 */
export function convertToBlockKit(originalElement: UIKitMultiStaticSelect ): BlockKitMultiStaticSelect {
    const select: any = {
        action_id: originalElement.actionId,
        type: 'multi_static_select',
        placeholder: convertTextElementToBlockKit(originalElement.placeholder as ITextObject),
        options: originalElement.options.map(option => convertOptionToUIKit(option as BlockKitOptionObject)),
    };

    if (originalElement.initialValue) {
        select.initial_options = originalElement.initialValue
        .map(iniOption => originalElement.options
             .filter(option => option.value === iniOption)
             .reduce((acc, curr) => ({...acc, ...curr}), {})
            );
    }

    return select as BlockKitMultiStaticSelect;
}
