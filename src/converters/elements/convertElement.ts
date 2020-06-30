import {
    convertToUIKit as convertButtonToUIKit,
    convertToBlockKit as convertButtonToBlockKit,
} from './button';
import {
    convertToUIKit as convertImageToUIKit,
    convertToBlockKit as convertImageToBlockKit,
} from './image';
import {
    convertToUIKit as convertPlainTextInputToUIKit,
    convertToBlockKit as convertPlainTextInputToBlockKit,
} from './plainTextInput';
import {
    convertToUIKit as convertOverflowMenuToUIKit,
    convertToBlockKit as convertOverflowMenuToBlockKit,
} from './overflowMenu';
import {
    convertToUIKit as convertStaticSelectToUIKit,
    convertToBlockKit as convertStaticSelectToBlockKit,
} from './staticSelect';
import {
    convertToUIKit as convertMultiStaticSelectToUIKit,
    convertToBlockKit as convertMultiStaticSelectToBlockKit,
} from './multiStaticSelect';
import {
    Button,
    ImageElement,
    MultiStaticSelect,
    Overflow,
    StaticSelect,
    PlainTextInput,
} from '../../../vendor/slack-types';
import {
    BlockElementType,
    IBlockElement,
    IButtonElement,
    IImageElement,
    IMultiStaticSelectElement,
    IOverflowMenuElement,
    IStaticSelectElement,
    IPlainTextInputElement,
} from '@rocket.chat/apps-engine/definition/uikit';
import { BlockKitAccessoryElements } from '../../customTypes/slack';

export function convertToUIKit(element: BlockKitAccessoryElements): object {
    switch (element.type) {
        case 'button':
            return convertButtonToUIKit(element as Button);
        case 'image':
            return convertImageToUIKit(element as ImageElement);
        case 'plain_text_input':
            return convertPlainTextInputToUIKit(element as PlainTextInput) ;
        case 'overflow':
            return convertOverflowMenuToUIKit(element as Overflow);
        case 'static_select':
            return convertStaticSelectToUIKit(element as StaticSelect);
        case 'multi_static_select':
            return convertMultiStaticSelectToUIKit(element as MultiStaticSelect);
        default:
            return element;
    }
}

export function convertToBlockKit(element: IBlockElement): object {
    switch (element.type) {
        case BlockElementType.IMAGE:
            return convertImageToBlockKit(element as IImageElement);
        case BlockElementType.BUTTON:
            return convertButtonToBlockKit(element as IButtonElement);
        case BlockElementType.PLAIN_TEXT_INPUT:
            return convertPlainTextInputToBlockKit(element as IPlainTextInputElement);
        case BlockElementType.OVERFLOW_MENU:
            return convertOverflowMenuToBlockKit(element as IOverflowMenuElement);
        case BlockElementType.STATIC_SELECT:
            return convertStaticSelectToBlockKit(element as IStaticSelectElement);
        case BlockElementType.MULTI_STATIC_SELECT:
            return convertMultiStaticSelectToBlockKit(element as IMultiStaticSelectElement);
        default:
            return element;
    }
}
