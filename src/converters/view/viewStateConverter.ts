import { BlockType, IBlock, IInputBlock, IUIKitView, BlockElementType } from '@rocket.chat/apps-engine/definition/uikit';

import { IBlockKitView, BlockKitInputBlockElementType } from '../../customTypes/slack';
import { findInputBlockElementType } from '../../helpers';

export function convertBlockKitViewStateToUIKit(state: IBlockKitView['state']): IUIKitView['state'] {
    if (!state || !state.values) {
        return {} as IUIKitView['state'];
    }

    return Object.entries(state.values)
        .map(([blockId, action]) => ({
            [blockId]: Object.entries(action)
                .map(([actionId, { value }]) => ({ [actionId]: value }))
                .reduce((acc, cur) => Object.assign(acc, cur), {})
        }))
        .reduce((acc, cur) => Object.assign(acc, cur), {});
}

export function convertUIKitViewStateToBlockKit(state: IUIKitView['state'], blocks: Array<IBlock>): IBlockKitView['state'] {
    if (!state) {
        return { values: {} };
    }

    return {
        values: Object.entries(state)
            .map(([blockId, action]) => ({
                [blockId]: Object.entries(action)
                    .map(([actionId, value]: [string, any]) => ({
                        [actionId]: {
                            type: getBlockKitInputBlockElementType(blocks, blockId, actionId),
                            value
                        }
                    }))
                    .reduce((acc, cur) => Object.assign(acc, cur), {})
            }))
            .reduce((acc, cur) => Object.assign(acc, cur), {})
    };
}

function getBlockKitInputBlockElementType(blocks: Array<IBlock>, blockId: string, actionId: string): BlockKitInputBlockElementType | undefined {
    const inputBlocks = blocks.filter(({ type }) => type === BlockType.INPUT) as Array<IInputBlock>;
    const type = findInputBlockElementType(inputBlocks, blockId, actionId);

    switch (type) {
        case BlockElementType.PLAIN_TEXT_INPUT:
            return BlockKitInputBlockElementType.PLAIN_TEXT_INPUT;
        case BlockElementType.STATIC_SELECT:
            return BlockKitInputBlockElementType.STATIC_SELECT;
        case BlockElementType.MULTI_STATIC_SELECT:
            return BlockKitInputBlockElementType.MULTI_STATIC_SELECT;
        default:
            return undefined;
    }
}
