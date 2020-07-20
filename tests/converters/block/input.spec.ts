import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as faker from 'faker';
import {
    InputBlock as BlockKitInputBlock,
    PlainTextElement as BlockKitPlainTextElement,
    PlainTextInput as BlockKitPlainTextInputElement,
} from '../../../vendor/slack-types';
import {
    BlockType,
    IInputBlock as UIKitInputBlock,
    ITextObject as UIKitTextObject,
    TextObjectType,
    BlockElementType,
    IPlainTextInputElement as UIKitPlainTextInputElement,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    convertToUIKit,
    convertToBlockKit,
} from '../../../src/converters/blocks/input';

describe('Input Block data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert an input block from slack to rocket.chat format', () => {
            const sourceInput: BlockKitPlainTextInputElement = {
                type: 'plain_text_input',
                action_id: 'plain_input',
                placeholder: {
                    type: 'plain_text',
                    text: faker.lorem.sentence(),
                },
            };

            const sourceBlock: BlockKitInputBlock = {
                type: 'input',
                label:  {
                    type: 'plain_text',
                    text: faker.lorem.sentence(),
                    emoji: true,
                } as BlockKitPlainTextElement,
                element: sourceInput,
            };

            const targetBlock: UIKitInputBlock = {
                type: BlockType.INPUT,
                label: {
                    type: TextObjectType.PLAINTEXT,
                    text: sourceBlock.label.text,
                    emoji: sourceBlock.label.emoji,
                } as UIKitTextObject,
                element: {
                    type: BlockElementType.PLAIN_TEXT_INPUT,
                    actionId: sourceInput.action_id,
                    placeholder: {
                        type: TextObjectType.PLAINTEXT,
                        text: sourceInput.placeholder.text
                    },
                } as UIKitPlainTextInputElement,
            };

            const converted = convertToUIKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });
    });

    describe('From UIKit to Block Kit', () => {
        it('should convert an input block from rocket.chat to slack format', () => {
            const sourceInput: UIKitPlainTextInputElement = {
                type: BlockElementType.PLAIN_TEXT_INPUT,
                actionId: faker.random.uuid(),
                placeholder: {
                    type: TextObjectType.PLAINTEXT,
                    text: faker.lorem.sentence()
                },
            };

            const sourceBlock: UIKitInputBlock = {
                type: BlockType.INPUT,
                label: {
                    type: TextObjectType.PLAINTEXT,
                    text: faker.lorem.sentence(),
                    emoji: true,
                } as UIKitTextObject,
                element: sourceInput,
            }

            const targetBlock: BlockKitInputBlock = {
                type: 'input',
                label:  {
                    type: 'plain_text',
                    text: sourceBlock.label.text,
                    emoji: sourceBlock.label.emoji,
                } as BlockKitPlainTextElement,
                element: {
                    type: 'plain_text_input',
                    action_id: sourceInput.actionId,
                    placeholder: {
                        type: 'plain_text',
                        text: sourceInput.placeholder.text,
                    },
                } as BlockKitPlainTextInputElement,
            }

            const converted = convertToBlockKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });
    });
});
