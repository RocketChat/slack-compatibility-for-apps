import {
    Option as BlockKitOptionObject,
} from '../../../vendor/slack-types';
import {
    IOptionObject as UIKitOptionObject,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    convertToUIKit as convertTextToUIKit,
    convertToBlockKit as convertTextToBlockKit,
} from './text';
import { removeObjectProperties } from '../../helpers';

/**
 * Converts a Block Kit option object to UIKit
 *
 * @param originalElement Option
 * @return IOptionObject
 */
export function convertToUIKit(originalElement: BlockKitOptionObject): UIKitOptionObject {
    return {
        ...removeObjectProperties(originalElement, ['description','url']),
        text: convertTextToUIKit(originalElement.text),
    } as UIKitOptionObject;
}

/**
 * Converts an UIKit option object to Block Kit
 *
 * @param originalElement IOptionObject
 * @returns Option
 */
export function convertToBlockKit(originalElement: UIKitOptionObject): BlockKitOptionObject {
    return {
        ...originalElement,
        text: convertTextToBlockKit(originalElement.text),
    } as BlockKitOptionObject;
}
