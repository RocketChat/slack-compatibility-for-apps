import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as faker from 'faker';

import { ImageConverter } from '../../../src/converters/elements/image';
import { ImageElement as BlockKitImageElement } from '@slack/types';
import { 
    BlockElementType,
    IImageElement as UIKitImageElement,
} from '@rocket.chat/apps-engine/definition/uikit';


describe('Image data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert an image from slack to rocket.chat format', () => {
            const sourceElement: BlockKitImageElement = {
                type: 'image',
                image_url: faker.internet.url(),
                alt_text: faker.lorem.word(),
            };

            const targetElement: UIKitImageElement = {
                type: BlockElementType.IMAGE,
                imageUrl: sourceElement.image_url,
                altText: sourceElement.alt_text,
            };

            const converted: UIKitImageElement = new ImageConverter(sourceElement).convertToUIKit();
            expect(converted).to.deep.equal(targetElement);
        });

    });

    describe('From UIKit to Block Kit', () => {
        it('should convert an image from rocket.chat to slack format', () => {
            const sourceElement: UIKitImageElement = {
                type: BlockElementType.IMAGE,
                imageUrl: faker.internet.url(),
                altText: faker.lorem.word(),
            };

            const targetElement: BlockKitImageElement = {
                type: 'image',
                image_url: sourceElement.imageUrl,
                alt_text: sourceElement.altText,
            };

            const converted: BlockKitImageElement = new ImageConverter(sourceElement).convertToBlockKit();
            expect(converted).to.deep.equal(targetElement);
        });
    })
});
