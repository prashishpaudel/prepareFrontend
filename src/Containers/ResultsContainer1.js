/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap';
//import './NameForm.css'; 

import axios from 'axios';
import backendlink from '../../config/links.js';
import 'react-table/react-table.css'
import './RunContainer.css'
class ResultsContainer1 extends Component {

  constructor(props) {
    super(props);

    
    this.state = {
    	course_id:this.props.course_id,
			
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
		      	Header: 'Trainee Name',
		      	accessor: 'Trainee Name'
		      },
		      {
		      	Header: 'Observer name',
		      	accessor: 'Observer name'
		      },
		      {
		      	Header: 'behavioral AVG',
		      	accessor: 'behavioral AVG'
		      },
		      {
		      	Header: 'psychomotor AVG',
		      	accessor: 'psychomotor AVG'
		      },
		      {
		      	Header: 'cognitive AVG',
		      	accessor: 'cognitive AVG'
		      },
		      {
		      	Header: 'more_info',
		      	accessor: 'more_info'
		      }
	      ],
				rows: [
					
				]
			}
 };

  }
   componentDidMount() {	
 	axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
 		var params={
   			course_id:this.state.course_id
   		}

   		console.log(this.state.course_id)
   			
		axios.get(backendlink.backendlink+'/results',{
			params:params

		})
		.then(function (response) {
			console.log(response.data);
			var check = response.data;
			if(check&&check.error){
				//window.location.href = "./login?message="+check.message;
			}
			var tables=this.state.table;
			var data=response.data;
			console.log(data);
			data.forEach(function(row){
				if(row['play_id']){
					var specificresults='/specificresults?play_id='+row['play_id']+'&lastname='+row['trainee_l_name'];

					row['more_info']='<a href="'+specificresults+'" class="btn btn-success .btn-sm" role="button">More info</a>'
					row['more_info']=<div dangerouslySetInnerHTML={{__html: row['more_info']}} />;
				}
			});
			tables.rows=data;
			this.setState({table:tables});

		}.bind(this))
		.catch(function (error) {
    		
  		});
	}


gotoSpec(id,l_name){
		
		window.location.href = "./specificresults?play_id="+id+'&lastname='+l_name;
		
	}

  render() {
	var rows=this.state.table.rows;
	
	var rowsHtml=[];
	var that=this;



	rowsHtml.push(
  		<Row className="rowHeader12321151">
  		<Col className="headercell134321" sm={4} >
  		<b>Scenario Name</b>
  		</Col>

  		<Col className="headercell134321" sm={3}>
  		<b>Learner Name</b>
  		</Col>

		  <Col className="headercell134321" sm={2}>
  		<b>Date</b>
  		</Col>

  		<Col className="headercell134321" sm={2}>
  		<b><center>DEVICE ID</center></b>
  		</Col>

  		<Col className="headercell134321" sm={1}>
  		<b><center>Results</center></b>
  		</Col>

  		</Row>

  		);


	


	rows.forEach(function(eachRow){

		if(eachRow['SERIALNUMBER']==null){
			eachRow['SERIALNUMBER']='N/A';
		}
		var dte = new Date(eachRow['CREATED_AT']);
		var dteString = (dte.getMonth() + 1) + '/' + dte.getDate() + '/' + dte.getFullYear();
		rowsHtml.push(
	  		<Row className="row12321151">
	  		<Col className="cell134321" sm={4}>
	  		<b>{eachRow['SCENARIO_NAME']}</b>
	  		</Col>
	  		<Col className="cell134321" sm={3}>
	  		<b>{eachRow['Trainee Name']}</b>
	  		</Col>
			  <Col className="cell134321" sm={2}>
	  		<b>{dteString}</b>
	  		</Col>
	  		<Col className="cell134321" sm={2}>
	  		<b>{eachRow['SERIALNUMBER']}</b>
	  		</Col>

	  		<Col onClick={ ()=> that.gotoSpec(eachRow['play_id'],eachRow['trainee_l_name'])}  className="btncell134321 btn success" sm={1}>
	  		<b><center>View</center></b>
	  		</Col>

	  		</Row>

  		);  

	});

	// <ReactTable
	// 						columns={this.state.table.columns}
	// 						data={this.state.table.rows}
	// 						defaultFilterMethod={(filter, row) => (String(row[filter.id]) === filter.value)}
	// 			/>

    return (

		<div className="mainsection53224521">

			<Col sm={12}>
	  		<Row>
	    		<h4>Results</h4>
	    		
	    	</Row>

	  			{rowsHtml}
	  		
	    		
	    	
	 		</Col>
    
    </div>
	
	
    )
  }
}


export default ResultsContainer1; 