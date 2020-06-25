import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as faker from 'faker';
import {
    PlainTextInput as BlockKitPlainTextInput,
    PlainTextElement as BlockKitPlainTextElement,
} from '../../../vendor/slack-types';
import {
    IPlainTextInputElement as UIKitPlainTextInput,
    BlockElementType,
    ITextObject,
} from '@rocket.chat/apps-engine/definition/uikit';

import {
    convertToUIKit,
    convertToBlockKit,
    isUIKitPlainTextInput,
} from '../../../src/converters/elements/plainTextInput';

describe('Plain text input data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert a plain text input from slack to rocket.chat format', () => {
            const sourceInput: BlockKitPlainTextInput = {
                type: 'plain_text_input',
                action_id: 'plain_input',
                placeholder: {
                    type: 'plain_text',
                    text: faker.lorem.sentence(),
                } as BlockKitPlainTextElement
            };

            const targetInput: UIKitPlainTextInput = {
                type: BlockElementType.PLAIN_TEXT_INPUT,
                actionId: sourceInput.action_id,
                placeholder: sourceInput.placeholder as ITextObject
            };

            const converted: UIKitPlainTextInput = convertToUIKit(sourceInput);
            expect(isUIKitPlainTextInput(converted)).to.be.true;
            expect(converted).to.deep.equal(targetInput);
        });

        it('should convert a plain text input with `initial_value` from slack to rocket.chat format', () => {
            const sourceInput: BlockKitPlainTextInput = {
                type: 'plain_text_input',
                action_id: 'plain_input',
                placeholder: {
                    type: 'plain_text',
                    text: faker.lorem.sentence(),
                } as BlockKitPlainTextElement,
                initial_value: faker.lorem.sentence(),
            };

            const targetInput: UIKitPlainTextInput = {
                type: BlockElementType.PLAIN_TEXT_INPUT,
                actionId: sourceInput.action_id,
                placeholder: sourceInput.placeholder as ITextObject,
                initialValue: sourceInput.initial_value
            };

            const converted: UIKitPlainTextInput = convertToUIKit(sourceInput);
            expect(isUIKitPlainTextInput(converted)).to.be.true;
            expect(converted).to.deep.equal(targetInput);
        });

        it('should convert a plain text input without the `placeholder` field from slack to rocket.chat format', () => {
            const sourceInput: BlockKitPlainTextInput = {
                type: 'plain_text_input',
                action_id: 'plain_input',
                initial_value: faker.lorem.sentence(),
            };

            const targetInput: UIKitPlainTextInput = {
                type: BlockElementType.PLAIN_TEXT_INPUT,
                actionId: sourceInput.action_id,
                placeholder: {
                    type: 'plain_text',
                    text: '',
                } as ITextObject,
                initialValue: sourceInput.initial_value
            };

            const converted: UIKitPlainTextInput = convertToUIKit(sourceInput);
            expect(isUIKitPlainTextInput(converted)).to.be.true;
            expect(converted).to.deep.equal(targetInput);
        });

        it('should convert a plain text input with additional fields from slack to rocket.chat format', () => {
            // We are adding fields that are not supported by rocket.chat's uikit
            const sourceInput: BlockKitPlainTextInput = {
                type: 'plain_text_input',
                action_id: 'plain_input',
                placeholder: {
                    type: 'plain_text',
                    text: faker.lorem.sentence(),
                } as BlockKitPlainTextElement,
                initial_value: faker.lorem.sentence(),
                min_length: 3,
                max_length: 18,
                multiline: true,
            };

            const targetInput: UIKitPlainTextInput = {
                type: BlockElementType.PLAIN_TEXT_INPUT,
                actionId: sourceInput.action_id,
                placeholder: sourceInput.placeholder as ITextObject,
                initialValue: sourceInput.initial_value
            };

            const converted: UIKitPlainTextInput = convertToUIKit(sourceInput);
            expect(isUIKitPlainTextInput(converted)).to.be.true;
            expect(converted).to.deep.equal(targetInput);
        });
    });
    describe('From UIKit to Block Kit', () => {
        it('should convert a plain text input from rocket.chat to slack format', () => {
            const sourceInput: UIKitPlainTextInput = {
                type: BlockElementType.PLAIN_TEXT_INPUT,
                actionId: 'plain_input',
                placeholder: {
                    type: 'plain_text',
                    text: faker.lorem.sentence(),
                } as ITextObject
            };

            const targetInput: BlockKitPlainTextInput = {
                type: 'plain_text_input',
                action_id: sourceInput.actionId,
                placeholder: {
                    type: sourceInput.placeholder.type,
                    text: sourceInput.placeholder.text,
                } as BlockKitPlainTextElement
            };

            const converted: BlockKitPlainTextInput = convertToBlockKit(sourceInput);
            expect(isUIKitPlainTextInput(converted)).to.be.false;
            expect(converted).to.deep.equal(targetInput);
        });

        it('should convert a plain text input with `initial_value` from rocket.chat to slack format', () => {
            const sourceInput: UIKitPlainTextInput = {
                type: BlockElementType.PLAIN_TEXT_INPUT,
                actionId: 'plain_text',
                placeholder: {
                    type: 'plain_text',
                    text: faker.lorem.sentence(),
                } as ITextObject,
                initialValue: faker.lorem.sentence(),
            };

            const targetInput: BlockKitPlainTextInput = {
                type: 'plain_text_input',
                action_id: sourceInput.actionId,
                placeholder: {
                    type: sourceInput.placeholder.type,
                    text: sourceInput.placeholder.text,
                } as BlockKitPlainTextElement,
                initial_value: sourceInput.initialValue,
            };

            const converted: BlockKitPlainTextInput = convertToBlockKit(sourceInput);
            expect(isUIKitPlainTextInput(converted)).to.be.false;
            expect(converted).to.deep.equal(targetInput);
        });
    });
});
