// @flow

import React from 'react';

import { Dialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';

import AbstractDndDialog, {
    type Props as AbstractProps
} from '../AbstractDndDialog';
import { muteAllParticipants } from '../../../remote-video-menu/actions';
import { isDndActive } from '../../../dnd';
import { getLocalParticipant } from '../../../base/participants';

declare var APP: Object;

/**
 * The type of the React {@code Component} props of
 * {@link DndDialog}.
 */
type Props = AbstractProps & {

};

/**
 * Translations needed for dialog rendering.
 */
type Translations = {

    /**
     * Content text.
     */
    content: string,

    /**
     * Title text.
     */
    title: string
}

/**
 * A React Component with the contents for a dialog that asks for confirmation
 * from the user before activating DND.
 *
 * @extends Component
 */
class DndDialog extends AbstractDndDialog<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Dialog
                okKey = 'Activate'
                onSubmit = { this._onSubmit }
                titleString = { 'Activate Do Not Disturb?' }
                width = 'small'>
                <div>
                    { 'Once activated, participants won\'t be able to unmute themselves. You can disable DND anytime by clicking on the button again.' }
                </div>
            </Dialog>
        );
    }

    _onSubmit: () => boolean;

    /**
     * Callback to be invoked when the value of this dialog is submitted.
     *
     * @returns {boolean}
     */
    _onSubmit() {
        const {
            dispatch
        } = this.props;

        if(!isDndActive(window.APP.store.getState())){
            dispatch(muteAllParticipants([getLocalParticipant(window.APP.store.getState()).id]));
        }

        window.APP.conference.commands.sendCommand(
            'dnd',
            {
                attributes: {
                    isActive: !isDndActive(window.APP.store.getState())
                }
            }
        );

        return true;
    }

    /**
     * Method to get translations depending on whether we have an exclusive
     * mute or not.
     *
     * @returns {Translations}
     * @private
     */
    _getTranslations(): Translations {
        return {
            content: 'Activate Do Not Disturb?',
            title: 'Once activated, participants won\'t be able to unmute themselves.'
        };
    }
}

export default translate(connect()(DndDialog));
