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
import {renameObjectProperties, snakeCaseToCamelCase, camelCaseToSnakeCase} from '../../helpers';

export function convertToUIKit(originalElement: BlockKitOverflowMenu): UIKitOverflowMenu {
        let menu = {
            ...originalElement,
            options: originalElement.options.map(option => convertOptionToUIKit(option as BlockKitOptionObject)),
        };

        if (menu.confirm) {
            delete menu.confirm;
        }

        return renameObjectProperties(snakeCaseToCamelCase, menu) as UIKitOverflowMenu;
}

export function convertToBlockKit(originalElement: UIKitOverflowMenu): BlockKitOverflowMenu {
        let menu = {
            ...originalElement,
            options: originalElement.options.map(option => convertOptionToBlockKit(option as UIKitOptionObject)),
        };

        return renameObjectProperties(camelCaseToSnakeCase, menu) as BlockKitOverflowMenu;
}
