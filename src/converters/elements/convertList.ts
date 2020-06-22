import {
    convertToUIKit as convertButtonToUIKit,
    convertToBlockKit as convertButtonToBlockKit,
} from './button';
import { Button, Action, Overflow, Select } from '../../../vendor/slack-types';
import {IBlockElement, BlockElementType, IButtonElement} from '@rocket.chat/apps-engine/definition/uikit';

export function convertToUIKit(elements: Array<Button | Overflow | Select | Action>): Array<object> {
    return elements.map((element) => {
        // identify element type
        switch (element.type) {
            case 'button':
                return convertButtonToUIKit(element as Button);
            default:
                return element;
        }
    });
}

export function convertToBlockKit(elements: Array<IBlockElement>): Array<object> {
    return elements.map((element) => {
        // identify element type
        switch (element.type) {
            case BlockElementType.BUTTON:
                return convertButtonToBlockKit(element as IButtonElement);
            default:
                return element;
        }
    });
}
