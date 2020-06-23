import {
    convertToUIKit as convertButtonToUIKit,
    convertToBlockKit as convertButtonToBlockKit,
} from './button';
import { Button, Action, Overflow, Select } from '../../../vendor/slack-types';
import { IBlockElement, BlockElementType, IButtonElement } from '@rocket.chat/apps-engine/definition/uikit';

export function convertToUIKit(element: Button | Overflow | Select | Action): object {
    switch (element.type) {
        case 'button':
            return convertButtonToUIKit(element as Button);
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
