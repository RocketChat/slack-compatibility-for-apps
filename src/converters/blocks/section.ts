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
    removeObjectProperties,
    camelCaseToSnakeCase,
} from '../../helpers';
import {
    convertToUIKit as convertElementToUIKit,
    convertToBlockKit as convertElementToBlockKit,
} from '../elements/convertElement';

/**
 * Converts a Block Kit section block to UIKit
 *
 * @param originalBlock SectionBlock
 * @returns ISectionBlock
 */
export function convertToUIKit(originalBlock: BlockKitSectionBlock): UIKitSectionBlock {
    let target: Partial<UIKitSectionBlock> = {
        ...removeObjectProperties(originalBlock, ['fields']),
    };

    if (target.accessory) {
        target.accessory = convertElementToUIKit(originalBlock.accessory as BlockKitAccessoryElements) as UIKitAccessoryElements;
    }

    return renameObjectProperties(snakeCaseToCamelCase, target) as UIKitSectionBlock;
}

/**
 * Converts a UIKit section block to Block Kit
 *
 * @param originalBlock ISectionBlock
 * @returns SectionBlock
 */
export function convertToBlockKit(originalBlock: UIKitSectionBlock): BlockKitSectionBlock {
    let target: Partial<BlockKitSectionBlock> = {
        ...renameObjectProperties(camelCaseToSnakeCase, originalBlock),
    };

    if (originalBlock.accessory) {
        target.accessory = convertElementToBlockKit(originalBlock.accessory as UIKitAccessoryElements) as BlockKitAccessoryElements;
    }

    return target as BlockKitSectionBlock;
}
