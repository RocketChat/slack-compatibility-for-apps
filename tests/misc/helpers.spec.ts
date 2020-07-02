import { expect } from 'chai';
import { describe, it } from 'mocha';

import { BlockElementType, IInputBlock } from '@rocket.chat/apps-engine/definition/uikit';

import { calculateExpiryDate, camelCaseToSnakeCase, findUIKitInputBlockElementTypeByBlockIdAndActionId, snakeCaseToCamelCase } from '../../src/helpers';
import { RESPONSE_URL_EXPIRATION_TIME } from '../../src/lib/constants';
import { mockUIKitView } from '../mocks/view/mockView';

describe('Helper functions', () => {
    describe('Case style translator', () => {
        it('should translate a string from snake_case to camelCase', () => {
            const snakeCase = 'snake_case_string';
            const camelCase = 'snakeCaseString';
            expect(snakeCaseToCamelCase(snakeCase)).to.equal(camelCase);
        });

        it('should translate a string from camelCase to snake_case', () => {
            const snakeCase = 'snake_case_string';
            const camelCase = 'snakeCaseString';
            expect(camelCaseToSnakeCase(camelCase)).to.equal(snakeCase);
        });
    });

    describe('Expiry Date calculation', () => {
        it('should calculate the expiry date based on input', () => {
            const date = new Date('2020-07-01T21:36:21.728Z');
            const expiryDate = new Date('2020-07-01T22:06:21.728Z');

            const result = calculateExpiryDate(date, RESPONSE_URL_EXPIRATION_TIME);

            expect(result).to.deep.equal(expiryDate);
        });
    });

    describe('findUIKitInputBlockElementTypeByBlockIdAndActionId', () => {
        const mockBlocks = mockUIKitView.blocks as Array<IInputBlock>;

        it('should find the correct block element type according blockId and actionId provided', () => {
            const blockId = 'block_static-select';
            const actionId = 'action_static-select';

            expect(findUIKitInputBlockElementTypeByBlockIdAndActionId(mockBlocks, blockId, actionId)).to.deep.equal(BlockElementType.STATIC_SELECT);
        });
    });
});
