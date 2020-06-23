import {
    ISectionBlock as UIKitSectionBlock,
    AccessoryElements as UIKitAccessoryElements,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    SectionBlock as BlockKitSectionBlock,
} from '../../../vendor/slack-types';
import {
    BlockKitAccessoryElements,
} from '../../customTypes/slack';
import {
    renameObjectProperties,
    snakeCaseToCamelCase,
    //camelCaseToSnakeCase,
} from '../../helpers';
import {
    convertToUIKit as convertElementToUIKit,
    //convertToBlockKit as convertElementToBlockKit,
} from '../elements/convertElement';


export function convertToUIKit(originalBlock: BlockKitSectionBlock): UIKitSectionBlock {
    let target: Partial<UIKitSectionBlock> = {
        ...renameObjectProperties(snakeCaseToCamelCase, originalBlock),
    };

    if (target.accessory) {
        target.accessory = convertElementToUIKit(originalBlock.accessory as BlockKitAccessoryElements) as UIKitAccessoryElements;
    }

    return target as UIKitSectionBlock;
}

/*
 *export function convertToBlockKit(originalBlock: UIKitSectionBlock): BlockKitSectionBlock {
 *    let target: Partial<BlockKitSectionBlock> = {
 *        ...renameObjectProperties(camelCaseToSnakeCase, originalBlock),
 *    };
 *
 *    target.accessory = convertElementToBlockKit(originalBlock.accessory) as Block;
 *
 *    return target as BlockKitSectionBlock;
 *}
 */

export function isUIKitSectionBlock(block: UIKitSectionBlock | BlockKitSectionBlock): block is UIKitSectionBlock {
    return (block as UIKitSectionBlock).blockId !== undefined;
}
