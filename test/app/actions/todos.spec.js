import { expect } from 'chai';
import * as types from '../../../app/actions/gif-action-types';
import * as actions from '../../../app/actions/gifs';

describe('todoapp todo actions', () => {
    it('addTodo should create ADD_TODO action', () => {
        expect(actions.toggleFrame()).to.eql({
            type: types.TOGGLE_FRAME,
            text: 'Use Redux'
        });
    });
});
