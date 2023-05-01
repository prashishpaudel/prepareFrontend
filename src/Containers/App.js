/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import './App.css';
import Header from '../Views/header';
import NameForm from '../Views/NameForm';
import EditScenarioContainer from './EditScenarioContainer';
import PlayScenarioContainer from './PlayScenarioContainer';
import LoginContainer from './LoginContainer';
import HomeContainer from './HomeContainer';
import ResultsContainer from './ResultsContainer';
import SpecificResultsContainer from './SpecificResultsContainer1';
import RunContainer from './RunContainer';
import SignupContainer from './SignupContainer';
import TopNavbar from '../Views/TopNavbar';
import CreateModifyContainer from './CreateModifyContainer';


import CreateCourseContainer from './CreateCourseContainer';
import SpecificCourseContainer from './SpecificCourseContainer';


import CreateCourseResultContainer from './CreateCourseResultContainer';
import SpecificCourseResultContainer from './SpecificCourseResultContainer';



import SpecificCoursePreFormContainer from './SpecificCoursePreFormContainer';
import SpecificCoursePostFormContainer from './SpecificCoursePostFormContainer';
import ConfigContainer from './ConfigContainer'



import {  Grid } from 'react-bootstrap';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';


class App extends Component {
	render() {
		return (
			<Router>
				<div>

					<Header />
					<TopNavbar />


					<div className="App">


						<Route path="/signup" render={() => {
							return (
								<Grid id='gridsize'>

									<SignupContainer />
								</Grid>
							)
						}} />


						<Route path="/login" render={() => {
							return (
								<Grid id='gridsize'>

									<LoginContainer />
								</Grid>
							)
						}} />

						<Route path="" render={() => {
							return (
								<Grid id='gridsize'>

								</Grid>
							)
						}} />


						<Route exact path="/" render={() => {
							return (
								<Grid id='gridsize'>
									<HomeContainer />

								</Grid>
							)
						}} />


						<Route path="/course" render={() => {
							return (
								<Grid id='gridsize'>

									<CreateCourseContainer />
								</Grid>
							)
						}} />


						<Route path="/specificCourse" render={(match) => {
							return (
								<Grid id='gridsize'>

									<SpecificCourseContainer match={match} />
								</Grid>
							)
						}} />


						<Route path="/editscenario" render={(match) => {
							return (
								<Grid id='gridsize'>

									<EditScenarioContainer
										match={match}
									/>
								</Grid>
							)
						}} />

						<Route path="/playscenario" render={(match) => {
							return (
								<Grid id='gridsize'>

									<PlayScenarioContainer
										match={match}
									/>
								</Grid>
							)
						}} />







						<Route path="/courseResult" render={() => {
							return (
								<Grid id='gridsize'>

									<CreateCourseResultContainer />
								</Grid>
							)
						}} />


						<Route path="/specificCourseResult" render={(match) => {
							return (
								<Grid id='gridsize'>

									<SpecificCourseResultContainer match={match} />
								</Grid>
							)
						}} />













						<Route path="/results" render={() => {
							return (
								<Grid id='gridsize'>

									<ResultsContainer />
								</Grid>
							)
						}} />

						<Route path="/specificresults" render={(match) => {
							return (
								<Grid id='gridsize'>

									<SpecificResultsContainer match={match} />
								</Grid>
							)
						}} />





						<Route path="/specificCoursePostForm" render={(match) => {
							return (
								<Grid id='gridsize'>

									<SpecificCoursePostFormContainer match={match} />
								</Grid>
							)
						}} />



						<Route path="/specificCoursePreForm" render={(match) => {
							return (
								<Grid id='gridsize'>

									<SpecificCoursePreFormContainer match={match} />
								</Grid>
							)
						}} />













						<Route path="/run" render={() => {
							return (
								<Grid id='gridsize'>

									<RunContainer />
								</Grid>
							)
						}} />














						<Route path="/delete" render={(match) => {
							return (
								<Grid id='gridsize'>

									<NameForm />
								</Grid>
							)
						}} />




						<Route path="/createmodify" render={() => {
							return (
								<Grid id='gridsize'>

									<CreateModifyContainer />
								</Grid>
							)
						}} />
						<Route path="/config" render={() => {
							return (
								<Grid id='gridsize'>

									<ConfigContainer />
								</Grid>
							)
						}} />




					</div>
				</div>
			</Router>
		);
	}
}

export default App; 