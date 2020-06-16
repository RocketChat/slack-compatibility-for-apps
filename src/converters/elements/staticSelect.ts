import {
    IStaticSelectElement as UIKitStaticSelect,
    IOptionObject as UIKitOptionObject,
    BlockElementType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    StaticSelect as BlockKitStaticSelect,
    Option as BlockKitOptionObject,
} from '@slack/types';
import { ElementConverter } from '../ElementConverter';
import { TextObjectConverter } from '../objects/text';
import { OptionObjectConverter } from '../objects/option';

type ConversionStaticSelect = UIKitStaticSelect | BlockKitStaticSelect;

export class StaticSelectConverter extends ElementConverter<ConversionStaticSelect> {
    constructor(staticSelect: ConversionStaticSelect) {
        super(staticSelect);
    }

    public convertToUIKit(): UIKitStaticSelect {
        // @TODO !!!!!!!!!!!
        const thisElement = <BlockKitStaticSelect>this.element;
        // @TODO !!!!!!!!!!!

        let select: any = {
            actionId: thisElement.action_id,
            type: BlockElementType.STATIC_SELECT,
            placeholder: new TextObjectConverter(this.element.placeholder).convertToUIKit(),
            initialValue: thisElement.initial_option.value,
        };

        const options: UIKitOptionObject[] = [];

        for (let i = 0; i < this.element.options.length; i++) {
            const current: BlockKitOptionObject = this.element.options[i] as BlockKitOptionObject;
            // @NOTE  I don't like this `as any` business, but it works for now
            options.push(new OptionObjectConverter(current).convertToUIKit() as any);
        }

        select.options = options;


        return select as UIKitStaticSelect;
    }

    public convertToBlockKit(): BlockKitStaticSelect {
        // @TODO !!!!!!!!!!!
        const thisElement = <UIKitStaticSelect>this.element;
        // @TODO !!!!!!!!!!!

        let select: any = {
            action_id: thisElement.actionId,
            type: 'static_select',
        };

        const options: BlockKitOptionObject[] = [];

        for (let i = 0; i < this.element.options.length; i++) {
            const current: UIKitOptionObject = this.element.options[i] as UIKitOptionObject;
            // @NOTE  I don't like this `as any` business, but it works for now
            options.push(new OptionObjectConverter(current).convertToUIKit() as any);
        }

        select.options = options;

        //const initial_option = select.options
        //.filter(option => option.value === thisElement.initialValue);

        //select.initial_option = initial_option;

        return select as BlockKitStaticSelect;
    }
}
