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
            const opt: BlockKitOptionObject  = {
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

            const converted = convertToUIKit(opt);
            expect(converted).to.deep.equal({
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: opt.text.text,
                } as UIKitTextObject,
                value: opt.value,
            });
        });

        it('should convert an option object with mrkdwn from slack to rocket.chat format', () => {
            const opt: BlockKitOptionObject  = {
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

            const converted = convertToUIKit(opt);
            expect(converted).to.deep.equal({
                text: {
                    type: TextObjectType.MARKDOWN,
                    text: opt.text.text,
                } as UIKitTextObject,
                value: opt.value,
            });
        });
    });

    describe('From UIKit to Block Kit', () => {
        it('should convert an option object with plain text from rocket.chat to slack format', () => {
            const opt: UIKitOptionObject = {
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: faker.lorem.sentence(),
                } as UIKitTextObject,
                value: faker.random.word(),
            };

            const converted = convertToBlockKit(opt);
            expect(converted).to.deep.equal({
                text: {
                    type: 'plain_text',
                    text: opt.text.text,
                },
                value: opt.value,
            });
        });

        it('should convert an option object with mrkdwn from rocket.chat to slack format', () => {
            const opt: UIKitOptionObject = {
                text: {
                    type: TextObjectType.MARKDOWN,
                    text: faker.lorem.sentence(),
                } as UIKitTextObject,
                value: faker.random.word(),
            };

            const converted = convertToBlockKit(opt);
            expect(converted).to.deep.equal({
                text: {
                    type: 'mrkdwn',
                    text: opt.text.text,
                },
                value: opt.value,
            });
        });
    });
});
