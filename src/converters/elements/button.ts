import { IButtonElement as UIKitButton} from '@rocket.chat/apps-engine/definition/uikit';
import { Button as BlockKitButton } from '@slack/types';
import { ElementConverter } from '../ElementConverter';

type ConversionButton = UIKitButton | BlockKitButton;

export class ButtonConverter extends ElementConverter<ConversionButton> {
    constructor(button: ConversionButton) {
        super(button);
    }

    public convertToUIKit(): UIKitButton {
        return super.convertToUIKit() as UIKitButton;
    }

    public convertToBlockKit(): BlockKitButton {
        return super.convertToBlockKit() as BlockKitButton;
    }
}
