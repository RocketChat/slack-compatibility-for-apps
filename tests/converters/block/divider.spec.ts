import { expect } from 'chai';
import { describe, it } from 'mocha';
import { DividerBlock as BlockKitDividerBlock } from '../../../vendor/slack-types';
import { IDividerBlock as UIKitDividerBlock, BlockType } from '@rocket.chat/apps-engine/definition/uikit';
import {
    convertToUIKit,
    convertToBlockKit,
} from '../../../src/converters/blocks/divider';

describe('Divider Block data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert a divider block from slack to rocket.chat format', () => {
            const sourceBlock: BlockKitDividerBlock = {
                type: 'divider',
            };

            const targetBlock: UIKitDividerBlock = {
                type: BlockType.DIVIDER,
            };

            const converted = convertToUIKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });
    });

    describe('From UIKit to Block Kit', () => {
        it('should convert a divider block from rocket.chat to slack format', () => {
            const sourceBlock: UIKitDividerBlock = {
                type: BlockType.DIVIDER,
            };

            const targetBlock: BlockKitDividerBlock = {
                type: 'divider',
            };

            const converted = convertToBlockKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });
    });
});
