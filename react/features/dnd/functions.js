// @flow

import { toState } from '../base/redux';

/**
 * Returns true if follow me is active and false otherwise.
 *
 * @param {Object|Function} stateful - Object or function that can be resolved
 * to the Redux state.
 * @returns {boolean} - True if follow me is active and false otherwise.
 */
export function isDndActive(stateful: Object | Function) {
    const state = toState(stateful);

    return state['features/dnd'].state && state['features/dnd'].state.isActive === 'true';
}
