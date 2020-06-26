import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
    convertToUIKit,
    convertToBlockKit,
} from '../../../src/converters/objects/text';
import {
    ITextObject as UIKitTextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    PlainTextElement as BlockKitPlainText,
    MrkdwnElement as BlockKitMrkdwnText,
} from '../../../vendor/slack-types';

describe('Text Object data structure converter', () => {
    describe('From  Block Kit to UIKit', () => {
        it('should convert a plain text object from slack to rocket.chat format', () => {
            const sourceText: BlockKitPlainText = {
                type: 'plain_text',
                text: 'This is a plain text section block.',
                emoji: true
            };

            const targetText: UIKitTextObject= {
                type: TextObjectType.PLAINTEXT,
                text: sourceText.text,
                emoji: sourceText.emoji,
            }

            const converted = convertToUIKit(sourceText);
            expect(converted).to.deep.equal(targetText);
        });

        it('should convert a mrkdwn text object from slack to rocket.chat format', () => {
            const sourceText: BlockKitMrkdwnText = {
                type: 'mrkdwn',
                text: 'This is a mrkdwn text section block.',
                verbatim: true
            };

            const targetText: UIKitTextObject = {
                type: TextObjectType.MARKDOWN,
                text: sourceText.text
            };

            const converted = convertToUIKit(sourceText);
            expect(converted).to.deep.equal(targetText);
        });
    });

    describe('From UIKit to Block Kit', () => {
        it('should convert a plain text object from rocket.chat to slack format', () => {
            const sourceText: UIKitTextObject = {
                type: TextObjectType.PLAINTEXT,
                text: 'This is a *markdown text* section block.',
                emoji: true
            };

            const targetText: BlockKitPlainText = {
                type: 'plain_text',
                text: sourceText.text,
                emoji: sourceText.emoji,
            };

            const converted = convertToBlockKit(sourceText);
            expect(converted).to.deep.equal(targetText);
        });

        it('should convert a mrkdwn text object from rocket.chat to slack format', () => {
            const sourceText: UIKitTextObject = {
                type: TextObjectType.MARKDOWN,
                text: 'This is a *markdown text* section block.',
                emoji: true
            };

            const targetText: BlockKitMrkdwnText = {
                type: 'mrkdwn',
                text: sourceText.text,
            };

            const converted = convertToBlockKit(sourceText);
            expect(converted).to.deep.equal(targetText);
        });
    });
});
