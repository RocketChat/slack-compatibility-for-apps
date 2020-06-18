import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
    BlockElementType,
    BlockType,
    IActionsBlock as UIKitActionsBlock,
    ITextObject as UIKitTextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';
import { ActionsBlock as BlockKitActionsBlock } from '@slack/types';

describe('Button data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert am actions block from slack to rocket.chat format', () => {
            const sourceBlock: BlockKitActionsBlock = {
                type: 'actions',
                block_id: 'action-block',
                elements: [
                    {
                        type: 'button',
                        action_id: 'button-1',
                        text: {
                            type: 'plain_text',
                            text: 'button 1',
                            emoji: true
                        },
                        value: 'button 1'
                    },
                ],
            };

            const targetBlock: UIKitActionsBlock = {
                type: BlockType.ACTIONS,
                blockId: sourceBlock.block_id,
                elements: [
                    {
                        type: BlockElementType.BUTTON,
                        actionId: sourceBlock.elements[0].action_id,
                        value: sourceButton.value,
                        text: {
                            type: TextObjectType.PLAINTEXT,
                            text: sourceButton.text.text,
                            emoji: sourceButton.text.emoji,
                        } as UIKitTextObject,
                    }
                ]
            };

            const converted: UIKitActionsBlock = convertToUIKit(sourceBlock);
            expect(isUIKitActionsBlock(converted)).to.be.true;
            expect(converted).to.deep.equal(targetBlock);
        });
    });
    describe('From UI Kit to Block Kit', () => {
        it('should convert an actions block from rocket.chat to slack format', () => {});
    });
});
