/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable valid-jsdoc */
/* @flow */

import Tooltip from '@atlaskit/tooltip';
import React from 'react';

import { Icon } from '../../../base/icons';
// import conference from '../../../conference';
import { isDndActive } from '../../../dnd';
import { muteAllParticipants } from '../../../remote-video-menu/actions';

import AbstractToolbarButton, { _mapStateToProps } from '../AbstractToolbarButton';
import type { Props as AbstractToolbarButtonProps }
    from '../AbstractToolbarButton';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';

/**
 * The type of the React {@code Component} props of {@link ToolbarButton}.
 */
type Props = AbstractToolbarButtonProps & {

    /**
     * The text to display in the tooltip.
     */
    tooltip: string,

    /**
     * From which direction the tooltip should appear, relative to the
     * button.
     */
    tooltipPosition: string
};

/**
 * Represents a button in the toolbar.
 *
 * @extends AbstractToolbarButton
 */
class DoNotDisturbButton extends AbstractToolbarButton<Props> {
    /**
     * Default values for {@code ToolbarButton} component's properties.
     *
     * @static
     */
    static defaultProps = {
        tooltipPosition: 'top'
    };

    _onButtonClick = () => {
        if (window.dnd) {
            window.dnd = false;
        } else {
            window.dnd = true;
        }

        console.warn('is dnd active', isDndActive(window.APP.store.getState()));

        if(!isDndActive(window.APP.store.getState())){
            const { dispatch } = this.props;
            console.warn('dnd muteAllParticipants 1', this.props);

            dispatch(muteAllParticipants([]));
        }

        window.APP.conference.commands.sendCommand(
            'dnd',
            {
                attributes: {
                    isActive: !isDndActive(window.APP.store.getState())
                }
            }
        );
    };

    constructor(props) {
        super(props);

        this._onButtonClick = this._onButtonClick.bind(this);
    }
    
    /**
     * Renders the button of this {@code ToolbarButton}.
     *
     * @param {Object} children - The children, if any, to be rendered inside
     * the button. Presumably, contains the icon of this {@code ToolbarButton}.
     * @protected
     * @returns {ReactElement} The button of this {@code ToolbarButton}.
     */
    _renderButton(children) {
        return (
            <div
                aria-label = { this.props.accessibilityLabel }
                className = 'toolbox-button'
                onClick = { this._onButtonClick }>
                { this.props.tooltip
                    ? <Tooltip
                        content = { this.props.tooltip }
                        position = { this.props.tooltipPosition }>
                        { children }
                    </Tooltip>
                    : children }
            </div>
        );
    }

    /**
     * Renders the icon of this {@code ToolbarButton}.
     *
     * @inheritdoc
     */
    _renderIcon() {
        return (
            <div className = { `toolbox-icon ${this.props.toggled ? 'toggled' : ''}` }>
                <Icon src = { this.props.icon } />
            </div>
        );
    }
}

export default translate(connect(_mapStateToProps)(DoNotDisturbButton));
