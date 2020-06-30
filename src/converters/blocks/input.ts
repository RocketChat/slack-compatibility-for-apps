import { InputBlock as BlockKitInputBlock } from '../../../vendor/slack-types';
import { IInputBlock as UIKitInputBlock } from '@rocket.chat/apps-engine/definition/uikit';
import {renameObjectProperties, snakeCaseToCamelCase, camelCaseToSnakeCase, removeObjectProperties} from '../../helpers';
import {
    convertToUIKit as convertElementToUIKit,
    convertToBlockKit as convertElementToBlockKit,
} from '../elements/convertElement';
import {
    convertToUIKit as convertTextToUIKit,
    convertToBlockKit as convertTextToBlockKit,
} from '../objects/text';

/**
 * Converts a Block Kit input block to UIKit
 *
 * @param originalBlock InputBlock
 * @returns IInputBlock
 */
export function convertToUIKit(originalBlock: BlockKitInputBlock): UIKitInputBlock {
    const input: any = {
        ...removeObjectProperties(originalBlock, ['hint']),
        label: convertTextToUIKit(originalBlock.label),
        element: convertElementToUIKit(originalBlock.element),
    }

    return renameObjectProperties(snakeCaseToCamelCase, input) as UIKitInputBlock;
}

/**
 * Converts a UIKit input block to Block Kit
 *
 * @param originalBlock IInputBlock
 * @returns InputBlock
 */
export function convertToBlockKit(originalBlock: UIKitInputBlock): BlockKitInputBlock {
    const input: any = {
        ...originalBlock,
        label: convertTextToBlockKit(originalBlock.label),
        element: convertElementToBlockKit(originalBlock.element),
    }

    return renameObjectProperties(camelCaseToSnakeCase, input) as BlockKitInputBlock;
}
