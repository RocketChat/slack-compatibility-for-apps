import { IImageElement as UIKitImageElement } from '@rocket.chat/apps-engine/definition/uikit';
import { ImageElement as BlockKitImageElement } from '../../../vendor/slack-types';
import { snakeCaseToCamelCase, renameObjectProperties, camelCaseToSnakeCase } from '../../helpers';

export function convertToUIKit(originalElement: BlockKitImageElement): UIKitImageElement {
    return renameObjectProperties(snakeCaseToCamelCase, originalElement) as UIKitImageElement;
}

export function convertToBlockKit(originalElement: UIKitImageElement): BlockKitImageElement {
    return renameObjectProperties(camelCaseToSnakeCase, originalElement) as BlockKitImageElement;
}
