/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import MenuModalComponent from './MenuModalComponent';
import { hasToken } from '../utils/token';
import getPage from '../utils/getPage';
import TooltipMarkerComponent from './TooltipMarkerComponent';
import TooltipHelpContainer from '../containers/TooltipHelpContainer';
import { UserRole } from '../types/items';
import { hasPermissions } from '../utils/hasPermissions';
import { FlipLogOutStateAction } from '../types/redux/unsavedWarning';

interface HeaderButtonsProps {
	showCollapsedMenuButton: boolean;
	loggedInAsAdmin: boolean;
	role: UserRole | null;
	hasUnsavedChanges: boolean;
	handleLogOut: () => any;
	flipLogOutState(): FlipLogOutStateAction;
}

/**
 * React component that controls the buttons in the Header
 */
export default class HeaderButtonsComponent extends React.Component<HeaderButtonsProps> {
	constructor(props: HeaderButtonsProps) {
		super(props);
		this.handleLogOut = this.handleLogOut.bind(this);
	}

	// TODO: Consider removing the getPage() !=== (currentPage) so nav bar is consistent across all pages.
	public render() {
		const role = this.props.role;
		const loggedInAsAdmin = this.props.loggedInAsAdmin;
		const showOptions = getPage() === '';
		const renderLoginButton = !hasToken();
		const shouldHomeButtonDisabled = getPage() === '';
		const renderAdminButton = loggedInAsAdmin && getPage() == 'admin';
		const shouldGroupsButtonDisabled = getPage() === 'groups';
		const shouldMetersButtonDisabled = getPage() === 'meters';
		const renderMapsButton =loggedInAsAdmin && getPage() == 'maps';
		const renderCSVButton = Boolean(role && hasPermissions(role, UserRole.CSV) && getPage() == 'csv');
		const renderUnitsButton = loggedInAsAdmin && getPage() == 'units';
		const renderConversionsButton = loggedInAsAdmin && getPage() == 'conversions';
		const renderLogoutButton = hasToken();

		const loginLinkStyle: React.CSSProperties = {
			display: renderLoginButton ? 'inline' : 'none',
			paddingLeft: '5px'
		};
		const homeLinkStyle: React.CSSProperties = {
			display: 'inline',
			paddingLeft: '5px'
		};
		const adminLinkStyle: React.CSSProperties = {
			display: renderAdminButton || loggedInAsAdmin ? 'inline' : 'none',
			paddingLeft: '5px'
		};
		const csvLinkStyle: React.CSSProperties = {
			display: renderCSVButton || loggedInAsAdmin ? 'inline' : 'none',
			paddingLeft: '5px'
		};
		const groupsLinkStyle: React.CSSProperties = {
			display: 'inline',
			paddingLeft: '5px'
		};
		const metersLinkStyle: React.CSSProperties = {
			display: 'inline',
			paddingLeft: '5px'
		};
		const mapsLinkStyle: React.CSSProperties = {
			display: renderMapsButton || loggedInAsAdmin ? 'inline' : 'none',
			paddingLeft: '5px'
		};
		const unitsLinkStyle: React.CSSProperties = {
			display: renderUnitsButton || loggedInAsAdmin ? 'inline' : 'none',
			paddingLeft: '5px'
		};
		const conversionsLinkStyle: React.CSSProperties = {
			display: renderConversionsButton || loggedInAsAdmin ? 'inline' : 'none',
			paddingLeft: '5px'
		};
		const logoutButtonStyle: React.CSSProperties = {
			display: renderLogoutButton ? 'inline' : 'none',
			paddingLeft: '5px'
		};

		return (
			<div>
				<div className='d-lg-none'>
					{(this.props.showCollapsedMenuButton) ?
						<MenuModalComponent
							showOptions={showOptions}
							showCollapsedMenuButton={false}
						/> : null
					}
				</div>
				<div className={this.props.showCollapsedMenuButton ? 'd-none d-lg-block' : ''}>
					<TooltipHelpContainer page='all' />
					<TooltipMarkerComponent page='all' helpTextId='help.home.header' />
					<Link style={adminLinkStyle} to='/admin'><Button disabled={renderAdminButton} outline><FormattedMessage id='admin.panel' /></Button></Link>
					<Link
						style={conversionsLinkStyle}
						to='/conversions'>
						<Button disabled={renderConversionsButton}
							outline><FormattedMessage id='conversions' />
						</Button>
					</Link>
					<Link style={csvLinkStyle} to='/csv'><Button disabled={renderCSVButton} outline><FormattedMessage id='csv' /></Button></Link>
					<Link style={groupsLinkStyle} to='/groups'><Button disabled={shouldGroupsButtonDisabled} outline><FormattedMessage id='groups' /></Button></Link>
					<Link style={homeLinkStyle} to='/'><Button disabled={shouldHomeButtonDisabled} outline><FormattedMessage id='home' /></Button></Link>
					<Link style={mapsLinkStyle} to='/maps'><Button disabled={renderMapsButton} outline><FormattedMessage id='maps' /></Button></Link>
					<Link style={metersLinkStyle} to='/meters'><Button disabled={shouldMetersButtonDisabled} outline><FormattedMessage id='meters' /></Button></Link>
					<Link style={unitsLinkStyle} to='/units'><Button disabled={renderUnitsButton} outline><FormattedMessage id='units' /></Button></Link>
					<Link style={loginLinkStyle} to='/login'><Button outline><FormattedMessage id='log.in' /></Button></Link>
					<Link style={logoutButtonStyle} to='/'><Button outline onClick={this.handleLogOut}><FormattedMessage id='log.out' /></Button></Link>
				</div>
			</div>
		);
	}

	private handleLogOut() {
		if (this.props.hasUnsavedChanges) {
			this.props.flipLogOutState();
		} else {
			// Normally log out if there are no unsaved changes
			this.props.handleLogOut();
			this.forceUpdate();
		}
	}
}