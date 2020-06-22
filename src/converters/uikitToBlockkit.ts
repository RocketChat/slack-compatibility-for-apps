import { IBlock, BlockType, ISectionBlock } from '@rocket.chat/apps-engine/definition/uikit';
import { snakeCaseToCamelCase } from '../helpers';
import { SectionBlock } from '../../vendor/slack-types';

export function convertToBlockKit(blocks: Array<IBlock>): Array<object> {
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

function renameProperties<F, T>(subject: F): T {
    return Object.entries(subject).map(([key, value]) => (
        { [snakeCaseToCamelCase(key)]: value }
    ))
    .reduce((acc, curr) => (Object.assign(acc, curr)), {}) as T;
}

function convertSectionBlock(block: ISectionBlock): SectionBlock {
    return renameProperties<ISectionBlock, SectionBlock>(block);
}
