import {
    Action,
    Button,
    Checkboxes,
    Datepicker,
    ImageElement,
    MultiSelect,
    Overflow,
    RadioButtons,
    Select,
    PlainTextElement,
    MrkdwnElement,
} from '../../vendor/slack-types';

export type BlockKitAccessoryElements = Button | Overflow | Datepicker | Select | MultiSelect | Action | ImageElement | RadioButtons | Checkboxes;

export type BlockKitTextObject = PlainTextElement | MrkdwnElement;
