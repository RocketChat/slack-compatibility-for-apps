import {
    BlockType,
    IActionsBlock,
    IBlock,
    IContextBlock,
    IDividerBlock,
    IImageBlock,
    ISectionBlock,
    IUIKitView,
    UIKitViewType,
    IInputBlock,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    Block,
} from '../../vendor/slack-types';
import { convertToBlockKit as convertActionBlockToBlockKit } from './blocks/action';
import { convertToBlockKit as convertSectionBlockToBlockKit } from './blocks/section';
import { convertToBlockKit as convertDiviverBlockToBlockKit } from './blocks/divider';
import { convertToBlockKit as convertImageBlockToBlockKit } from './blocks/image';
import { convertToBlockKit as convertContextBlockToBlockKit } from './blocks/context';
import { convertToBlockKit as convertInputBlockToBlockKit } from './blocks/input';
import { convertUIKitViewStateToBlockKit } from './view/viewStateConverter';
import { IBlockKitView } from '../customTypes/slack';

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
            case BlockType.INPUT:
                return convertInputBlockToBlockKit(block as IInputBlock);
            default:
                // @NOTE this will be dropped when filtering for truthy values
                return null;
        }
    })
        .filter(block => block) as Array<Block>;
}

export function convertViewToBlockKit(view: IUIKitView): IBlockKitView {
    if (!view) return {} as IBlockKitView;

    const { id, type, title, blocks, close, submit, state, clearOnClose, notifyOnClose } = view;

    return {
        id,
        type: type === UIKitViewType.MODAL ? 'modal' : 'home',
        title: {
            ...title,
            type: 'plain_text',
        },
        blocks: convertBlocksToBlockKit(blocks),
        close: close && { ...close.text, type: 'plain_text' },
        submit: submit && { ...submit.text, type: 'plain_text' },
        clear_on_close: clearOnClose,
        notify_on_close: notifyOnClose,
        state: state && convertUIKitViewStateToBlockKit(state, blocks),
    };
}
