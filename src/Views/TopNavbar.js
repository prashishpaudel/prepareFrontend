/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Navbar, Nav, NavItem} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './TopNavbar.css';
//import logo from '../img/logo1.gif'

class TopNavbar extends Component {
	render() {
		if(!localStorage.jwtToken){
			return (<h1></h1>);
		}
		return (
			<Navbar collapseOnSelect staticTop>
				<Navbar.Collapse>
					
					<Nav>
					<NavItem> {/* <img  className="logo1" alt="logo" src={logo} /> */} <b>PREPARE</b> </NavItem>
						<LinkContainer to="/"><NavItem eventKey={1}>Home</NavItem></LinkContainer>
						<LinkContainer to="/course"><NavItem eventKey={2}>Edit/Create Curriculum</NavItem></LinkContainer>
						<LinkContainer to="/run"><NavItem eventKey={3}>Play Scenario</NavItem></LinkContainer>
						
						<NavItem onClick={()=>{this.logout()}}>Logout</NavItem>
						
					</Nav>
				

				</Navbar.Collapse>
			</Navbar>
		)
	}
	logout(){
		localStorage.clear();
		window.location.href = "./login";

	}
}

export default TopNavbar;