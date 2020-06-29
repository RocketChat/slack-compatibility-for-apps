import { BlockType, IBlock, ISectionBlock, IUIKitView } from '@rocket.chat/apps-engine/definition/uikit';

import { SectionBlock, View } from '../../vendor/slack-types';
import { snakeCaseToCamelCase } from '../helpers';

export function convertBlocksToBlockKit(blocks: Array<IBlock>): Array<object> {
    return blocks.map((block) => {
        // identify block type
        switch (block.type) {
            case BlockType.SECTION:
                return convertSectionBlock(block as ISectionBlock);
            default:
                return block;
        }
    });
}

export function convertViewToBlockKit(view: IUIKitView): View {
    // todo(shiqi.mei) implement it
    return {} as View;
}

function renameProperties<F, T>(subject: F): T {
    return Object.entries(subject).map(([key, value]) => (
        { [snakeCaseToCamelCase(key)]: value }
    ))
        .reduce((acc, curr) => (Object.assign(acc, curr)), {}) as T;
}

function convertSectionBlock(block: ISectionBlock): SectionBlock {
    return renameProperties<ISectionBlock, SectionBlock>(block);
}
