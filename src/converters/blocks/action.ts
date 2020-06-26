import { IActionsBlock as UIKitActionsBlock, IBlockElement } from '@rocket.chat/apps-engine/definition/uikit';
import { ActionsBlock as BlockKitActionsBlock, Block } from '../../../vendor/slack-types';
import { renameObjectProperties, snakeCaseToCamelCase, camelCaseToSnakeCase } from '../../helpers';
import {
    convertToUIKit as convertElementListToUIKit,
    convertToBlockKit as convertElementListToBlockKit,
} from '../elements/convertList';

/**
 * Converts a Block Kit actions block to UIKit
 *
 * @param originalBlock ActionsBlock
 * @returns IActionsBlock
 */
export function convertToUIKit(originalBlock: BlockKitActionsBlock): UIKitActionsBlock {
    let target: Partial<UIKitActionsBlock> = {
        ...renameObjectProperties(snakeCaseToCamelCase, originalBlock),
    };

    target.elements = convertElementListToUIKit(originalBlock.elements) as IBlockElement[];

    return target as UIKitActionsBlock;
}

/**
 * Converts a UIKit actions block to Block Kit
 *
 * @param originalBlock IActionsBlock
 * @returns ActionsBlock
 */
export function convertToBlockKit(originalBlock: UIKitActionsBlock): BlockKitActionsBlock {
    let target: Partial<BlockKitActionsBlock> = {
        ...renameObjectProperties(camelCaseToSnakeCase, originalBlock),
    };

    target.elements = convertElementListToBlockKit(originalBlock.elements) as Block[];

    return target as BlockKitActionsBlock;
}

/**
 * Type guard to test whether the provided block is IActionsBlock
 *
 * @param block IActionsBlock | ActionsBlock
 * @returns Boolean
 */
export function isUIKitActionsBlock(block: UIKitActionsBlock | BlockKitActionsBlock): block is UIKitActionsBlock {
    return (block as UIKitActionsBlock).blockId !== undefined;
}
