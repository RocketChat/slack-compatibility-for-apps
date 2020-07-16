import {
    BlockElementType, BlockType, IBlock, IInputBlock, IInputElement, IMultiStaticSelectElement, IOptionObject, IStaticSelectElement, IUIKitView
} from '@rocket.chat/apps-engine/definition/uikit';

import { BlockKitInputBlockElementType, IBlockKitView } from '../../customTypes/slack';
import { convertToBlockKit as convertTextObjectToBlockKit } from '../objects/text';

export function convertBlockKitViewStateToUIKit(state: IBlockKitView['state']): IUIKitView['state'] {
    if (!state || !state.values) {
        return {} as IUIKitView['state'];
    }

    return Object.entries(state.values)
        .map(([blockId, action]) => ({
            [blockId]: Object.entries(action)
                .map(([actionId, item]) => {
                    switch (item.type) {
                        case BlockKitInputBlockElementType.PLAIN_TEXT_INPUT:
                            return { [actionId]: (item as any).value };
                        case BlockKitInputBlockElementType.STATIC_SELECT:
                            return { [actionId]: (item as any).selected_option.value };
                        case BlockKitInputBlockElementType.MULTI_STATIC_SELECT:
                            return {
                                [actionId]: (item as any).selected_options
                                    .map(({ value }: any) => value)
                            };
                        default:
                            return { [actionId]: null };
                    }
                })
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
                    .map(([actionId, value]: [string, any]) => {
                        const [type, options] = getBlockKitInputBlockElementInfo(blocks, blockId, actionId);

                        switch (type) {
                            case BlockKitInputBlockElementType.PLAIN_TEXT_INPUT:
                                return { [actionId]: { type, value } };
                            case BlockKitInputBlockElementType.STATIC_SELECT:
                                const { text } = (options as Array<IOptionObject>).find(({ value: val }) => val === value);

                                return {
                                    [actionId]: {
                                        type,
                                        selected_option: {
                                            text: convertTextObjectToBlockKit(text),
                                            value: "value-1"
                                        }
                                    }
                                }
                            case BlockKitInputBlockElementType.MULTI_STATIC_SELECT:
                                return {
                                    [actionId]: {
                                        type,
                                        selected_options: (value as Array<string>).map((val) => {
                                            const { text } = (options as Array<IOptionObject>).find(({ value }) => value === val);

                                            return {
                                                text: convertTextObjectToBlockKit(text),
                                                value: val
                                            };
                                        }),
                                    }
                                };
                            default:
                                return {
                                    [actionId]: {
                                        type,
                                        value: null
                                    }
                                };
                        }
                    })
                    .reduce((acc, cur) => Object.assign(acc, cur), {})
            }))
            .reduce((acc, cur) => Object.assign(acc, cur), {})
    };
}

function findInputBlockElement(blocks: Array<IInputBlock>, blockId: string, actionId: string): IInputElement | undefined {
    const block = blocks.find(((block) => block.blockId === blockId && block.element.actionId === actionId));

    return block && block.element;
}

function getBlockKitInputBlockElementInfo(blocks: Array<IBlock>, blockId: string, actionId: string): [BlockKitInputBlockElementType, any] {
    const inputBlocks = blocks.filter(({ type }) => type === BlockType.INPUT) as Array<IInputBlock>;
    const element = findInputBlockElement(inputBlocks, blockId, actionId);

    switch (element.type) {
        case BlockElementType.STATIC_SELECT:
            return [BlockKitInputBlockElementType.STATIC_SELECT, (element as IStaticSelectElement).options];
        case BlockElementType.MULTI_STATIC_SELECT:
            return [BlockKitInputBlockElementType.MULTI_STATIC_SELECT, (element as IMultiStaticSelectElement).options];
        case BlockElementType.PLAIN_TEXT_INPUT:
            return [BlockKitInputBlockElementType.PLAIN_TEXT_INPUT, null];
        default:
            return [null, null];
    }
}
