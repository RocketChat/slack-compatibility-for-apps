import {
    Block,
    ActionsBlock,
    SectionBlock,
    DividerBlock,
    ImageBlock,
    ContextBlock,
    View,
} from '../../vendor/slack-types';
import { IBlock, IUIKitView } from '@rocket.chat/apps-engine/definition/uikit';
import { convertToUIKit as convertActionBlockToUIKit } from './blocks/action';
import { convertToUIKit as convertSectionBlockToUIKit } from './blocks/section';
import { convertToUIKit as convertDiviverBlockToUIKit } from './blocks/divider';
import { convertToUIKit as convertImageBlockToUIKit } from './blocks/image';
import { convertToUIKit as convertContextBlockToUIKit } from './blocks/context';

export function convertBlocksToUIKit(blocks?: Array<Block>): Array<IBlock> {
    if (!Array.isArray(blocks)) return [];

    return blocks.map((block) => {
        switch (block.type) {
            case 'action':
                return convertActionBlockToUIKit(block as ActionsBlock);
            case 'section':
                return convertSectionBlockToUIKit(block as SectionBlock);
            case 'divider':
                return convertDiviverBlockToUIKit(block as DividerBlock);
            case 'image':
                return convertImageBlockToUIKit(block as ImageBlock);
            case 'context':
                return convertContextBlockToUIKit(block as ContextBlock);
            default:
                // @NOTE this will be dropped when filtering for truthy values
                return null;
        }
    })
    .filter(block => block) as Array<IBlock>;
}


export function convertViewToUIKit(view: View): IUIKitView {
    // todo(shiqi.mei) implement it
    return {} as IUIKitView;
}
