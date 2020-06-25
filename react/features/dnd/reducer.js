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

        // case SET_DND_STATE: {
        //     let newState = set(state, 'moderator', action.id);

        //     if (!action.id) {
        //         // clear the state if feature becomes disabled
        //         newState = set(newState, 'state', undefined);
        //     }

        //     return newState;
        // }

        case SET_DND_STATE: {
            console.warn('dnd ReducerRegistry', action);

            return set(state, 'state', action.state);
        }
        }

        return state;
    });
