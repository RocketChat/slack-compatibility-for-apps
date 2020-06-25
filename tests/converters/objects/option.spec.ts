import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as faker from 'faker';

import {
    convertToUIKit,
    convertToBlockKit,
} from '../../../src/converters/objects/option';
import {
    Option as BlockKitOptionObject,
    PlainTextElement as BlockKitPlainText,
    MrkdwnElement as BlockKitMrkdwnText
} from '../../../vendor/slack-types';
import {
    IOptionObject as UIKitOptionObject,
    ITextObject as UIKitTextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';

describe('Option Object data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert an option object with plain text from slack to rocket.chat format', () => {
            const sourceOption: BlockKitOptionObject  = {
                text: {
                    type: 'plain_text',
                    text: faker.lorem.text(),
                } as BlockKitPlainText,
                description: {
                    type: 'plain_text',
                    text: faker.lorem.text(),
                } as BlockKitPlainText,
                value: faker.random.word(),
                url: faker.internet.url(),
            };

            const targetOption: UIKitOptionObject = {
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: sourceOption.text.text,
                } as UIKitTextObject,
                value: sourceOption.value,
            };

            const converted = convertToUIKit(sourceOption);
            expect(converted).to.deep.equal(targetOption);
        });

        it('should convert an option object with mrkdwn from slack to rocket.chat format', () => {
            const sourceOption: BlockKitOptionObject  = {
                text: {
                    type: 'mrkdwn',
                    text: faker.lorem.text(),
                    verbatim: true,
                } as BlockKitMrkdwnText,
                description: {
                    type: 'plain_text',
                    text: faker.lorem.text(),
                } as BlockKitPlainText,
                value: faker.random.word(),
            };

            const targetOption: UIKitOptionObject = {
                text: {
                    type: TextObjectType.MARKDOWN,
                    text: sourceOption.text.text,
                } as UIKitTextObject,
                value: sourceOption.value,
            };

            const converted = convertToUIKit(sourceOption);
            expect(converted).to.deep.equal(targetOption);
        });
    });

    describe('From UIKit to Block Kit', () => {
        it('should convert an option object with plain text from rocket.chat to slack format', () => {
            const sourceOption: UIKitOptionObject = {
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: faker.lorem.sentence(),
                } as UIKitTextObject,
                value: faker.random.word(),
            };

            const targetOption: BlockKitOptionObject = {
                text: {
                    type: 'plain_text',
                    text: sourceOption.text.text,
                },
                value: sourceOption.value,
            };

            const converted = convertToBlockKit(sourceOption);
            expect(converted).to.deep.equal(targetOption);
        });

        it('should convert an option object with mrkdwn from rocket.chat to slack format', () => {
            const sourceOption: UIKitOptionObject = {
                text: {
                    type: TextObjectType.MARKDOWN,
                    text: faker.lorem.sentence(),
                } as UIKitTextObject,
                value: faker.random.word(),
            };

            const targetOption: BlockKitOptionObject = {
                text: {
                    type: 'mrkdwn',
                    text: sourceOption.text.text,
                },
                value: sourceOption.value,
            };
            const converted = convertToBlockKit(sourceOption);
            expect(converted).to.deep.equal(targetOption);
        });
    });
});
