import { BlockElementType, IInputBlock, IPlainTextInputElement, IUIKitView, TextObjectType, UIKitViewType } from '@rocket.chat/apps-engine/definition/uikit';

import { BlockKitInputBlockElementType, IBlockKitView } from '../../../src/customTypes/slack';

const mockUIKitViewState: IUIKitView['state'] = {
    'block_plain-text-input': {
        'action_plain-text-input': 'Content for plain text input'
    },
    'block_static-select': {
        'action_static-select': 'value-1'
    },
    'block_multi-static-select': {
        'action_multi-static-select': [
            'value-0',
            'value-1'
        ]
    }
}

const mockBlockKitViewState: IBlockKitView['state'] = {
    values: {
        'block_plain-text-input': {
            'action_plain-text-input': {
                type: BlockKitInputBlockElementType.PLAIN_TEXT_INPUT,
                value: 'Content for plain text input'
            }
        },
        'block_static-select': {
            'action_static-select': {
                type: BlockKitInputBlockElementType.STATIC_SELECT,
                selected_option: {
                    text: {
                        type: "plain_text",
                        text: "option 1",
                        emoji: true
                    },
                    value: "value-1"
                }
            }
        },
        'block_multi-static-select': {
            'action_multi-static-select': {
                type: BlockKitInputBlockElementType.MULTI_STATIC_SELECT,
                selected_options: [
                    {
                        text: {
                            type: "plain_text",
                            text: "option 0",
                            emoji: true
                        },
                        value: "value-0"
                    },
                    {
                        text: {
                            type: "plain_text",
                            text: "option 1",
                            emoji: true
                        },
                        value: "value-1"
                    }]
            }
        }
    }
}

/**
 * See [here](https://api.slack.com/reference/surfaces/views) for the details.
 */
export const mockBlockKitView: IBlockKitView = {
    // mandatory
    id: 'viewId',
    type: 'modal',
    title: {
        type: 'plain_text',
        text: 'Testing Modal Title',
        emoji: false,
    },
    blocks: [
        // Plain Text Input
        {
            type: 'input',
            block_id: 'block_plain-text-input',
            element: {
                type: BlockKitInputBlockElementType.PLAIN_TEXT_INPUT,
                action_id: 'action_plain-text-input',
                multiline: true,
                placeholder: {
                    type: 'plain_text',
                    text: 'Placeholder for plain text input',
                    emoji: false
                },
            },
            label: {
                type: 'plain_text',
                text: 'Plain Text Input',
                emoji: true
            }
        },
        // Static Select
        {
            type: 'input',
            block_id: 'block_static-select',
            element: {
                type: BlockKitInputBlockElementType.STATIC_SELECT,
                action_id: 'action_static-select',
                placeholder: {
                    type: 'plain_text',
                    text: 'Placeholder for static select',
                    emoji: true
                },
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: 'option 0',
                            emoji: true
                        },
                        value: 'value-0'
                    },
                    {
                        text: {
                            type: 'plain_text',
                            text: 'option 1',
                            emoji: true
                        },
                        value: 'value-1'
                    }
                ]
            },
            label: {
                type: 'plain_text',
                text: 'Static Select',
                emoji: true
            }
        },
        // Multiple Static Select
        {
            type: 'input',
            block_id: 'block_multi-static-select',
            element: {
                type: BlockKitInputBlockElementType.MULTI_STATIC_SELECT,
                action_id: 'action_multi-static-select',
                placeholder: {
                    type: 'plain_text',
                    text: 'Placeholder for multiple static select',
                    emoji: true
                },
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: 'option 0',
                            emoji: true
                        },
                        value: 'value-0'
                    },
                    {
                        text: {
                            type: 'plain_text',
                            text: 'option 1',
                            emoji: true
                        },
                        value: 'value-1'
                    }
                ]
            },
            label: {
                type: 'plain_text',
                text: 'Multiple Static Select',
                emoji: true
            }
        },
        // Multiple Users Select (Not Supported in Rocket.Chat)
        {
            type: 'input',
            block_id: 'block-multi-users-select',
            element: {
                type: BlockKitInputBlockElementType.MULTI_USERS_SELECT,
                action_id: 'action_multi-users-select',
                placeholder: {
                    type: 'plain_text',
                    text: 'Placeholder for multiple users select',
                    emoji: true
                }
            },
            label: {
                type: 'plain_text',
                text: 'Multiple Users Select',
                emoji: true
            }
        },
        // Date Picker (Not Supported in Rocket.Chat)
        {
            type: 'input',
            block_id: 'block_datepciker',
            element: {
                type: BlockKitInputBlockElementType.DATE_PICKER,
                action_id: 'action_datepicker',
                initial_date: '1990-04-28',
                placeholder: {
                    type: 'plain_text',
                    text: 'Placeholder for date picker',
                    emoji: true
                }
            },
            label: {
                type: 'plain_text',
                text: 'Date Picker',
                emoji: true
            }
        },
        // Checkboxes (Not Supported in Rocket.Chat)
        {
            type: 'input',
            block_id: 'block_checkboxes',
            element: {
                type: BlockKitInputBlockElementType.CHECKBOXES,
                action_id: 'action_checkboxes',
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: 'option 0',
                            emoji: true
                        },
                        value: 'value-0'
                    },
                    {
                        text: {
                            type: 'plain_text',
                            text: 'option 1',
                            emoji: true
                        },
                        value: 'value-1'
                    }
                ]
            },
            label: {
                type: 'plain_text',
                text: 'Checkboxes',
                emoji: true
            }
        },
        // Radio Buttons (Not Supported in Rocket.Chat)
        {
            type: 'input',
            block_id: 'block_radio-buttons',
            element: {
                type: BlockKitInputBlockElementType.RADIO_BUTTONS,
                action_id: 'action_radio-buttons',
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: 'option 0',
                            emoji: true
                        },
                        value: 'value-0'
                    },
                    {
                        text: {
                            type: 'plain_text',
                            text: 'option 1',
                            emoji: true
                        },
                        value: 'value-1'
                    }
                ]
            },
            label: {
                type: 'plain_text',
                text: 'Radio Buttons',
                emoji: true
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
    callback_id: 'mock_view_id',
    clear_on_close: true,
    notify_on_close: false,
    state: mockBlockKitViewState,
}

export const mockUIKitView: IUIKitView = {
    // mandatory
    appId: '1399cc03-b350-4fab-b5f2-61089b41b81a',
    id: 'viewId',
    type: UIKitViewType.MODAL,
    title: {
        type: TextObjectType.PLAINTEXT,
        text: 'Testing Modal Title',
        emoji: false
    },
    blocks: [
        // Plain Text Input
        {
            type: 'input',
            appId: "1399cc03-b350-4fab-b5f2-61089b41b81a",
            blockId: 'block_plain-text-input',
            element: {
                type: BlockElementType.PLAIN_TEXT_INPUT,
                actionId: 'action_plain-text-input',
                multiline: true,
                placeholder: {
                    type: 'plain_text',
                    text: 'Placeholder for plain text input',
                    emoji: false
                }
            } as IPlainTextInputElement,
            label: {
                'type': 'plain_text',
                'text': 'Plain Text Input',
                'emoji': true
            },
        },
        // Static Select
        {
            type: 'input',
            appId: "1399cc03-b350-4fab-b5f2-61089b41b81a",
            blockId: 'block_static-select',
            element: {
                type: BlockElementType.STATIC_SELECT,
                actionId: 'action_static-select',
                placeholder: {
                    type: 'plain_text',
                    text: 'Placeholder for static select',
                    emoji: true
                },
                options: [
                    {
                        'text': {
                            'type': 'plain_text',
                            'text': 'option 0',
                            'emoji': true
                        },
                        'value': 'value-0'
                    },
                    {
                        'text': {
                            'type': 'plain_text',
                            'text': 'option 1',
                            'emoji': true
                        },
                        'value': 'value-1'
                    }
                ]
            },
            label: {
                'type': 'plain_text',
                'text': 'Static Select',
                'emoji': true
            },
        },
        // Multiple Static Select
        {
            type: 'input',
            appId: "1399cc03-b350-4fab-b5f2-61089b41b81a",
            blockId: 'block_multi-static-select',
            element: {
                type: BlockElementType.MULTI_STATIC_SELECT,
                actionId: 'action_multi-static-select',
                placeholder: {
                    type: 'plain_text',
                    text: 'Placeholder for multiple static select',
                    emoji: true
                },
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: 'option 0',
                            emoji: true
                        },
                        value: 'value-0'
                    },
                    {
                        text: {
                            type: 'plain_text',
                            text: 'option 1',
                            emoji: true
                        },
                        value: 'value-1'
                    }
                ]
            },
            label: {
                type: 'plain_text',
                text: 'Multiple Static Select',
                emoji: true
            },
        }
    ] as Array<IInputBlock>,
    // optional
    close: {
        type: BlockElementType.BUTTON,
        text: {
            type: TextObjectType.PLAINTEXT,
            text: 'Close',
        },
        actionId: '9a340793-bb6a-11ea-b7cf-0319c4330df2'
    },
    submit: {
        type: BlockElementType.BUTTON,
        text: {
            type: TextObjectType.PLAINTEXT,
            text: 'Submit',
        },
        actionId: '9a340792-bb6a-11ea-b7cf-0319c4330df2'
    },
    state: mockUIKitViewState,
    clearOnClose: true,
    notifyOnClose: false
}
