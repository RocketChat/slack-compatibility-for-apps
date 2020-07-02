import { expect } from 'chai';

import { convertBlockKitViewStateToUIKit, convertUIKitViewStateToBlockKit } from '../../../src/converters/view/viewStateConverter';
import { mockBlockKitView, mockUIKitView } from '../../mocks/view/mockView';

describe('View state converters', () => {
    describe('UIKit -> BlockKit', () => {
        it('should convert UIKit view state to BlockKit', () => {
            expect(convertUIKitViewStateToBlockKit(mockUIKitView.state, mockUIKitView.blocks)).to.deep.equal(mockBlockKitView.state);
        });
    });

    describe('BlockKit -> UIKit', () => {
        it('it should convert BlockKit view state to UIKit', () => {
            expect(convertBlockKitViewStateToUIKit(mockBlockKitView.state)).to.deep.equal(mockUIKitView.state);
        });
    });
});
