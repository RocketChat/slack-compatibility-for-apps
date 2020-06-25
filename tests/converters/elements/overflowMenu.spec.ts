import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as faker from 'faker';

import {
    convertToUIKit,
    convertToBlockKit,
} from '../../../src/converters/elements/overflowMenu';
import { Overflow as BlockKitOverflowMenuElement } from '../../../vendor/slack-types';
import {
    BlockElementType,
    IOptionObject as UIKitOptionObject,
    IOverflowMenuElement as UIKitOverflowMenuElement,
    ITextObject as UIKitTextObject,
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';


describe('Overflow Menu data structure converter', () => {
    describe('From Block Kit to UIKit', () => {
        it('should convert a overflow menu from slack to rocket.chat format', () => {
            const sourceElement: BlockKitOverflowMenuElement = {
                action_id: faker.random.word(),
                type: 'overflow',
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: '*this is plain_text text*',
                            emoji: true
                        },
                        value: 'value-0'
                    },
                    {
                        text: {
                            type: 'plain_text',
                            text: '*this is plain_text text*',
                            emoji: true
                        },
                        value: 'value-1'
                    },
                ]
            };

            const targetElement: UIKitOverflowMenuElement = {
                actionId: sourceElement.action_id,
                type: BlockElementType.OVERFLOW_MENU,
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: '*this is plain_text text*',
                            emoji: true
                        } as UIKitTextObject,
                        value: 'value-0'
                    } as UIKitOptionObject,
                    {
                        text: {
                            type: 'plain_text',
                            text: '*this is plain_text text*',
                            emoji: true
                        } as UIKitTextObject,
                        value: 'value-1'
                    } as UIKitOptionObject,
                ],
            };

            const converted: UIKitOverflowMenuElement = convertToUIKit(sourceElement);
            expect(converted).to.deep.equal(targetElement);
        });
    });

    describe('From UIKit to Block Kit', () => {
        it('should convert a overflow menu from rocket.chat to slack format', () => {
            const sourceElement: UIKitOverflowMenuElement = {
                type: BlockElementType.OVERFLOW_MENU,
                actionId: faker.random.word(),
                options: [
                    {
                        text: {
                            type: TextObjectType.PLAINTEXT,
                            text: '*this is plain_text text*',
                            emoji: true
                        } as UIKitTextObject,
                        value: 'value-0'
                    } as UIKitOptionObject,
                    {
                        text: {
                            type: TextObjectType.PLAINTEXT,
                            text: '*this is plain_text text*',
                            emoji: true
                        } as UIKitTextObject,
                        value: 'value-1'
                    } as UIKitOptionObject,
                ]
            };

            const targetElement: BlockKitOverflowMenuElement = {
                action_id: sourceElement.actionId,
                type: sourceElement.type,
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: '*this is plain_text text*',
                            emoji: true
                        },
                        value: 'value-0'
                    },
                    {
                        text: {
                            type: 'plain_text',
                            text: '*this is plain_text text*',
                            emoji: true
                        },
                        value: 'value-1'
                    },
                ]
            };

            const converted = convertToBlockKit(sourceElement);
            expect(converted).to.deep.equal(targetElement);
        });
    });
});
