import { ISectionBlock } from '@rocket.chat/apps-engine/definition/uikit';
import { SectionBlock } from '@slack/types';

import { snakeCaseToCamelCase } from '../helpers';

export function convertSectionBlock(block: ISectionBlock): SectionBlock {
    return Object.entries(block).map(([key, value]) => {
    })
}
