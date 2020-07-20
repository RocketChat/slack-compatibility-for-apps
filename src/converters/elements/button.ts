import { IButtonElement as UIKitButton } from '@rocket.chat/apps-engine/definition/uikit';
import { Button as BlockKitButton } from '../../../vendor/slack-types';
import {
    camelCaseToSnakeCase,
    removeObjectProperties,
    renameObjectProperties,
} from '../../helpers';

/**
 * Converts a Block Kit button element to UIKit
 *
 * @param originalElement Button
 * @returns IButtonElement
 */
export function convertToUIKit(originalElement: BlockKitButton): UIKitButton {
    const target = {
        ...originalElement,
        actionId: originalElement.action_id || '',
    };

    return removeObjectProperties(target, ['action_id','confirm']) as UIKitButton;
}

/**
 * Converts a UIKit button element to Block Kit
 *
 * @param originalElement IButtonElement
 * @returns Button
 */
export function convertToBlockKit(originalElement: UIKitButton): BlockKitButton {
    return renameObjectProperties(camelCaseToSnakeCase, originalElement) as BlockKitButton;
}

/**
 * Type guard to test whether the provided element is IButtonElement
 *
 * @param button IButtonElement | Button
 * @returns Boolean
 */
export function isUIKitButton(button: UIKitButton | BlockKitButton): button is UIKitButton {
    return (button as UIKitButton).actionId !== undefined;
}
