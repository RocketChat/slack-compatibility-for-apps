import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as faker from 'faker';

import {
    convertToUIKit,
    convertToBlockKit,
} from '../../../src/converters/elements/staticSelect';
import {
    BlockElementType,
    IOptionObject as UIKitOptionObject,
    IStaticSelectElement as UIKitStaticSelectElement,
    ITextObject as UIKitTextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {

    StaticSelect as BlocKitStaticSelectElement,
    PlainTextElement as BlockKitPlainTextElement,
    Option as BlockKitOptionObject,
} from '../../../vendor/slack-types';

describe('Static Select data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert a static select from slack to rocket.chat format', () => {
            const sourceInitialOption = {
                text: {
                    type: 'plain_text',
                    text: faker.lorem.sentence(),
                    emoji: true
                } as BlockKitPlainTextElement,
                value: 'value-2'
            } as BlockKitOptionObject;

            const sourceElement: BlocKitStaticSelectElement = {
                action_id: 'abc',
                type: 'static_select',
                placeholder: {
                    type: 'plain_text',
                    text: faker.lorem.sentence(),
                    emoji: true,
                } as BlockKitPlainTextElement,
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: faker.lorem.sentence(),
                            emoji: true
                        } as BlockKitPlainTextElement,
                        value: 'value-1'
                    } as BlockKitOptionObject,
                    sourceInitialOption,
                    {
                        text: {
                            type: 'plain_text',
                            text: faker.lorem.sentence(),
                            emoji: true
                        } as BlockKitPlainTextElement,
                        value: 'value-3'
                    } as BlockKitOptionObject,
                ],
                initial_option: sourceInitialOption,
            };

            const targetElement: UIKitStaticSelectElement = {
                actionId: 'abc',
                type: BlockElementType.STATIC_SELECT,
                placeholder: {
                    type: TextObjectType.PLAINTEXT,
                    text: sourceElement.placeholder.text,
                    emoji: sourceElement.placeholder.emoji,
                } as UIKitTextObject,
                options: [
                    {
                        text: {
                            type: TextObjectType.PLAINTEXT,
                            text: sourceElement.options[0].text.text,
                            emoji: true
                        } as UIKitTextObject,
                        value: sourceElement.options[0].value,
                    } as UIKitOptionObject,
                    {
                        text: {
                            type: TextObjectType.PLAINTEXT,
                            text: sourceElement.options[1].text.text,
                            emoji: true
                        } as UIKitTextObject,
                        value: sourceElement.options[1].value,
                    } as UIKitOptionObject,
                    {
                        text: {
                            type: TextObjectType.PLAINTEXT,
                            text: sourceElement.options[2].text.text,
                            emoji: true
                        } as UIKitTextObject,
                        value: sourceElement.options[2].value,
                    } as UIKitOptionObject,
                ],
                initialValue: sourceInitialOption.value,
            };

            const converted = convertToUIKit(sourceElement);
            expect(converted).to.deep.equal(targetElement);
        });
    });
    describe('From UIKit to Block Kit', () => {
        it('should convert a static select from rocket.chat to slack format', () => {
            const sourceElement: UIKitStaticSelectElement = {
                actionId: 'abc',
                type: BlockElementType.STATIC_SELECT,
                placeholder: {
                    type: TextObjectType.PLAINTEXT,
                    text: faker.lorem.sentence(),
                    emoji: true,
                } as UIKitTextObject,
                options: [
                    {
                        text: {
                            type: TextObjectType.PLAINTEXT,
                            text: '*this is plain_text text*',
                            emoji: true
                        } as UIKitTextObject,
                        value: 'value-1'
                    } as UIKitOptionObject,
                    {
                        text: {
                            type: TextObjectType.PLAINTEXT,
                            text: '*this is plain_text text*',
                            emoji: true
                        } as UIKitTextObject,
                        value: 'value-2'
                    } as UIKitOptionObject,
                    {
                        text: {
                            type: TextObjectType.PLAINTEXT,
                            text: '*this is plain_text text*',
                            emoji: true
                        } as UIKitTextObject,
                        value: 'value-3'
                    } as UIKitOptionObject,
                ],
                initialValue: 'value-2',
            };

            const targetElement: BlocKitStaticSelectElement = {
                action_id: 'abc',
                type: 'static_select',
                placeholder: {
                    type: 'plain_text',
                    text: sourceElement.placeholder.text,
                    emoji: true,
                } as BlockKitPlainTextElement,
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: sourceElement.options[0].text.text,
                            emoji: true
                        } as BlockKitPlainTextElement,
                        value: sourceElement.options[0].value,
                    } as BlockKitOptionObject,
                    {
                        text: {
                            type: 'plain_text',
                            text: sourceElement.options[1].text.text,
                            'emoji': true
                        } as BlockKitPlainTextElement,
                        value: sourceElement.options[1].value,
                    } as BlockKitOptionObject,
                    {
                        text: {
                            type: 'plain_text',
                            text: sourceElement.options[2].text.text,
                            emoji: true
                        } as BlockKitPlainTextElement,
                        value: sourceElement.options[2].value,
                    } as BlockKitOptionObject,
                ],
                initial_option: {
                    text: {
                        type: 'plain_text',
                        text: sourceElement.options[1].text.text,
                        emoji: true
                    } as BlockKitPlainTextElement,
                    value: sourceElement.initialValue,
                } as BlockKitOptionObject,
            };

            const converted = convertToBlockKit(sourceElement);
            expect(converted).to.deep.equal(targetElement);
        });
    });
});

