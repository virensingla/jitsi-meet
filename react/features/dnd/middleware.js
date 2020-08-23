// @flow

import {
    setDndState
} from './actions';
import { CONFERENCE_WILL_JOIN } from '../base/conference';
import {
    getParticipantById
} from '../base/participants';
import { MiddlewareRegistry } from '../base/redux';
import { DND_COMMAND } from './constants';
import { isDndActive } from './functions';
// import { muteLocal } from '../remote-video-menu/actions';
import logger from './logger';

declare var APP: Object;

/**
 * Represents "Follow Me" feature which enables a moderator to (partially)
 * control the user experience/interface (e.g. filmstrip visibility) of (other)
 * non-moderator participant.
 */
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case CONFERENCE_WILL_JOIN: {
        const { conference } = action;

        conference.addCommandListener(
            DND_COMMAND, ({ attributes }, id) => {
                _onDndCommand(attributes, id, store);
            });
        break;
    }

    // case PARTICIPANT_LEFT:
    //     if (store.getState()['features/follow-me'].moderator === action.participant.id) {
    //         store.dispatch(setFollowMeModerator());
    //     }
    //     break;
    }

    return next(action);
});

/**
 * Notifies this instance about a "Follow Me" command received by the Jitsi
 * conference.
 *
 * @param {Object} attributes - The attributes carried by the command.
 * @param {string} id - The identifier of the participant who issuing the
 * command. A notable idiosyncrasy to be mindful of here is that the command
 * may be issued by the local participant.
 * @param {Object} store - The redux store. Used to calculate and dispatch
 * updates.
 * @private
 * @returns {void}
 */
function _onDndCommand(attributes = {}, id, store) {
    const state = store.getState();

    // We require to know who issued the command because (1) only a
    // moderator is allowed to send commands and (2) a command MUST be
    // issued by a defined commander.
    if (typeof id === 'undefined') {
        return;
    }

    const participantSendingCommand = getParticipantById(state, id);

    // The Command(s) API will send us our own commands and we don't want
    // to act upon them.
    // if (participantSendingCommand.local) {
    //     return;
    // }

    if (participantSendingCommand.role !== 'moderator') {
        logger.warn('Received dnd command not from moderator');

        return;
    }

    // const oldState = state['features/dnd'].state || {};

    store.dispatch(setDndState(attributes));

    // store.dispatch(muteLocal(true));
}
