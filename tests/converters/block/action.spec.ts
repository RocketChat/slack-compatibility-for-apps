import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
    BlockElementType,
    BlockType,
    IActionsBlock as UIKitActionsBlock,
    ITextObject as UIKitTextObject,
    TextObjectType,
    IButtonElement as UIKitButtonElement,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    ActionsBlock as BlockKitActionsBlock,
    Button as BlockKitButtonElement,
} from '../../../vendor/slack-types';
import {
    convertToUIKit,
    convertToBlockKit,
    isUIKitActionsBlock,
} from '../../../src/converters/blocks/action';

describe('Actions Block data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert an actions block from slack to rocket.chat format', () => {
            const sourceButton: BlockKitButtonElement = {
                type: 'button',
                action_id: 'button-1',
                text: {
                    type: 'plain_text',
                    text: 'button 1',
                    emoji: true
                },
                value: 'button 1'
            };

            const sourceBlock: BlockKitActionsBlock = {
                type: 'actions',
                block_id: 'action-block',
                elements: [sourceButton],
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

            const targetBlock: UIKitActionsBlock = {
                type: BlockType.ACTIONS,
                blockId: sourceBlock.block_id,
                elements: [targetButton],
            };

            const converted: UIKitActionsBlock = convertToUIKit(sourceBlock);
            expect(isUIKitActionsBlock(converted)).to.be.true;
            expect(converted).to.deep.equal(targetBlock);
        });
    });
    describe('From UI Kit to Block Kit', () => {
        it('should convert an actions block from rocket.chat to slack format', () => {
            const sourceButton: UIKitButtonElement = {
                type: BlockElementType.BUTTON,
                actionId: 'button-1',
                text: {
                    type: 'plain_text',
                    text: 'button 1',
                    emoji: true
                } as UIKitTextObject,
                value: 'button 1'
            };

            const sourceBlock: UIKitActionsBlock = {
                type: BlockType.ACTIONS,
                blockId: 'action-block',
                elements: [sourceButton],
            };

            const targetButton: BlockKitButtonElement = {
                type: 'button',
                action_id: sourceButton.actionId,
                value: sourceButton.value,
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: sourceButton.text.text,
                    emoji: sourceButton.text.emoji,
                },
            };

            const targetBlock: BlockKitActionsBlock = {
                type: 'actions',
                block_id: sourceBlock.blockId,
                elements: [targetButton],
            };

            const converted: BlockKitActionsBlock = convertToBlockKit(sourceBlock);
            expect(isUIKitActionsBlock(converted)).to.be.false;
            expect(converted).to.deep.equal(targetBlock);
        });
    });
});
