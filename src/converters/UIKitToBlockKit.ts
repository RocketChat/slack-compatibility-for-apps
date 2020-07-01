import {
    BlockType,
    IActionsBlock,
    IBlock,
    IContextBlock,
    IDividerBlock,
    IImageBlock,
    ISectionBlock,
    IUIKitView,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    Block,
    View,
} from '../../vendor/slack-types';
import { convertToBlockKit as convertActionBlockToBlockKit } from './blocks/action';
import { convertToBlockKit as convertSectionBlockToBlockKit } from './blocks/section';
import { convertToBlockKit as convertDiviverBlockToBlockKit } from './blocks/divider';
import { convertToBlockKit as convertImageBlockToBlockKit } from './blocks/image';
import { convertToBlockKit as convertContextBlockToBlockKit } from './blocks/context';

export function convertBlocksToBlockKit(blocks: Array<IBlock>): Array<Block> {
    return blocks.map((block) => {
        switch (block.type) {
            case BlockType.ACTIONS:
                return convertActionBlockToBlockKit(block as IActionsBlock);
            case BlockType.SECTION:
                return convertSectionBlockToBlockKit(block as ISectionBlock);
            case BlockType.DIVIDER:
                return convertDiviverBlockToBlockKit(block as IDividerBlock);
            case BlockType.IMAGE:
                return convertImageBlockToBlockKit(block as IImageBlock);
            case BlockType.CONTEXT:
                return convertContextBlockToBlockKit(block as IContextBlock);
            default:
                // @NOTE this will be dropped when filtering for truthy values
                return null;
        }
    })
    .filter(block => block) as Array<Block>;
}

export function convertViewToBlockKit(view: IUIKitView): View {
    // todo(shiqi.mei) implement it
    return {} as View;
}
