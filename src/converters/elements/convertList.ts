import { Button, Action, Overflow, Select } from '../../../vendor/slack-types';
import { IBlockElement } from '@rocket.chat/apps-engine/definition/uikit';
import {
    convertToUIKit as convertElementToUIKit,
    convertToBlockKit as convertElementToBlockKit,
} from './convertElement';

export function convertToUIKit(elements: Array<Button | Overflow | Select | Action>): Array<object> {
    return elements.map(element => convertElementToUIKit(element));
}

export function convertToBlockKit(elements: Array<IBlockElement>): Array<object> {
    return elements.map(element => convertElementToBlockKit(element));
}
