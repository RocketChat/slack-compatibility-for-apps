import {
    Action, Block, Button, Checkboxes, Datepicker, ImageElement, MrkdwnElement, MultiSelect, Overflow, PlainTextElement, RadioButtons, Select, View, Option
} from '../../vendor/slack-types';
import { Omit } from './util';

export type BlockKitAccessoryElements = Button | Overflow | Datepicker | Select | MultiSelect | Action | ImageElement | RadioButtons | Checkboxes;

export type BlockKitTextObject = PlainTextElement | MrkdwnElement;

export interface ISlackTeam {
    id: string;
    domain: string;
}

export interface ISlackChannel {
    channel_id: string;
    channel_name: string;
}

export interface ISlackUser {
    id: string;
    name: string;
    username: string;
    team_id: string;
}

export interface IBlockKitView extends View {
    id: string;
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
    MULTI_USERS_SELECT = 'multi_users_select',
    DATE_PICKER = 'datepicker',
    CHECKBOXES = 'checkboxes',
    RADIO_BUTTONS = 'radio_buttons',
}

export enum BlockKitBlockActionContainerType {
    VIEW = 'view',
    MESSAGE = 'message',
}

// There are other optional fields to the action, but they are not supported yet
export interface IBlockKitBlockAction {
    type: string;
    block_id: string;
    action_id: string;
    action_ts: string;
    text?: BlockKitTextObject;
    value?: string;
    selectedOption?: Option;
}

export interface IBlockKitBlockActionsEventPayload {
    type: BlockKitEventType;
    trigger_id: string;
    container: {
        type: BlockKitBlockActionContainerType;
        view_id?: string;
        message_ts?: string;
        channel_id?: string;
        is_ephemeral?: boolean;
    }
    user: ISlackUser;
    team: ISlackTeam;
    api_app_id: string; // undocumented, not sure what it does
    actions: Array<IBlockKitBlockAction>
    message?: ISlackMessage;
    response_url?: string;
    view?: IBlockKitView;
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

export enum BlockKitViewResponseAction {
    /**
     * Updating a view
     */
    UPDATE = 'update',
    /**
     * Pushing a new view via API
     */
    PUSH = 'push',
    /**
     * Closing all views
     */
    CLEAR = 'clear',
    /**
     * Displaying errors
     */
    ERRORS = 'errors',
}

export interface ISlackMessage {
  bot_id: string;
  type: string;
  text: string;
  user: string;
  ts: string;
  team: string;
  blocks: Array<Block>;
}
