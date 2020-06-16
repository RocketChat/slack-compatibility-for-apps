import { expect } from 'chai';
import { describe, it } from 'mocha';

import { TextObjectConverter } from '../../../src/converters/objects/text';
import { 
    ITextObject as UIKitTextObject, 
    TextObjectType,
} from '@rocket.chat/apps-engine/definition/uikit';
import { 
    PlainTextElement as BlockKitPlainText,
    MrkdwnElement as BlockKitMrkdwnText,
} from '@slack/types';

describe('Text Object data structure converter', () => {
    describe('From  Block Kit to UIKit', () => {
        it('should convert a plain text object from slack to rocket.chat format', () => {
            const txt: BlockKitPlainText = {
                "type": "plain_text",
                "text": "This is a plain text section block.",
                "emoji": true
            };

            const converted = new TextObjectConverter(txt).convertToUIKit();
            expect(converted).to.have.property('text').to.equal(txt.text);
            expect(converted).to.have.property('type').to.equal(TextObjectType.PLAINTEXT);
            expect(converted).to.have.property('emoji').to.be.true;
        });

        it('should convert a mrkdwn text object from slack to rocket.chat format', () => {
            const txt: BlockKitMrkdwnText = {
                "type": "mrkdwn",
                "text": "This is a mrkdwn text section block.",
                "verbatim": true
            };

            const converted = new TextObjectConverter(txt).convertToUIKit();
            expect(converted).to.have.property('text').to.equal(txt.text);
            expect(converted).to.have.property('type').to.equal(TextObjectType.MARKDOWN);
            expect(converted).not.to.have.property('verbatim');
        });
    });

    describe('From UIKit to Block Kit', () => {
        it('should convert a plain text object from rocket.chat to slack format', () => {
            const txt: UIKitTextObject = {
                "type": TextObjectType.PLAINTEXT,
                "text": "This is a plain text section block.",
                "emoji": true
            };

            const converted = new TextObjectConverter(txt).convertToBlockKit();
            expect(converted).to.have.property('text').to.equal(txt.text);
            expect(converted).to.have.property('type').to.equal('plain_text');
            expect(converted).to.have.property('emoji').to.be.true;
        });

        it('should convert a mrkdwn text object from rocket.chat to slack format', () => {
            const txt: UIKitTextObject = {
                "type": TextObjectType.MARKDOWN,
                "text": "This is a plain text section block.",
                "emoji": true
            };

            const converted = new TextObjectConverter(txt).convertToBlockKit();
            expect(converted).to.have.property('text').to.equal(txt.text);
            expect(converted).to.have.property('type').to.equal('mrkdwn');
            expect(converted).not.to.have.property('emoji');
        });
    });
});
