/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid, Panel, formgroups, Alert} from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button, InputGroup, Glyphicon, Col, Tab} from 'react-bootstrap';
import '../Views/NameForm.css';
import Form from 'react-bootstrap-form';
import axios from 'axios';
import backendlink from '../../config/links.js';
import { LinkContainer } from 'react-router-bootstrap';
import setAuthorizationToken from '../Containers/setAuthorizationToken.js' 
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import DynamicFormContainer from './DynamicFormContainer';
import './CreateCourseContainer.css'


class NameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    		scenarioInGeneration:0,
    		scenarioRoles:[],
			loading:0,
			table: {
				
				columns: [
			
	      ],
				rows: [
					{
						
					}
				]
			}
 };

  }




  componentDidMount() {
  	axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		axios.get(backendlink.backendlink+'/getcourse')
		.then(function (response) {
			var check = response.data;
			console.log(check);
			if(check&&check.error){
				//window.location.href = "./login";
			
			}
    		
    		var tables={};
			var data=response.data;	
			var that=this;

			console.log(data);
			
			data.forEach(function(row){
					// if(row['COURSE_ID']){
					// 	var editCourse='/specificCourse?course_id='+row['COURSE_ID'];
					// 	row['COURSE_ID']='<a href="'+editCourse+'"  role="button">Edit Curriculum</a>'
					// }

					Object.keys(row).forEach(function(key){
						if(typeof row[key] === "string"){

							if(row[key].includes('<a href="')||row[key].includes('<!--HTML-->')){
								row[key]=<div dangerouslySetInnerHTML={{__html: row[key]}} />;
							}
						}
					});
			});


			
			tables.rows=data;
			if(data.length>0){
				tables.columns= new Array();
				Object.keys(data[0]).forEach(function (value){
				var temp = {};

				if(value=="COURSE_ID"){
					temp.Header=  "1";	
				}else if(value=="COURSE_NAME"){
					temp.Header="Name";
				}else if(value=="UPDATE_AT"){
					temp.Header="Last Modified";
				}else if(value=="username"){
					temp.Header="Owner";
				}



				
		    	temp.accessor= value;
		    	temp.id=value;
		    	temp.filterMethod= function(filter, row) {
		    		if(row[filter.id] == null){
		    			return false;
		    		}
		    		var a =row[filter.id].toLowerCase();
		    		var b =  filter.value.toLowerCase();
		    		return a.includes(b);
		    	}
		    	console.log(temp);
		    	if(temp.Header){
		    		tables.columns.push(temp);	
		    	}
		    	
				});
				
				this.setState({table:tables});

			}else{
				var alert={
					flag:1,
					message:"No data found in this Report"
				}
				this.setState({alert:alert});
			}

		}.bind(this))
		.catch(function (error) {
    		console.log(error);
  		});
	}









	gotoSpec(id){
		
		window.location.href = "./specificCourseResult?course_id="+id;
		
	}


  render() {

  
  	var rows=this.state.table.rows;
  	console.log(rows);
  	var rowsHtml = [];


  	rowsHtml.push(
  		<Row className="rowHeader12321151">
  		<Col className="headercell134321" sm={6}>
  		<b>Curriculum Module</b>
  		</Col>

  		<Col className="headercell134321" sm={3}>
  		<b>Owner</b>
  		</Col>

  		<Col className="headercell134321" sm={3}>
  		<b><center>Show Results</center></b>
  		</Col>

  		</Row>

  		);



  	var that=this;

  	rows.forEach(function(eachrow){

  		var owner='Admin';
  		if(eachrow['username']){
  			owner=eachrow['username'];
  		}
		rowsHtml.push(
  		<Row className="row12321151">
  		<Col className="cell134321" sm={6}>
  		<b>{eachrow['COURSE_NAME']}</b>
  		</Col>

  		<Col className="cell134321" sm={3}>
  		<b>{owner}</b>
  		</Col>

  		<Col onClick={ ()=> that.gotoSpec(eachrow['COURSE_ID'])}  className="cell134321 btn success" sm={3}>
  		<b><center>View</center></b>
  		</Col>

  		</Row>

  		);  		
  	})



    return ( 
		<Grid className="whiteBackground">
			<Row>
			
				<Col sm={12}>
				<Tab.Container id="left-tabs-example" defaultActiveKey="second">
					  <Row className="clearfix">
					    <Col sm={12}>
					    <h5><b>SBME Curriculum</b></h5>

					    </Col>
					    <Col className="sidemenu93872" sm={3}>
					      <Nav bsStyle="pills" stacked> 
					      
					        
					        <NavItem className="sideMenu1"  eventKey="second"><span className="sideMenu"><Glyphicon glyph="pawn" /></span>&nbsp; &nbsp; &nbsp; My SBME Curriculum</NavItem>
					        <NavItem className="sideMenu1"  eventKey="third"><span className="sideMenu"><Glyphicon glyph="user" /></span>&nbsp; &nbsp; &nbsp; Shared SBME Curriculum</NavItem>
					      </Nav>
					    </Col>
					    <Col className="mainContent12342" sm={9}>
					      <Tab.Content animation>
					        
					        <Tab.Pane eventKey="second">
					        	<Row className="courseslist1321">
					        	
					        	<br/>
					        	<br/>
					        	{rowsHtml}
					        	</Row>

					        </Tab.Pane>
					        <Tab.Pane eventKey="third">
					        	<h5>No shared SBME Curriculum</h5>
					        </Tab.Pane>
					      </Tab.Content>
					    </Col>
					  </Row>
					</Tab.Container>;
				</Col>
				<Col sm={9}>
				</Col>
			
			</Row>		

    </Grid>
	
	
    )
  }
}


export default NameForm;  