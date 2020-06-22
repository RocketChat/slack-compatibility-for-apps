import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
    convertToBlockKit,
    convertToUIKit,
    isUIKitButton,
} from '../../../src/converters/elements/button';
import {
    Button as BlockKitButtonElement,
    PlainTextElement as BlockKitPlainText,
} from '../../../vendor/slack-types';

import {
    BlockElementType,
    IButtonElement as UIKitButtonElement,
    ITextObject as UIKitTextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';

describe('Button data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert a button from slack to rocket.chat format', () => {
            const sourceButton: BlockKitButtonElement = {
                type: 'button',
                action_id: 'button',
                text: {
                    type: 'plain_text',
                    text: 'Click Me',
                    emoji: true
                } as BlockKitPlainText,
                value: 'click_me_123'
            };

            const targetButton: UIKitButtonElement = {
                type: BlockElementType.BUTTON,
                actionId: sourceButton.action_id,
                value: sourceButton.value,
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: sourceButton.text.text,
                    emoji: sourceButton.text.emoji,
                } as UIKitTextObject,
            };

            const converted: UIKitButtonElement = convertToUIKit(sourceButton);
            expect(isUIKitButton(converted)).to.be.true;
            expect(converted).to.deep.equal(targetButton);
        });
    });

    describe('From UI Kit to Block Kit', () => {
        it('should convert a button from rocket.chat to slack format', () => {
            const sourceButton: UIKitButtonElement = {
                type: BlockElementType.BUTTON,
                actionId: "button",
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: "Click Me",
                    emoji: true
                } as UIKitTextObject,
                value: "click_me_123"
            };

            const targetButton: BlockKitButtonElement = {
                type: BlockElementType.BUTTON,
                action_id: sourceButton.actionId,
                value: sourceButton.value,
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: sourceButton.text.text,
                    emoji: sourceButton.text.emoji,
                } as BlockKitPlainText,
            };

            const converted: BlockKitButtonElement = convertToBlockKit(sourceButton);
            expect(isUIKitButton(converted)).to.be.false;
            expect(converted).to.deep.equal(targetButton);
        });
    });
});
