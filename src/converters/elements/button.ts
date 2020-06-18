import { IButtonElement as UIKitButton } from '@rocket.chat/apps-engine/definition/uikit';
import { Button as BlockKitButton } from '@slack/types';
import {
    camelCaseToSnakeCase,
    removeObjectProperties,
    renameObjectProperties,
} from '../../helpers';

export function convertToUIKit(originalElement: BlockKitButton): UIKitButton {
    const target = {
        ...originalElement,
        actionId: originalElement.action_id || '',
    };

    return removeObjectProperties(target, ['action_id','confirm']) as UIKitButton;
}

export function convertToBlockKit(originalElement: UIKitButton): BlockKitButton {
    return renameObjectProperties(camelCaseToSnakeCase, originalElement) as BlockKitButton;
}

export function isUIKitButton(button: UIKitButton | BlockKitButton): button is UIKitButton {
    return (button as UIKitButton).actionId !== undefined;
}
