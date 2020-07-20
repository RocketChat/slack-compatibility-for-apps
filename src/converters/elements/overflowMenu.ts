import {
    IOptionObject as UIKitOptionObject,
    IOverflowMenuElement as UIKitOverflowMenu,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    Option as BlockKitOptionObject,
    Overflow as BlockKitOverflowMenu,
} from '../../../vendor/slack-types';
import {
    convertToUIKit as convertOptionToUIKit,
    convertToBlockKit as convertOptionToBlockKit,
} from '../objects/option';
import {
    camelCaseToSnakeCase,
    removeObjectProperties,
    renameObjectProperties,
    snakeCaseToCamelCase,
} from '../../helpers';

/**
 * Converts a Block Kit overflow menu element to UIKit
 *
 * @param originalElement Overflow
 * @returns IOverflowMenuElement
 */
export function convertToUIKit(originalElement: BlockKitOverflowMenu): UIKitOverflowMenu {
        const menu = {
            ...removeObjectProperties(originalElement, ['confirm']),
            action_id: originalElement.action_id || '',
            options: originalElement.options.map(option => convertOptionToUIKit(option as BlockKitOptionObject)),
        };

        return renameObjectProperties(snakeCaseToCamelCase, menu) as UIKitOverflowMenu;
}

/**
 * Converts an UIKit overflow menu element to Block Kit
 *
 * @param originalElement IOverflowMenuElement
 * @returns Overflow
 */
export function convertToBlockKit(originalElement: UIKitOverflowMenu): BlockKitOverflowMenu {
    return {
        ...renameObjectProperties(camelCaseToSnakeCase, originalElement),
        options: originalElement.options.map(option => convertOptionToBlockKit(option as UIKitOptionObject)),
    } as BlockKitOverflowMenu;
}
