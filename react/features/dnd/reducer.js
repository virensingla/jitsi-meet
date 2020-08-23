// @flow

import {
    SET_DND_STATE
} from './actionTypes';
import { ReducerRegistry, set } from '../base/redux';

/**
 * Listen for actions that contain the Follow Me feature active state, so that it can be stored.
 */
ReducerRegistry.register(
    'features/dnd',
    (state = {}, action) => {

        switch (action.type) {
            case SET_DND_STATE: {
                return set(state, 'state', action.state);
            }
        }

        return state;
    });
