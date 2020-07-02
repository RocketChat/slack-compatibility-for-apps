import { expect } from 'chai';

import { BlockType, IInputBlock, IUIKitView, TextObjectType } from '@rocket.chat/apps-engine/definition/uikit';

import { convertViewToUIKit } from '../../src/converters/BlockKitToUIKit';
import { convertViewToBlockKit } from '../../src/converters/UIKitToBlockKit';
import { BlockKitInputBlockElementType, IBlockKitView } from '../../src/customTypes/slack';
import { mockBlockKitView, mockUIKitView } from '../__mocks__/view/mockView';

describe('View converters', () => {
    describe('UIKit -> BlockKit', () => {
        it('should convert UIKit view to BlockKit', () => {
            const mockCompatibleBlockKitView: Partial<IBlockKitView> = JSON.parse(JSON.stringify(mockBlockKitView));

            delete mockCompatibleBlockKitView.private_metadata;
            mockCompatibleBlockKitView.blocks = mockCompatibleBlockKitView.blocks.slice(0, 3);
            mockCompatibleBlockKitView.blocks.forEach((block: any) =>
                block.element.type === BlockKitInputBlockElementType.PLAIN_TEXT_INPUT && delete block.element.multiline
            );

            expect(convertViewToBlockKit(mockUIKitView)).to.deep.equal(mockCompatibleBlockKitView);
        });
    });

    describe('BlockKit -> UIKit', () => {
        it('it should convert BlockKit view to UIKit', () => {
            const mockCompatibleUIKitView: IUIKitView = JSON.parse(JSON.stringify(mockUIKitView));

            mockCompatibleUIKitView.blocks = (mockCompatibleUIKitView.blocks as Array<IInputBlock>).concat([
                {
                    blockId: 'block-multi-users-select',
                    element: {} as any,
                    label: {
                        emoji: true,
                        text: 'Multiple Users Select',
                        type: TextObjectType.PLAINTEXT,
                    },
                    type: BlockType.INPUT,
                },
                {
                    blockId: 'block_datepciker',
                    element: {} as any,
                    label: {
                        emoji: true,
                        text: 'Date Picker',
                        type: TextObjectType.PLAINTEXT,
                    },
                    type: BlockType.INPUT,
                },
                {
                    blockId: 'block_checkboxes',
                    element: {} as any,
                    label: {
                        emoji: true,
                        text: 'Checkboxes',
                        type: TextObjectType.PLAINTEXT,
                    },
                    type: BlockType.INPUT,
                },
                {
                    blockId: 'block_radio-buttons',
                    element: {} as any,
                    label: {
                        emoji: true,
                        text: 'Radio Buttons',
                        type: TextObjectType.PLAINTEXT,
                    },
                    type: BlockType.INPUT,
                }
            ]);

            const convertedView = convertViewToUIKit(mockBlockKitView, mockUIKitView.appId);

            // actionId is randomly generated by uuid.v1(), so skip it.
            convertedView.close.actionId = mockCompatibleUIKitView.close.actionId;
            convertedView.submit.actionId = mockCompatibleUIKitView.submit.actionId;

            expect(convertedView).to.deep.equal(mockCompatibleUIKitView);
        });
    });
});