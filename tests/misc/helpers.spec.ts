import { expect } from 'chai';
import { describe, it } from 'mocha';

import { 
    camelCaseToSnakeCase,
    snakeCaseToCamelCase,
} from '../../src/helpers';

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
});
