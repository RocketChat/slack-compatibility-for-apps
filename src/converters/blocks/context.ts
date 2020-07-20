import {
    ContextBlock as BlockKitContextBlock,
} from '../../../vendor/slack-types';
import {
    BlockElementType,
    IContextBlock as UIKitContextBlock,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    renameObjectProperties,
    snakeCaseToCamelCase,
    camelCaseToSnakeCase,
} from '../../helpers';
import {
    convertToUIKit as convertImageElementToUIKit,
    convertToBlockKit as convertImageElementToBlockKit,
} from '../elements/image';
import {
    convertToUIKit as convertTextObjectToUIKit,
    convertToBlockKit as convertTextObjectToBlockKit,
} from '../objects/text';
import { BlockKitTextObject } from '../../customTypes/slack';

/**
 * Converts a Block Kit context block to UIKit
 *
 * @param originalBlock ContextBlock
 * @returns IContextBlock
 */
export function convertToUIKit(originalBlock: BlockKitContextBlock): UIKitContextBlock {
    const context: any = {
        ...renameObjectProperties(snakeCaseToCamelCase, originalBlock),
    };

    context.elements = originalBlock.elements
    .map(element => element.type === BlockElementType.IMAGE ?
         convertImageElementToUIKit(element) :
         convertTextObjectToUIKit(element as BlockKitTextObject));

    return context as UIKitContextBlock;
}

/**
 * Converts a UIKit context block to Block Kit
 *
 * @param originalBlock IContextBlock
 * @returns ContextBlock
 */
export function convertToBlockKit(originalBlock: UIKitContextBlock): BlockKitContextBlock {
    const context: any = {
        ...renameObjectProperties(camelCaseToSnakeCase, originalBlock),
    };

    context.elements = originalBlock.elements
    .map(element => element.type === BlockElementType.IMAGE ?
         convertImageElementToBlockKit(element) :
         convertTextObjectToBlockKit(element));

    return context as BlockKitContextBlock;
}
