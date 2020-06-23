import {
    convertToUIKit as convertButtonToUIKit,
    convertToBlockKit as convertButtonToBlockKit,
} from './button';
import {
    convertToUIKit as convertImageToUIKit,
} from './image';
import { Button, Action, Overflow, Select, ImageElement } from '../../../vendor/slack-types';
import { IBlockElement, BlockElementType, IButtonElement } from '@rocket.chat/apps-engine/definition/uikit';
import {} from '../../../vendor/slack-types';

export function convertToUIKit(element: Button | Overflow | Select | ImageElement | Action): object {
    switch (element.type) {
        case 'button':
            return convertButtonToUIKit(element as Button);
        case 'image':
            return convertImageToUIKit(element as ImageElement);
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
