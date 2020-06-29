import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as faker from 'faker';
import { ImageBlock as BlockKitImageBlock } from '../../../vendor/slack-types';
import {
    IImageBlock as UIKitImageBlock,
    BlockType,
    ITextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    convertToUIKit,
    convertToBlockKit,
} from '../../../src/converters/blocks/image';

describe('Image Block data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert an image block from slack to rocket.chat format', () => {
            const sourceBlock: BlockKitImageBlock = {
                type: 'image',
                image_url: faker.internet.url(),
                alt_text: faker.lorem.sentence(),
            };

            const targetBlock: UIKitImageBlock = {
                type: BlockType.IMAGE,
                imageUrl: sourceBlock.image_url,
                altText: sourceBlock.alt_text
            };

            const converted = convertToUIKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });

        it('should convert an image block with `title` from slack to rocket.chat format', () => {
            const sourceBlock: BlockKitImageBlock = {
                type: 'image',
                image_url: faker.internet.url(),
                alt_text: faker.lorem.sentence(),
                title: {
                    type: 'plain_text',
                    text: faker.lorem.sentence(),
                },
            };

            const targetBlock: UIKitImageBlock = {
                type: BlockType.IMAGE,
                imageUrl: sourceBlock.image_url,
                altText: sourceBlock.alt_text,
                title: {
                    type: TextObjectType.PLAINTEXT,
                    text: sourceBlock.title.text,
                } as ITextObject,
            };

            const converted = convertToUIKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });
    });

    describe('From UIKit to Block Kit', () => {
        it('should convert an image block from rocket.chat to slack format', () => {
            const sourceBlock: UIKitImageBlock = {
                type: BlockType.IMAGE,
                imageUrl: faker.internet.url(),
                altText: faker.lorem.sentence(),
            };

            const targetBlock: BlockKitImageBlock = {
                type: 'image',
                image_url: sourceBlock.imageUrl,
                alt_text: sourceBlock.altText
            };

            const converted = convertToBlockKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });

        it('should convert an image block with `title` from rocket.chat to slack format', () => {
            const sourceBlock: UIKitImageBlock = {
                type: BlockType.IMAGE,
                imageUrl: faker.internet.url(),
                altText: faker.lorem.sentence(),
                title: {
                    type: TextObjectType.PLAINTEXT,
                    text: faker.lorem.sentence(),
                } as ITextObject,
            };

            const targetBlock: BlockKitImageBlock = {
                type: 'image',
                image_url: sourceBlock.imageUrl,
                alt_text: sourceBlock.altText,
                title: {
                    type: 'plain_text',
                    text: sourceBlock.title.text,
                },
            };

            const converted = convertToBlockKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });
    });
});
