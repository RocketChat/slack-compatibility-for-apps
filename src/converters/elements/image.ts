import { IImageElement as UIKitImage } from '@rocket.chat/apps-engine/definition/uikit';
import { ImageElement as BlockKitImage } from '../../../vendor/slack-types';
import { ElementConverter } from '../ElementConverter';

type ConversionImage = UIKitImage | BlockKitImage;

export class ImageConverter extends ElementConverter<ConversionImage> {
    constructor(image: ConversionImage) {
        super(image);
    }

    public convertToUIKit(): UIKitImage {
        return super.convertToUIKit() as UIKitImage;
    }

    public convertToBlockKit(): BlockKitImage {
        return super.convertToBlockKit() as BlockKitImage;
    }
}
