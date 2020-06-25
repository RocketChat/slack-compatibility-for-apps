import { PlainTextInput as BlockKitPlainTextInput, PlainTextElement} from '../../../vendor/slack-types';
import { IPlainTextInputElement as UIKitPlainTextInput, ITextObject, TextObjectType} from '@rocket.chat/apps-engine/definition/uikit';
import {
    convertToUIKit as convertTextToUIKit,
    convertToBlockKit as convertTextToBlockKit,
} from '../objects/text';
import {
    camelCaseToSnakeCase,
    removeObjectProperties,
    renameObjectProperties,
    snakeCaseToCamelCase,
} from '../../helpers';

/**
 * Converts a Block Kit plain text input element to UIKit
 *
 * @param originalElement PlainTextInput
 * @returns IPlainTextInputElement
 */
export function convertToUIKit(originalElement: BlockKitPlainTextInput) : UIKitPlainTextInput {
    let input: any = {
        ...removeObjectProperties(originalElement, ['multiline', 'min_length', 'max_length'])
    };

    if (originalElement.placeholder) {
       input.placeholder = convertTextToUIKit(originalElement.placeholder as PlainTextElement);
    } else {
        input.placeholder = {
            type: TextObjectType.PLAINTEXT,
            text: ''
        } as ITextObject;
    }

    return renameObjectProperties(snakeCaseToCamelCase, input) as UIKitPlainTextInput;
}

/**
 * Converts an UIKit plain text input element to Block Kit
 *
 * @param originalElement IPlainTextInputElement
 * @returns PlainTextElement
 */
export function convertToBlockKit(originalElement: UIKitPlainTextInput): BlockKitPlainTextInput {
    let input: any = {
        ...originalElement
    };

    input.placeholder = convertTextToBlockKit(originalElement.placeholder as ITextObject);

    return renameObjectProperties(camelCaseToSnakeCase, input) as BlockKitPlainTextInput;
}

/**
 * Type guard to test whether the provided element is IPlainTextInputElement
 *
 * @param input IPlainTextInputElement | PlainTextElement
 * @returns Boolean
 */
export function isUIKitPlainTextInput(input: UIKitPlainTextInput | BlockKitPlainTextInput): input is UIKitPlainTextInput {
    return (input as UIKitPlainTextInput).actionId !== undefined;
}
