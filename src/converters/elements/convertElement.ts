import {
    convertToUIKit as convertButtonToUIKit,
    convertToBlockKit as convertButtonToBlockKit,
} from './button';
import {
    convertToUIKit as convertImageToUIKit,
    convertToBlockKit as convertImageToBlockKit,
} from './image';
import {
    convertToUIKit as convertOverflowMenuToUIKit,
} from './overflowMenu';
import {
    convertToUIKit as convertStaticSelectToUIKit,
} from './staticSelect';
import {
    convertToUIKit as convertMultiStaticSelectToUIKit,
} from './multiStaticSelect';
import { Button, Action, Overflow, ImageElement, StaticSelect, MultiStaticSelect } from '../../../vendor/slack-types';
import { IBlockElement, BlockElementType, IButtonElement, IImageElement } from '@rocket.chat/apps-engine/definition/uikit';

export function convertToUIKit(element: Button | Overflow | StaticSelect | ImageElement | Action): object {
    console.log('this is the element type: ' + element.type);
    switch (element.type) {
        case 'button':
            return convertButtonToUIKit(element as Button);
        case 'image':
            return convertImageToUIKit(element as ImageElement);
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
        case BlockElementType.BUTTON:
            return convertButtonToBlockKit(element as IButtonElement);
        case BlockElementType.IMAGE:
            return convertImageToBlockKit(element as IImageElement);
        default:
            return element;
    }
}
