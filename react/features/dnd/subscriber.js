// @flow

import { StateListenerRegistry } from '../base/redux';
import { getCurrentConference } from '../base/conference';
import {
    isLocalParticipantModerator
} from '../base/participants';

import { DND_COMMAND } from './constants';

/**
 * Subscribes to changes to the Follow Me setting for the local participant to
 * notify remote participants of current user interface status.
 * Changing newSelectedValue param to off, when feature is turned of so we can
 * notify all listeners.
 */
StateListenerRegistry.register(
    /* selector */ state => state['features/dnd'].state,
    /* listener */ (newSelectedValue, store) => _sendDndCommand(newSelectedValue, store));

/**
 * Private selector for returning state from redux that should be respected by
 * other participants while follow me is enabled.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */

/**
 * Sends the follow-me command, when a local property change occurs.
 *
 * @param {*} newSelectedValue - The changed selected value from the selector.
 * @param {Object} store - The redux store.
 * @private
 * @returns {void}
 */
function _sendDndCommand(
        newSelectedValue, store) { // eslint-disable-line no-unused-vars

    const state = store.getState();

    if(newSelectedValue && newSelectedValue.isActive === "true"){
        try {
            if (isLocalParticipantModerator(state)) {
                return;
            }

            store.dispatch({
                type: 'SET_AUDIO_MUTED',
                ensureTrack: true,
                muted: true
            });
        }
        catch(e) {
            console.warn('dnd mute local', e);
        }
    }
    
    return;
}
