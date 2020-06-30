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
    IBlockElement as UIKitBlockElement,
    IButtonElement,
    IImageElement,
    IMultiStaticSelectElement,
    IOverflowMenuElement,
    IPlainTextInputElement,
    IStaticSelectElement,
} from '@rocket.chat/apps-engine/definition/uikit';
import { BlockKitAccessoryElements as BlockKitBlockElement } from '../../customTypes/slack';

/**
 * Converts a single Block Kit element to UIKit
 *
 * @param elements BlockKitAccessoryElements
 * @returns IBlockElement
 */
export function convertToUIKit(element: BlockKitBlockElement): UIKitBlockElement {
    switch (element.type) {
        case BlockElementType.IMAGE:
            return convertImageToUIKit(element as ImageElement);
        case BlockElementType.BUTTON:
            return convertButtonToUIKit(element as Button);
        case BlockElementType.PLAIN_TEXT_INPUT:
            return convertPlainTextInputToUIKit(element as PlainTextInput) ;
        case BlockElementType.OVERFLOW_MENU:
            return convertOverflowMenuToUIKit(element as Overflow);
        case BlockElementType.STATIC_SELECT:
            return convertStaticSelectToUIKit(element as StaticSelect);
        case BlockElementType.MULTI_STATIC_SELECT:
            return convertMultiStaticSelectToUIKit(element as MultiStaticSelect);
        default:
            console.warn(`The Block Element of type ${element.type} could not be converted to UIKit`);
            return {} as UIKitBlockElement;
    }
}

/**
 * Converts a single UIKit element to Block Kit
 *
 * @param elements IBlockElement
 * @returns BlockKitAccessoryElements
 */
export function convertToBlockKit(element: UIKitBlockElement): BlockKitBlockElement {
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
            console.warn(`The Block Element of type ${element.type} could not be converted to Block Kit`);
            return {} as BlockKitBlockElement;
    }
}
