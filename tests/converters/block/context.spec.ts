import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as faker from 'faker';
import {
    ContextBlock as BlockKitContextBlock,
    ImageElement as BlockKitImageElement,
    PlainTextElement as BlockKitPlainTextElement,
    MrkdwnElement as BlockKitMarkdownElement,
} from '../../../vendor/slack-types';
import {
    BlockElementType,
    BlockType,
    IContextBlock as UIKitContextBlock,
    IImageElement as UIKitImageElement,
    ITextObject as UIKitTextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    convertToUIKit,
    convertToBlockKit,
} from '../../../src/converters/blocks/context';

describe('Context Block data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert a context block from slack to rocket.chat format', () => {
            const sourcePlainText: BlockKitPlainTextElement = {
                type: 'plain_text',
                text: faker.lorem.sentence(),
                emoji: false,
            };

            const sourceMrkdwn: BlockKitMarkdownElement = {
                type: 'mrkdwn',
                text: faker.lorem.sentence(),
            };

            const sourceImageElement: BlockKitImageElement = {
                type: 'image',
                image_url: faker.internet.url(),
                alt_text: faker.lorem.sentence(),
            };

            const sourceBlock: BlockKitContextBlock = {
                type: 'context',
                block_id: faker.random.uuid(),
                elements: [
                    sourcePlainText,
                    sourceImageElement,
                    sourceMrkdwn,
                ],
            };

            const targetBlock: UIKitContextBlock = {
                type: BlockType.CONTEXT,
                blockId: sourceBlock.block_id,
                elements: [
                    {
                        type: TextObjectType.PLAINTEXT,
                        text: sourcePlainText.text,
                        emoji: sourcePlainText.emoji,
                    } as UIKitTextObject,
                    {
                        type: BlockElementType.IMAGE,
                        imageUrl: sourceImageElement.image_url,
                        altText: sourceImageElement.alt_text,
                    } as UIKitImageElement,
                    {
                        type: TextObjectType.MARKDOWN,
                        text: sourceMrkdwn.text,
                    } as UIKitTextObject,
                ],
            };

            const converted = convertToUIKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });
    });

    describe('From UIKit to Block Kit', () => {
        it('should convert a context block from rocket.chat to slack format', () => {
            const sourcePlainText: UIKitTextObject = {
                type: TextObjectType.PLAINTEXT,
                text: faker.lorem.sentence(),
                emoji: true,
            };

            const sourceMrkdwn: UIKitTextObject = {
                type: TextObjectType.MARKDOWN,
                text: faker.lorem.sentence(),
            };

            const sourceImageElement: UIKitImageElement = {
                type: BlockElementType.IMAGE,
                imageUrl: faker.internet.url(),
                altText: faker.lorem.sentence(),
            };

            const sourceBlock:  UIKitContextBlock = {
                type: BlockType.CONTEXT,
                blockId: faker.random.uuid(),
                elements: [
                    sourcePlainText,
                    sourceImageElement,
                    sourceMrkdwn,
                ],
            };

            const targetBlock: BlockKitContextBlock = {
                type: 'context',
                block_id: sourceBlock.blockId,
                elements: [
                    {
                        type: 'plain_text',
                        text: sourcePlainText.text,
                        emoji: sourcePlainText.emoji,
                    } as BlockKitPlainTextElement,
                    {
                        type: 'image',
                        image_url: sourceImageElement.imageUrl,
                        alt_text: sourceImageElement.altText,
                    } as BlockKitImageElement,
                    {
                        type: 'mrkdwn',
                        text: sourceMrkdwn.text,
                    } as BlockKitMarkdownElement,
                ]
            };

            const converted = convertToBlockKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });
    });
});
