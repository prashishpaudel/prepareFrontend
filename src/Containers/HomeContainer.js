/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid, Panel, formgroups, Alert } from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button, InputGroup, Glyphicon, Col, Jumbotron } from 'react-bootstrap';
//import './NameForm.css'; 
import Form from 'react-bootstrap-form';
import axios from 'axios';
import backendlink from '../../config/links.js';
import { LinkContainer } from 'react-router-bootstrap';

import setAuthorizationToken from './setAuthorizationToken.js'

import ReactTable from 'react-table';
import 'react-table/react-table.css'
import queryString from 'query-string';
import './HomeContainer.css'

class NameForm extends Component {

	constructor(props) {
		super(props);

		this.state = {

			table: {
				sort: {
					column: "age",
					order: "desc"
				},
				columns: [
					{
						Header: 'SCENARIO_NAME',
						accessor: 'SCENARIO_NAME'
					},
					{
						Header: 'CREATED_AT',
						accessor: 'CREATED_AT'
					},
					{
						Header: 'Score',
						accessor: 'Score'
					},
					{
						Header: 'OBSERVER_NAME',
						accessor: 'OBSERVER_NAME'
					},
					{
						Header: 'STUDENT_NAME',
						accessor: 'STUDENT_NAME'
					}
				],
				rows: [

				]
			}
		};

	}
	componentDidMount() {
		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		axios.get(backendlink.backendlink + '/getscenario')
			.then(function (response) {
				var check = response.data;
				if (check && check.error) {
					window.location.href = "./login";

				}

			}.bind(this))
			.catch(function (error) {

			});

	}


	render() {

		const timelineStyle = {
			"background-color": "#5b95c7",
			"border": "2px dotted grey"
		}
		return (

			<div class="homelist">
				<br />
				<div class="picColumn">
					<Col sm={3}>
						<div class="homesidepane">
							{/* <img src={require('./wordart1.png')} /> */}
							<img src={require('./extendedLogo.png')} />
						</div>
					</Col>
				</div>

				<Col xs={9}>
					<Row xs={9}>
						<LinkContainer to='/course'>
							<Jumbotron>
								<h3>Curriculum</h3>
								<p>
									Create a new curriculum
								</p>
								<p>
									<LinkContainer to='/course'><Button bsStyle="primary">Curriculum</Button></LinkContainer>
								</p>

							</Jumbotron>
						</LinkContainer>
					</Row>

					<Row xs={9}>
						<LinkContainer to='/run'>
							<Jumbotron>
								<h3>Evaluate</h3>
								<p>
									Evaluate learner participation in SBMEs
								</p>
								<p>
									<LinkContainer to='/run'><Button bsStyle="primary">Evaluate</Button></LinkContainer>
								</p>
							</Jumbotron>
						</LinkContainer>
					</Row>

					<Row xs={9}>
					<LinkContainer to='/courseResult'>
						<Jumbotron>
							<h3>Results</h3>
							<p>
								View learner assessments
							</p>
							<p>
								<LinkContainer to='/courseResult'><Button bsStyle="primary">Results</Button></LinkContainer>
							</p>
						</Jumbotron>
						</LinkContainer>
					</Row>
				<Row xs={9}>
					<LinkContainer to='/config'>
						<Jumbotron>
							<h3>Configuration</h3>
							<p>
								Configure platform options
							</p>
							<p>
								<LinkContainer to='/config'><Button bsStyle="primary">Config</Button></LinkContainer>
							</p>
						</Jumbotron>
					</LinkContainer>
			</Row>

				</Col>

			</div>


		)
	}
}


export default NameForm; 