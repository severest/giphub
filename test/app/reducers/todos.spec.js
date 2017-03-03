import { expect } from 'chai';
import gifs from '../../../app/reducers/gifs';

describe('todoapp gifs reducer', () => {
    it('should handle initial state', () => {
        expect(
            gifs(undefined, {})
        ).to.eql([{
            text: 'Use Redux',
            completed: false,
            id: 0
        }]);
    });
});
