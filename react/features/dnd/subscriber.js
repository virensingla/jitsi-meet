// @flow

import { StateListenerRegistry } from '../base/redux';
import { getCurrentConference } from '../base/conference';
import {
    isLocalParticipantModerator
} from '../base/participants';

import { DND_COMMAND } from './constants';
//import { muteLocal } from '../remote-video-menu/actions';

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
 * Subscribes to changes to the currently pinned participant in the user
 * interface of the local participant.
 */
// StateListenerRegistry.register(
//     /* selector */ state => {
//         const pinnedParticipant = getPinnedParticipant(state);

//         return pinnedParticipant ? pinnedParticipant.id : null;
//     },
//     /* listener */ _sendDndCommand);

/**
 * Subscribes to changes to the shared document (etherpad) visibility in the
 * user interface of the local participant.
 *
 * @param sharedDocumentVisible {Boolean} {true} if the shared document was
 * shown (as a result of the toggle) or {false} if it was hidden
 */
// StateListenerRegistry.register(
//     /* selector */ state => state['features/etherpad'].editing,
//     /* listener */ _sendFollowMeCommand);

/**
 * Subscribes to changes to the filmstrip visibility in the user interface of
 * the local participant.
 */
// StateListenerRegistry.register(
//     /* selector */ state => state['features/filmstrip'].visible,
//     /* listener */ _sendFollowMeCommand);

/**
 * Subscribes to changes to the tile view setting in the user interface of the
 * local participant.
 */
// StateListenerRegistry.register(
//     /* selector */ state => state['features/video-layout'].tileViewEnabled,
//     /* listener */ _sendFollowMeCommand);

/**
 * Private selector for returning state from redux that should be respected by
 * other participants while follow me is enabled.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */
// function _getFollowMeState(state) {
//     return {
//         off: true
//     };
// }

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
    console.warn('dnd StateListenerRegistry', newSelectedValue, store)

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
    
    const conference = getCurrentConference(state);

    if (!conference) {
        return;
    }

    // Only a moderator is allowed to send commands.
    if (!isLocalParticipantModerator(state)) {
        return;
    }

    if (newSelectedValue === 'off') {
        // if the change is to off, local user turned off follow me and
        // we want to signal this

        conference.sendCommandOnce(
            DND_COMMAND,
            { attributes: { off: true } }
        );

        return;
    } else if (!state['features/base/conference'].dndEnabled) {
        return;
    }

    conference.sendCommand(
        DND_COMMAND,
        { attributes: _getFollowMeState(state) }
    );
}
