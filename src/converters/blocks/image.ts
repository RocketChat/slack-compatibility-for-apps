import { ImageBlock as BlockKitImageBlock } from '../../../vendor/slack-types';
import { IImageBlock as UIKitImageBlock} from '@rocket.chat/apps-engine/definition/uikit';
import {
    renameObjectProperties,
    snakeCaseToCamelCase,
    camelCaseToSnakeCase,
} from '../../helpers';
import {
    convertToUIKit as convertTextToUIKit,
    convertToBlockKit as convertTextToBlockKit,
} from '../objects/text';

/**
 * Converts a Block Kit image block to UIKit
 *
 * @param originalBlock ImageBlock
 * @returns IImageBlock
 */
export function convertToUIKit(originalBlock: BlockKitImageBlock): UIKitImageBlock {
    const image: any = {
        ...renameObjectProperties(snakeCaseToCamelCase, originalBlock),
    };

    if (originalBlock.title) {
        image.title = convertTextToUIKit(originalBlock.title);
    }

    return image as UIKitImageBlock;
}

/**
 * Converts a UIKit image block to Block Kit
 *
 * @param originalBlock IImageBlock
 * @returns ImageBlock
 */
export function convertToBlockKit(originalBlock: UIKitImageBlock): BlockKitImageBlock {
    const image: any = {
        ...renameObjectProperties(camelCaseToSnakeCase, originalBlock),
    };

    if (originalBlock.title) {
        image.title = convertTextToBlockKit(originalBlock.title);
    }

    return image as BlockKitImageBlock;
}
