import { DividerBlock as BlockKitDividerBlock } from '../../../vendor/slack-types';
import { IDividerBlock as UIKitDividerBlock } from '@rocket.chat/apps-engine/definition/uikit';

/**
 * Converts a Block Kit divider block to UIKit
 *
 * @param originalBlock DividerBlock
 * @returns IDividerBlock
 */
export function convertToUIKit(originalBlock: BlockKitDividerBlock): UIKitDividerBlock {
    return originalBlock as UIKitDividerBlock;
}

/**
 * Converts a UIKit divider block to Block Kit
 *
 * @param originalBlock IDividerBlock
 * @returns DividerBlock
 */
export function convertToBlockKit(originalBlock: UIKitDividerBlock): BlockKitDividerBlock {
    return originalBlock as BlockKitDividerBlock;
}
