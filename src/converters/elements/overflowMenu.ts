import {
    IOptionObject as UIKitOptionObject,
    IOverflowMenuElement as UIKitOverflowMenu,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    Option as BlockKitOptionObject,
    Overflow as BlockKitOverflowMenu,
} from '../../../vendor/slack-types';
import { ElementConverter } from '../ElementConverter';
import { OptionObjectConverter } from '../objects/option';

type ConversionOverflowMenu = UIKitOverflowMenu | BlockKitOverflowMenu;

export class OverflowMenuConverter extends ElementConverter<ConversionOverflowMenu> {
    constructor(overflowMenu: ConversionOverflowMenu) {
        super(overflowMenu);
    }

    public convertToUIKit(): UIKitOverflowMenu {
        let menu: any = {
            ...this.element,
        };

        const options: UIKitOptionObject[] = [];

        for (let i = 0; i < this.element.options.length; i++) {
            const current: BlockKitOptionObject = this.element.options[i] as BlockKitOptionObject;
            // @NOTE  I don't like this `as any` business, but it works for now
            options.push(new OptionObjectConverter(current).convertToUIKit() as any);
        }

        menu.options = options;

        if (menu.confirm) {
            delete menu.confirm;
        }

        return super.convertToUIKit() as UIKitOverflowMenu;
    }
}
