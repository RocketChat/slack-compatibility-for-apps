import { IUIKitView, UIKitViewType, TextObjectType, BlockElementType, BlockType, IBlock, IInputBlock } from '@rocket.chat/apps-engine/definition/uikit';

import { View } from '../../../vendor/slack-types';

/**
 * See [here](https://api.slack.com/reference/surfaces/views) for the details.
 */
export const mockBlockKitView: View = {
    // mandatory
    type: 'modal',
    title: {
        type: 'plain_text',
        text: 'Modal Title'
    },
    blocks: [
        {
            type: 'input',
            element: {
                type: 'plain_text_input',
                action_id: 'sl_input',
                placeholder: {
                    type: 'plain_text',
                    text: 'Placeholder text for single-line input'
                }
            },
            label: {
                type: 'plain_text',
                text: 'Label'
            },
            hint: {
                type: 'plain_text',
                text: 'Hint text'
            }
        },
        {
            type: 'input',
            element: {
                type: 'plain_text_input',
                action_id: 'ml_input',
                multiline: true,
                placeholder: {
                    type: 'plain_text',
                    text: 'Placeholder text for multi-line input'
                }
            },
            label: {
                type: 'plain_text',
                text: 'Label'
            },
            hint: {
                type: 'plain_text',
                text: 'Hint text'
            }
        }
    ],
    // optional
    close: {
        type: 'plain_text',
        text: 'Close'
    },
    submit: {
        type: 'plain_text',
        text: 'Submit'
    },
    private_metadata: 'This is private metadata',
    callback_id: 'this_is_callback_id',
    clear_on_close: false,
    notify_on_close: false,
}

export const mockUIKitView: IUIKitView = {
    // mandatory
    appId: '1399cc03-b350-4fab-b5f2-61089b41b81a',
    id: 'uikitViewId',
    type: UIKitViewType.MODAL,
    title: {
        type: TextObjectType.PLAINTEXT,
        text: 'Modal Title',
        emoji: false
    },
    blocks: [
        {
            type: BlockType.INPUT,
            element: {
                type: BlockElementType.PLAIN_TEXT_INPUT,
                actionId: 'sl_input',
                placeholder: {
                    type: TextObjectType.PLAINTEXT,
                    text: 'Placeholder text for single-line input',
                    emoji: false
                }
            },
            label: {
                type: BlockElementType.PLAIN_TEXT_INPUT,
                text: 'Label',
                emoji: false
            },
            blockId: '9a340790-bb6a-11ea-b7cf-0319c4330df2',
            appId: '1399cc03-b350-4fab-b5f2-61089b41b81a'
        },
        {
            type: BlockType.INPUT,
            element: {
                type: BlockElementType.PLAIN_TEXT_INPUT,
                actionId: 'ml_input',
                placeholder: {
                    type: TextObjectType.PLAINTEXT,
                    text: 'Placeholder text for multi-line input',
                    emoji: false
                }
            },
            label: {
                type: TextObjectType.PLAINTEXT,
                text: 'Label',
                emoji: false
            },
            blockId: '9a340791-bb6a-11ea-b7cf-0319c4330df2',
            appId: '1399cc03-b350-4fab-b5f2-61089b41b81a'
        }
    ] as Array<IInputBlock>,
    // optional
    close: {
        type: BlockElementType.BUTTON,
        text: {
            type: TextObjectType.PLAINTEXT,
            text: 'Close',
            emoji: false
        },
        actionId: '9a340793-bb6a-11ea-b7cf-0319c4330df2'
    },
    submit: {
        type: BlockElementType.BUTTON,
        text: {
            type: TextObjectType.PLAINTEXT,
            text: 'Submit',
            emoji: false
        },
        actionId: '9a340792-bb6a-11ea-b7cf-0319c4330df2'
    },
    state: {},
    clearOnClose: true,
    notifyOnClose: false
}
