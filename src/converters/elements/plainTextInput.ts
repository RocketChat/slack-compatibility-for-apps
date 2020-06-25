import { PlainTextInput as BlockKitPlainTextInput, PlainTextElement} from '../../../vendor/slack-types';
import { IPlainTextInputElement as UIKitPlainTextInput, ITextObject} from '@rocket.chat/apps-engine/definition/uikit';
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

export function convertToUIKit(originalElement: BlockKitPlainTextInput) : UIKitPlainTextInput {
    let input: any = {
        ...removeObjectProperties(originalElement, ['multiline', 'min_length', 'max_length'])
    };

    if (originalElement.placeholder) {
        // @NOTE the placeholder element in the uikit input is mandatory
       input.placeholder = convertTextToUIKit(originalElement.placeholder as PlainTextElement);
    }

    return renameObjectProperties(snakeCaseToCamelCase, input) as UIKitPlainTextInput;
}

export function convertToBlockKit(originalElement: UIKitPlainTextInput): BlockKitPlainTextInput {
    let input: any = {
        ...originalElement
    };

    input.placeholder = convertTextToBlockKit(originalElement.placeholder as ITextObject);

    return renameObjectProperties(camelCaseToSnakeCase, input) as BlockKitPlainTextInput;
}

export function isUIKitPlainTextInput(input: UIKitPlainTextInput | BlockKitPlainTextInput): input is UIKitPlainTextInput {
    return (input as UIKitPlainTextInput).actionId !== undefined;
}
