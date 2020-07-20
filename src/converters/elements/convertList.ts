import { IBlockElement as UIKitBlockElement } from '@rocket.chat/apps-engine/definition/uikit';
import { BlockKitAccessoryElements as BlockKitBlockElement } from '../../customTypes/slack';
import {
    convertToUIKit as convertElementToUIKit,
    convertToBlockKit as convertElementToBlockKit,
} from './convertElement';

/**
 * Converts a list of Block Kit elements to UIKit
 *
 * @param elements Array<BlockKitAccessoryElements>
 * @returns Array<IBlockElement>
 */
export function convertToUIKit(elements: Array<BlockKitBlockElement>): Array<UIKitBlockElement> {
    return elements.map(element => convertElementToUIKit(element));
}

/**
 * Converts a list of UIKit elements to Block Kit
 *
 * @param elements Array<IBlockElement>
 * @returns Array<BlockKitAccessoryElements>
 */
export function convertToBlockKit(elements: Array<UIKitBlockElement>): Array<BlockKitBlockElement> {
    return elements.map(element => convertElementToBlockKit(element));
}
