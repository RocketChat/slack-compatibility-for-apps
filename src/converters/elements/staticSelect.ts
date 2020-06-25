import {
    IStaticSelectElement as UIKitStaticSelect,
    IOptionObject as UIKitOptionObject,
    BlockElementType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    StaticSelect as BlockKitStaticSelect,
    Option as BlockKitOptionObject,
} from '../../../vendor/slack-types';
import {
    convertToUIKit as convertTextElementToUIKit
} from '../objects/text';
import { convertToUIKit as convertOptionToUIKit } from '../objects/option';

export function convertToUIKit(originalElement: BlockKitStaticSelect): UIKitStaticSelect {
    const select: any = {
        actionId: originalElement.action_id,
        type: BlockElementType.STATIC_SELECT,
        placeholder: convertTextElementToUIKit(originalElement.placeholder),
        initialValue: originalElement.initial_option.value,
    };

    const options: UIKitOptionObject[] = [];


    for (const option of originalElement.options) {
        options.push(convertOptionToUIKit(option as BlockKitOptionObject));
    }

    select.options = options;

    return select as UIKitStaticSelect;
}

/*
 *export function convertToBlockKit(): BlockKitStaticSelect {
 *    // @TODO !!!!!!!!!!!
 *    const originalElement = <UIKitStaticSelect>originalElement;
 *    // @TODO !!!!!!!!!!!
 *
 *    let select: any = {
 *        action_id: originalElement.actionId,
 *        type: 'static_select',
 *    };
 *
 *    const options: BlockKitOptionObject[] = [];
 *
 *    for (let i = 0; i < originalElement.options.length; i++) {
 *        const current: UIKitOptionObject = originalElement.options[i] as UIKitOptionObject;
 *        // @NOTE  I don't like this `as any` business, but it works for now
 *        options.push(new OptionObjectConverter(current).convertToUIKit() as any);
 *    }
 *
 *    select.options = options;
 *
 *    //const initial_option = select.options
 *    //.filter(option => option.value === originalElement.initialValue);
 *
 *    //select.initial_option = initial_option;
 *
 *    return select as BlockKitStaticSelect;
 *}
 */
