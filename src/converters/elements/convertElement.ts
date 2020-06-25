import {
    convertToUIKit as convertButtonToUIKit,
    convertToBlockKit as convertButtonToBlockKit,
} from './button';
import {
    convertToUIKit as convertImageToUIKit,
} from './image';
import {
    convertToUIKit as convertOverflowMenuToUIKit,
} from './overflowMenu';
import {
    convertToUIKit as convertStaticSelectToUIKit,
} from './staticSelect';
import { Button, Action, Overflow, ImageElement, StaticSelect } from '../../../vendor/slack-types';
import { IBlockElement, BlockElementType, IButtonElement } from '@rocket.chat/apps-engine/definition/uikit';

export function convertToUIKit(element: Button | Overflow | StaticSelect | ImageElement | Action): object {
    switch (element.type) {
        case 'button':
            return convertButtonToUIKit(element as Button);
        case 'image':
            return convertImageToUIKit(element as ImageElement);
        case 'overflow':
            return convertOverflowMenuToUIKit(element as Overflow);
        case 'static_select':
            return convertStaticSelectToUIKit(element as StaticSelect);
        default:
            return element;
    }
}

export function convertToBlockKit(element: IBlockElement): object {
    switch (element.type) {
        case BlockElementType.BUTTON:
            return convertButtonToBlockKit(element as IButtonElement);
        default:
            return element;
    }
}
