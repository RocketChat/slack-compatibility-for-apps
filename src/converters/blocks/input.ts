import { InputBlock as BlockKitInputBlock } from '../../../vendor/slack-types';
import { IInputBlock as UIKitInputBlock } from '@rocket.chat/apps-engine/definition/uikit';

/**
 * Converts a Block Kit input block to UIKit
 *
 * @param originalBlock InputBlock
 * @returns IInputBlock
 */
export function convertToUIKit(originalBlock: BlockKitInputBlock): UIKitInputBlock {
    // @TODO
    return originalBlock as UIKitInputBlock;
}

/**
 * Converts a UIKit input block to Block Kit
 *
 * @param originalBlock IInputBlock
 * @returns InputBlock
 */
export function convertToBlockKit(originalBlock: UIKitInputBlock): BlockKitInputBlock {
    // @TODO
    return originalBlock as BlockKitInputBlock;
}
