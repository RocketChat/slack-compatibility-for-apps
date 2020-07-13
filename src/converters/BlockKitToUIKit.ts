import { uuid } from '../helpers';

import {
    Block,
    ActionsBlock,
    SectionBlock,
    DividerBlock,
    ImageBlock,
    ContextBlock,
    InputBlock,
} from '../../vendor/slack-types';
import { IBlock, IUIKitView, BlockType, BlockElementType, UIKitViewType, TextObjectType } from '@rocket.chat/apps-engine/definition/uikit';
import { convertToUIKit as convertActionBlockToUIKit } from './blocks/action';
import { convertToUIKit as convertSectionBlockToUIKit } from './blocks/section';
import { convertToUIKit as convertDiviverBlockToUIKit } from './blocks/divider';
import { convertToUIKit as convertImageBlockToUIKit } from './blocks/image';
import { convertToUIKit as convertContextBlockToUIKit } from './blocks/context';
import { convertToUIKit as convertInputBlockToUIKit } from './blocks/input';
import { convertToUIKit as convertTextToUIKit } from './objects/text';
import { IBlockKitView } from '../customTypes/slack';
import { convertBlockKitViewStateToUIKit } from './view/viewStateConverter';

export function convertBlocksToUIKit(blocks: Array<Block> | undefined, appId: string): Array<IBlock> {
    if (!Array.isArray(blocks)) return [];

    return blocks.map((block) => {
        switch (block.type) {
            case BlockType.ACTIONS:
                return convertActionBlockToUIKit(block as ActionsBlock);
            case BlockType.SECTION:
                return convertSectionBlockToUIKit(block as SectionBlock);
            case BlockType.DIVIDER:
                return convertDiviverBlockToUIKit(block as DividerBlock);
            case BlockType.IMAGE:
                return convertImageBlockToUIKit(block as ImageBlock);
            case BlockType.CONTEXT:
                return convertContextBlockToUIKit(block as ContextBlock);
            case BlockType.INPUT:
                return convertInputBlockToUIKit(block as InputBlock);
            default:
                // @NOTE this will be dropped when filtering for truthy values
                return null;
        }
    })
        .map(block => (block && {...block, appId}))
        .filter(block => block) as Array<IBlock>;
}

export function convertViewToUIKit(view: IBlockKitView, appId: string): IUIKitView {
    if (!view) return {} as IUIKitView;

    const { id, type, title, blocks, close, submit, clear_on_close, notify_on_close, state } = view;

    return {
        appId,
        id: id || uuid(),
        type: type === 'modal' ? UIKitViewType.MODAL : UIKitViewType.HOME,
        title: convertTextToUIKit(title || { type: TextObjectType.PLAINTEXT, text: '' }),
        blocks: convertBlocksToUIKit(blocks, appId),
        close: close && {
            type: BlockElementType.BUTTON,
            text: convertTextToUIKit(close),
            actionId: uuid(),
        },
        submit: submit && {
            type: BlockElementType.BUTTON,
            text: convertTextToUIKit(submit),
            actionId: uuid(),
        },
        state: state && convertBlockKitViewStateToUIKit(state),
        clearOnClose: clear_on_close,
        notifyOnClose: notify_on_close
    };
}
