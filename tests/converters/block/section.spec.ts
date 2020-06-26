import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as faker from 'faker';
import {
    SectionBlock as BlockKitSectionBlock,
    PlainTextElement as BlockKitPlainTextElement,
    ImageElement as BlockKitImageElement,
} from '../../../vendor/slack-types';
import { ISectionBlock as UIKitSectionBlock,
    BlockType,
    TextObjectType,
    ITextObject as UIKitTextObject,
    BlockElementType,
    IImageElement as UIKitImageElement,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    convertToUIKit,
    convertToBlockKit,
} from '../../../src/converters/blocks/section';

describe('Section Block data structure converter', () => {
    describe('From Block Ki to UIKit', () => {
        it('should convert a simple section block from slack to rocket.chat format', () => {
            const sourceText: BlockKitPlainTextElement = {
                type:  'plain_text',
                text: faker.lorem.sentence(),
                emoji: false,
            };

            const sourceBlock: BlockKitSectionBlock = {
                type: 'section',
                text: sourceText,
            }

            const targetBlock: UIKitSectionBlock = {
                type: BlockType.SECTION,
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: sourceText.text,
                    emoji: sourceText.emoji,
                } as UIKitTextObject
            };

            const converted = convertToUIKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });

        it('should convert a section block with accessory from slack to rocket.chat format', () => {
            const sourceText: BlockKitPlainTextElement = {
                type:  'plain_text',
                text: faker.lorem.sentence(),
                emoji: false,
            };

            const sourceImageElement: BlockKitImageElement = {
                type: 'image',
                image_url: faker.internet.url(),
                alt_text: faker.lorem.sentence(),
            };

            const sourceBlock: BlockKitSectionBlock = {
                type: 'section',
                text: sourceText,
                accessory: sourceImageElement,
            };

            const targetBlock: UIKitSectionBlock = {
                type: BlockType.SECTION,
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: sourceText.text,
                    emoji: sourceText.emoji,
                } as UIKitTextObject,
                accessory: {
                    type: BlockElementType.IMAGE,
                    imageUrl: sourceImageElement.image_url,
                    altText: sourceImageElement.alt_text,
                } as UIKitImageElement,
            };

            const converted = convertToUIKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });

        it('should convert a section block with `fields` from slack to rocket.chat format', () => {
            const sourceText: BlockKitPlainTextElement = {
                type:  'plain_text',
                text: faker.lorem.sentence(),
                emoji: false,
            };

            const sourceBlock: BlockKitSectionBlock = {
                type: 'section',
                text: sourceText,
                fields: [sourceText],
            };

            const targetBlock: UIKitSectionBlock = {
                type: BlockType.SECTION,
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: sourceText.text,
                    emoji: sourceText.emoji,
                } as UIKitTextObject,
            };

            const converted = convertToUIKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });
    });

    describe('From UIKit to Block Kit', () => {
        it('should convert a simple section block from rocket.chat to slack format', () => {
            const sourceText: UIKitTextObject = {
                type: TextObjectType.PLAINTEXT,
                text: faker.lorem.sentence(),
                emoji: false,
            };

            const sourceBlock: UIKitSectionBlock = {
                type: BlockType.SECTION,
                text: sourceText,
            };

            const targetBlock: BlockKitSectionBlock = {
                type: 'section',
                text: {
                    type: sourceText.type,
                    text: sourceText.text,
                    emoji: sourceText.emoji,
                }  as BlockKitPlainTextElement,
            };

            const converted = convertToBlockKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });

        it('should convert a section block with  accessory from rocket.chat to slack format', () => {
            const sourceText: UIKitTextObject = {
                type: TextObjectType.PLAINTEXT,
                text: faker.lorem.sentence(),
                emoji: false,
            };

            const sourceImageElement: UIKitImageElement = {
                type: BlockElementType.IMAGE,
                imageUrl: faker.internet.url(),
                altText: faker.lorem.sentence(),
            };

            const sourceBlock: UIKitSectionBlock = {
                type: BlockType.SECTION,
                text: sourceText,
                accessory: sourceImageElement,
            };

            const targetBlock: BlockKitSectionBlock = {
                type: 'section',
                text: {
                    type: sourceText.type,
                    text: sourceText.text,
                    emoji: sourceText.emoji,
                }  as BlockKitPlainTextElement,
                accessory: {
                    type: sourceImageElement.type,
                    image_url: sourceImageElement.imageUrl,
                    alt_text: sourceImageElement.altText,
                } as BlockKitImageElement,
            };

            const converted = convertToBlockKit(sourceBlock);
            expect(converted).to.deep.equal(targetBlock);
        });
    });
});
