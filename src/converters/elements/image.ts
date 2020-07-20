import { IImageElement as UIKitImageElement } from '@rocket.chat/apps-engine/definition/uikit';
import { ImageElement as BlockKitImageElement } from '../../../vendor/slack-types';
import { snakeCaseToCamelCase, renameObjectProperties, camelCaseToSnakeCase } from '../../helpers';

/**
 * Converts a Block Kit image element to UIKit
 *
 * @param originalElement ImageElement
 * @returns IImageElement
 */
export function convertToUIKit(originalElement: BlockKitImageElement): UIKitImageElement {
    return renameObjectProperties(snakeCaseToCamelCase, originalElement) as UIKitImageElement;
}

/**
 * Converts a UIKit image element to Block Kit
 *
 * @param originalElement IImageElement
 * @returns ImageElement
 */
export function convertToBlockKit(originalElement: UIKitImageElement): BlockKitImageElement {
    return renameObjectProperties(camelCaseToSnakeCase, originalElement) as BlockKitImageElement;
}
