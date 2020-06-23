import { Block, ActionsBlock, SectionBlock } from '../../vendor/slack-types';
import { IBlock } from '@rocket.chat/apps-engine/definition/uikit';
import { convertToUIKit as convertActionBlockToUIKit } from './blocks/action';
import { convertToUIKit as convertSectionBlockToUIKit } from './blocks/section';

export function convertToUIKit(blocks: Array<Block>): Array<IBlock> {
    return blocks.map((block) => {
        switch (block.type) {
            case 'action':
                return convertActionBlockToUIKit(block as ActionsBlock);

            case 'section':
                return convertSectionBlockToUIKit(block as SectionBlock);

            default:
                // @NOTE this will be dropped when filtering for truthy values
                return null;
        }
    })
    .filter(block => block) as Array<IBlock>;
}
