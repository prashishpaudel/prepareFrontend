/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import {Row,Grid} from 'react-bootstrap';
import {Col} from 'react-bootstrap';
//import './NameForm.css'; 
import axios from 'axios';
import backendlink from '../../config/links.js';
import ReactTable from 'react-table';
import 'react-table/react-table.css'


class ResultsContainer extends Component {

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

   			
		axios.get(backendlink.backendlink+'/results')
		.then(function (response) {
			console.log(response.data);
			var check = response.data;
			if(check&&check.error){
				window.location.href = "./login?message="+check.message;
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


  render() {
    return (

		<Grid>
			<Col sm={12}>
	  		<Row>
	    		<h4>Results</h4>
	  		</Row>
	  		
	    		<ReactTable
							columns={this.state.table.columns}
							data={this.state.table.rows}
							defaultFilterMethod={(filter, row) => (String(row[filter.id]) === filter.value)}
				/>
	    	
	 		</Col>
    
    </Grid>
	
	
    )
  }
}


export default ResultsContainer; 