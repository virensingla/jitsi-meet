// @flow

import {
    SET_DND_STATE
} from './actionTypes';

/**
 * Sets the current moderator id or clears it.
 *
 * @param {?string} id - The Follow Me moderator participant id.
 * @returns {{
 *     type: SET_FOLLOW_ME_MODERATOR,
 *     id, string
 * }}
 */

/**
 * Sets the Follow Me feature state.
 *
 * @param {?Object} state - The current state.
 * @returns {{
 *     type: SET_FOLLOW_ME_STATE,
 *     state: Object
 * }}
 */
export function setDndState(state: ?Object) {
    return {
        type: SET_DND_STATE,
        state
    };
}
