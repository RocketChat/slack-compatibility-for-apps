import {
    Action, Button, Checkboxes, Datepicker, ImageElement, MrkdwnElement, MultiSelect, Overflow, PlainTextElement, RadioButtons, Select, View
} from '../../vendor/slack-types';

export type BlockKitAccessoryElements = Button | Overflow | Datepicker | Select | MultiSelect | Action | ImageElement | RadioButtons | Checkboxes;

export type BlockKitTextObject = PlainTextElement | MrkdwnElement;

export interface ISlackTeam {
    team_id: string;
    team_domain: string;
}

export interface ISlackChannel {
    channel_id: string;
    channel_name: string;
}

export interface ISlackUser {
    user_id: string;
    user_name: string;
}

export interface IBlockKitView extends View {
    state?: {
        /**
         * A dictionary of objects keyed with the block_ids of any user-modified input blocks from the modal view.
         * Within each block_id object is another object keyed by the action_id of the child block element of the input block.
         * This final child object will contain the type and submitted value of the input block element.
         * See the examples [here](https://api.slack.com/reference/interaction-payloads/views#view_submission_example) to
         * understand this better — note how the block_id and action_id of the example view correspond with the object keys
         * in the example view_submission payload.
         */
        values: {
            [block_id: string]: {
                [action_id: string]: {
                    type: BlockKitInputBlockElementType,
                    value: any,
                }
            }
        }
    };
}

export enum BlockKitEventType {
    BLOCK_ACTIONS = 'block_actions',
    VIEW_SUBMISSION = 'view_submission',
    VIEW_CLOSED = 'view_closed',
}

export enum BlockKitInputBlockElementType {
    PLAIN_TEXT_INPUT = 'plain_text_input',
    STATIC_SELECT = 'static_select',
    MULTI_STATIC_SELECT = 'multi_static_select',
    DATE_PICKER = 'datepicker'
}

export type BlockKitViewEventType = Exclude<BlockKitEventType, BlockKitEventType.BLOCK_ACTIONS>;

export interface IBlockKitViewEventPayload {
    /**
     * Helps identify the source of the payload.
     * The type for this interaction is view_submission or view_closed.
     */
    type: BlockKitViewEventType,
    /**
     * The workspace that the interaction happened in.
     */
    team: ISlackTeam,
    /**
     * The user who interacted to trigger this request.
     */
    user: ISlackUser,
    /**
     * The source view of the modal that the user submitted.
     */
    view: IBlockKitView,
    /**
     * A unique value which is optionally accepted in views.update and views.publish API calls.
     * When provided to those APIs, the hash is validated such that only the most recent view can be updated.
     * This should be used to ensure the correct view is being updated when updates are happening asynchronously.
     */
    hash: string;
    /**
     * A boolean that represents whether or not a whole view stack was cleared.
     */
    is_cleared: boolean;
}

export type IBlockKitViewSubmissionPayload = Omit<IBlockKitViewEventPayload, 'is_cleared'>;

export type IBlockKitViewClosedPayload = Omit<IBlockKitViewEventPayload, 'hash'>;
