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
import {renameObjectProperties, snakeCaseToCamelCase, camelCaseToSnakeCase, removeObjectProperties} from '../../helpers';

/**
 * Converts a Block Kit overflow menu element to UIKit
 *
 * @param originalElement Overflow
 * @returns IOverflowMenuElement
 */
export function convertToUIKit(originalElement: BlockKitOverflowMenu): UIKitOverflowMenu {
        let menu = {
            ...removeObjectProperties(originalElement, ['confirm']),
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
        let menu = {
            ...originalElement,
            options: originalElement.options.map(option => convertOptionToBlockKit(option as UIKitOptionObject)),
        };

        return renameObjectProperties(camelCaseToSnakeCase, menu) as BlockKitOverflowMenu;
}
