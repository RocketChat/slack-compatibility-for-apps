import {
    IOptionObject as UIKitOptionObject,
    IOverflowMenuElement as UIKitOverflowMenu,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    Option as BlockKitOptionObject,
    Overflow as BlockKitOverflowMenu,
} from '../../../vendor/slack-types';
import { convertToUIKit as convertOptionToUIKit } from '../objects/option';

export function convertToUIKit(originalElement: BlockKitOverflowMenu): UIKitOverflowMenu {
        let menu: any = {
            ...originalElement,
        };

        const options: UIKitOptionObject[] = [];

        for (const option of originalElement.options) {
            options.push(convertOptionToUIKit(option as BlockKitOptionObject));
        }

        menu.options = options;

        if (menu.confirm) {
            delete menu.confirm;
        }

        return menu as UIKitOverflowMenu;
}
