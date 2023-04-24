/*jslint node: true, esversion:6 */
import React, { Component } from 'react'; 
import { Row, Grid, Panel, formgroups, Alert} from 'react-bootstrap';
import {Tabs,Tab, Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button, InputGroup, Glyphicon, Col, ListGroup, ListGroupItem} from 'react-bootstrap';
//import './NameForm.css'; 
import Form from 'react-bootstrap-form';
import axios from 'axios';
import backendlink from '../../config/links.js';

import setAuthorizationToken from './setAuthorizationToken.js'

import CircularProgressbar from 'react-circular-progressbar';

import PhysioDataResults from './PhysioDataResults.js' 

import ReactTable from 'react-table';
import './specificresultscontainer.css'
import queryString from 'query-string';

import { Player, ControlBar } from 'video-react';

import "../../node_modules/video-react/dist/video-react.css"; 


import  {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine} from 'recharts';

import './specificresultscontainer.css'
var ts = require("timeseries-analysis");




                    
class NameForm extends Component {

  constructor(props) {
    super(props);


    
    var query=queryString.parse(this.props.match.location.search);   

    this.state = {
    		deviceConnection:null,
    		playvids:[],
			serialNumber:null,
      vidSelected:0,
    		histSkillsDetails:{},
			histSpecificSkillsDetails:{},
			histEventsDetails:{},
    		actual:[1,1,1,1,1,1,1,1,1,1,1,11,1,1,1,1,1,1,1,1,1,1,1,1,11,1,1,1,1,1,1,1,1,1,1,1,1,11,1,1,1,1,1,1,1,1,1,1,1,1,11,1,1,1,1,1,1,1,1,1,1,1,1,11,1],
    		occured:[1,1,1,1,1,1,1,1,1,1,1,11,1,1,1,1,1,1,1,1,1,1,1,1,11,1,1,1,1,1,1,1,1,1,1,1,1,11,1,1,1,1,1,1,1,1,1,1,1,1,11,1,1,1,1,1,1,1,1,1,1,1,1,11,1],
    		traineeHist:[],
    		avgSkillPoints:{
    			behavioral:-1,
    			cognitive:-1,
    			psychomotor:-1
    		},
			play_id:query.play_id,
			lastname:query.lastname,
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
		        Header: 'Observer Name',
		        accessor: 'Observer Name'
		      },
		      {
		      	Header: 'TRAINEE Name',
		      	accessor: 'TRAINEE Name'
		      },
		      {
		      	Header: 'Observer Name',
		      	accessor: 'Observer Name'
		      },
		      {
		      	Header: 'EVENT_NAME',
		      	accessor: 'EVENT_NAME'
		      },
		      {
		      	Header: 'SKILL_TYPE',
		      	accessor: 'SKILL_TYPE'
		      },
		      {
		      	Header: 'SPECIFIC_SKILL',
		      	accessor: 'SPECIFIC_SKILL'
		      },
		      {
		      	Header: 'HEART_RATE',
		      	accessor: 'HEART_RATE'
		      },
		      {
		      	Header: 'SYSTOLIC_BP',
		      	accessor: 'SYSTOLIC_BP'
		      },
		      {
		      	Header: 'DISTOLIC_BP',
		      	accessor: 'DISTOLIC_BP'
		      },
		      {
		      	Header: 'SYSTOLIC_BP',
		      	accessor: 'SYSTOLIC_BP'
		      },
		      {
		      	Header: 'SPO2',
		      	accessor: 'SPO2'
		      },
		      {
		      	Header: 'R_RATE',
		      	accessor: 'R_RATE'
		      },
		      {
		      	Header: 'CARDIAC_RYTHM',
		      	accessor: 'CARDIAC_RYTHM'
		      },
		      {
		      	Header: 'POINTS',
		      	accessor: 'POINTS'
		      }

	      ],
				rows: [
					
				]
			}


 };

    this.play = this.play.bind(this);

  }
   componentDidMount() {	
 	axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
 	var params={
   			play_id:this.state.play_id,
   			lastname:this.state.lastname
   		}
   			
		axios.get(backendlink.backendlink+'/speceficresults',{
			params:params
		})
		.then(function (response) {



			var check = response.data;



			var traineeHist=[];
			if(check&&check.error){
				window.location.href = "./login?message="+check.message;
			}
			var tables=this.state.table;
			var data=response.data.playOutput;
			var timestampsEvents=[];

			var playvids=check.vidList;

			data.forEach(function(da){
				if(!da.TIME){
					da.TIME=0;
				}
				if(!da.TIMESTAMP){
					da.TIMESTAMP=0;
				}

				da.TIME=parseInt(da.TIME);
				da.TIMESTAMP=parseInt(da.TIMESTAMP);
				timestampsEvents.push(Math.round(da.TIMESTAMP/1000));
			});

			var deviceConnection = null;
			var serialNumber = null;

			if(data.length>0){
				deviceConnection=data[0].DEVICECONNECTTIME;
				serialNumber=data[0].SERIALNUMBER;
			}

			



			var occured= JSON.parse(JSON.stringify(data.sort(function(a, b){return a.TIMESTAMP-b.TIMESTAMP})));
			var actual= JSON.parse(JSON.stringify(data.sort(function(a, b){return a.TIME-b.TIME})));

			
			

			tables.rows=data;

			
			
			if(response && response.data&&response.data.histDetails&&response.data.histDetails.length>0 ){
				traineeHist=response.data.histDetails;	
			}


			


			var histSkillsDetails={};
			var histSpecificSkillsDetails={};
			var histEventsDetails={};

			if(response && response.data&&response.data.histSkillsDetails&&response.data.histSkillsDetails.length>0 ){
				var histSkillsDetailsArr=response.data.histSkillsDetails;	
				histSkillsDetailsArr.forEach(function(pointData){
					if(!histSkillsDetails[pointData['skill_type']]){
						histSkillsDetails[pointData['skill_type']]=[];
					}
					histSkillsDetails[pointData['skill_type']].push(pointData.points);
				});
			}


			if(response && response.data&&response.data.histSpecificSkillsDetails&&response.data.histSpecificSkillsDetails.length>0 ){
				var histSpecificSkillsDetailsArr=response.data.histSpecificSkillsDetails;	
				histSpecificSkillsDetailsArr.forEach(function(pointData){
					if(!histSpecificSkillsDetails[pointData['specific_skill']]){
						histSpecificSkillsDetails[pointData['specific_skill']]=[];
					}
					histSpecificSkillsDetails[pointData['specific_skill']].push(pointData.points);
				});
			}


			if(response && response.data&&response.data.histEventsDetails&&response.data.histEventsDetails.length>0 ){
				var histEventsDetailsArr=response.data.histEventsDetails;	
				histEventsDetailsArr.forEach(function(pointData){
					if(!histEventsDetails[pointData['event_name']]){
						histEventsDetails[pointData['event_name']]=[];
					}
					histEventsDetails[pointData['event_name']].push(pointData.points);
				});
			}


			
			var psychomotor =0;
			var cognitive=0;
			var behavioral=0;
			var psychomotorCount=0;
			var cognitiveCount=0;
			var behavioralCount=0;

			data.forEach(function(row){

				if(row.SKILL_TYPE=='psychomotor'){
					psychomotor=psychomotor+parseInt(row.POINTS);
					psychomotorCount=psychomotorCount+1;
				}
				if(row.SKILL_TYPE=='cognitive'){
					cognitive=cognitive+parseInt(row.POINTS);
					cognitiveCount=cognitiveCount+1;
				}
				if(row.SKILL_TYPE=='behavioral'){
					behavioral=behavioral+parseInt(row.POINTS);
					behavioralCount=behavioralCount+1;
				}
			});
			var avgSkillPoints={}
			if(psychomotorCount>0){
				avgSkillPoints.psychomotor=(psychomotor/psychomotorCount);
				
			}else{
				avgSkillPoints.psychomotor=-1;
			}
			
			if(behavioralCount>0){
				avgSkillPoints.behavioral=(behavioral/behavioralCount);
			}else{
				avgSkillPoints.behavioral=-1;
			}
			if(cognitiveCount>0){
				avgSkillPoints.cognitive=(cognitive/cognitiveCount);
			}else{
				avgSkillPoints.cognitive=-1;
			}

      this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));


			this.setState({
				table:tables,
				avgSkillPoints:avgSkillPoints,
				traineeHist:traineeHist,
				actual:actual,
				occured:occured,
				histSkillsDetails:histSkillsDetails,
				histSpecificSkillsDetails:histSpecificSkillsDetails,
				histEventsDetails:histEventsDetails,
				deviceConnection:deviceConnection,
				serialNumber:serialNumber,
				timestampsEvents:timestampsEvents,
				playvids:playvids
			});

		}.bind(this))
		.catch(function (error) {
    		
  		});
	}








displaySkills(datas){

	

	var graphs=[];
	var ph=3;

	Object.keys(datas).forEach(function(skill){
		

		if(datas[skill].length>3){
			var temp=[];

			var tempForcast=[];

			var skilly="Actual";
			var skilly1="Predictions";
			var skillx="Times";

			

			var forecasts=[];
			var data =JSON.parse(JSON.stringify(datas[skill]));

			

			for (var j=0;j<ph;j++){
				
				var t= new ts.main(ts.adapter.fromArray(data));
			 
				// // We're going to forecast the 11th datapoint
				var forecastDatapoint = data.length;

				 
				// // We calculate the AR coefficients of the 10 previous points
				var coeffs = t.ARMaxEntropy({
				    data: t.data.slice(data.length-3,data.length),
				    degree: 2
				});
				 
				
				
				 
				// Now, we calculate the forecasted value of that 11th datapoint using the AR coefficients:
				var forecast = 0;
				// // Init the value at 0.
				for (var i=0;i<coeffs.length;i++) { // Loop through the coefficients
				    forecast -= t.data[data.length-i-1][1]*coeffs[i];
				    // Explanation for that line:
				    // t.data contains the current dataset, which is in the format [ [date, value], [date,value], ... ]
				    // For each coefficient, we substract from "forecast" the value of the "N - x" datapoint's value, multiplicated by the coefficient, where N is the last known datapoint value, and x is the coefficient's index.
				}
				data.push(forecast)
				forecasts.push(forecast);
				

			}
			

			var dataWithForecast=datas[skill].concat(forecasts);

		


			dataWithForecast.forEach(function(eachdata,index){
				var temp1={};
				if(index<datas[skill].length){
					temp1[skilly]=eachdata;
				}

				if(index>=datas[skill].length-1){
					temp1[skilly1]=eachdata
				}

				
				
				
				temp1[skillx]=index;
				temp.push(temp1);
			})


			graphs.push(
				<Col className='whi2'  sm={12}>
						<br/>
						<br/>
					
						<b> {skill.toUpperCase()} ANALYSIS</b>
						<LineChart width={400} height={330} data={temp}
							margin={{top: 30, right: 0, left: 0, bottom: 20}}>
							<XAxis label={{ value: "# of Sessions", position: 'insideBottomRight', offset: 0 }}  dataKey={skillx}/>
							<YAxis label={{ value: " Points(1-100)", angle: -90, position: 'insideLeft'}} />
							<createClasssianGrid />
							<Tooltip/>
							<Legend verticalAlign="middle"  layout="horizontal"  align="right"/>
							
							<Line type="monotone" dataKey={skilly1} stroke="#ef131e" />	
							<Line type="monotone" dataKey={skilly} stroke="#8884d8" />	
       						<ReferenceLine y={90} label="Expert" stroke="red"/>


							
						</LineChart>

				</Col>

				);
		}

		
	});


	return(
			<Row>
				{graphs}

			</Row>
			)
}






trendAnalysis(){


	var histSkillsDetails = this.state.histSkillsDetails;
	var histSpecificSkillsDetails = this.state.histSpecificSkillsDetails;
	var histEventsDetails = this.state.histEventsDetails;
	

	return(
		<Row>
			<Col sm={12}>
				<center>
				<Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
					<Tab eventKey={1} title="Skills Analysis">
						{this.displaySkills(histSkillsDetails)}
					</Tab>
					<Tab eventKey={2} title="Specific Skills Analysis">
						{this.displaySkills(histSpecificSkillsDetails)}
					</Tab>
					<Tab eventKey={3} title="Events Analysis">
						{this.displaySkills(histEventsDetails)}
					</Tab>
				</Tabs>
				</center>
			</Col>
		</Row>

		);
}



  displayVids(){

      var playvids=this.state.playvids;

      var tabContent=[];
      var navContent=[];
      
      var vidSelected= this.state.vidSelected;
      var that = this;

      

              navContent.push(
          <ListGroupItem onClick={()=>{that.play()}}>sssks</ListGroupItem>

        );
      navContent.push(
          <ListGroupItem onClick={()=>{that.play()}}>sssks</ListGroupItem>

        );



      let v = this.play.bind(this);
      
      

      
        for(var i =0; i <playvids.length;i++){
            console.log("shit");
            that.play();
            navContent.push(
              <ListGroupItem onClick={()=>{that.play()}}>sssks</ListGroupItem>
              
            );


}
    
    




    return(
        <Row className="videoPlayer"> 
              <Col sm={3}>
                {this.displayReportHeader()}
                <br/>
                <br/>
                <input type="file" onChange={this.fileChangedHandler}/>
                <button onClick={this.uploadHandler}>Upload!</button>
              </Col>
              <Col sm={6}>
                    {tabContent}  
              </Col>
              <Col sm={3}>

                <ListGroup>
                  {navContent}
                </ListGroup>
                  
              </Col>
        </Row>  


      )
  }




displayGraph(){
	var avgData=[];
	var psychomotorData=[];
	var behavioralData=[];
	var cognitiveData=[];

	var specificresults={};

	
	var barData=this.state.traineeHist;
	var histSkillsDetails=this.state.histSkillsDetails;
	var histSpecificSkillsDetails=this.state.histSpecificSkillsDetails;
	var histEventsDetails=this.state.histEventsDetails;





	barData.forEach(function(eachdata){
		if(eachdata.PSYCHOMOTOR_AVG){
			eachdata.PSYCHOMOTOR_AVG=parseInt(eachdata.PSYCHOMOTOR_AVG);
		}else{
			eachdata.PSYCHOMOTOR_AVG=0;	
		}
		if(eachdata.BEHAVIORAL_AVG){
			eachdata.BEHAVIORAL_AVG=parseInt(eachdata.BEHAVIORAL_AVG);
		}else{
			eachdata.BEHAVIORAL_AVG=0;	
		}
		if(eachdata.TOTAL_AVG){
			eachdata.TOTAL_AVG=parseInt(eachdata.TOTAL_AVG);
		}else{
			eachdata.TOTAL_AVG=0;
		}
		if(eachdata.COGNITIVE_AVG){
			eachdata.COGNITIVE_AVG=parseInt(eachdata.COGNITIVE_AVG);
		}else{
			eachdata.COGNITIVE_AVG=0;				
		}
		var temp={};
		if(eachdata.TOTAL_AVG>0){
			temp.totalPoints=eachdata.TOTAL_AVG;
			temp.scenario=avgData.length;
			avgData.push(temp);
		}
		temp = {};
		if(eachdata.PSYCHOMOTOR_AVG>0){
			temp.psychomotorPoints=eachdata.PSYCHOMOTOR_AVG;
			temp.scenario=psychomotorData.length;
			psychomotorData.push(temp);
		}
		temp = {};
		if(eachdata.BEHAVIORAL_AVG>0){
			temp.behavioralPoints=eachdata.BEHAVIORAL_AVG;
			temp.scenario=behavioralData.length;
			behavioralData.push(temp);
		}

		temp = {};
		if(eachdata.COGNITIVE_AVG>0){
			temp.cognitivePoints=eachdata.COGNITIVE_AVG;
			temp.scenario=cognitiveData.length;
			cognitiveData.push(temp);
		}


	});



if(barData.length>0){
	
	return (
		
		<Row>
		<Row>
		<Col sm={6}>
		<center>

		<LineChart width={300} height={150} data={cognitiveData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="scenario"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="cognitivePoints" stroke="#8884d8" activeDot={{r: 8}}/>
       
      </LineChart>
      </center>


		</Col>
		<Col sm={6}>
		<center>
		<LineChart width={300} height={150} data={behavioralData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="scenario"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="behavioralPoints" stroke="#8884d8" activeDot={{r: 8}}/>
       
      </LineChart>
      </center>
		</Col>

		</Row>
<br/>
<br/>
      	<Row>
		<Col sm={6}>
		<center>
		<LineChart width={300} height={150} data={psychomotorData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="scenario"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="psychomotorPoints" stroke="#8884d8" activeDot={{r: 8}}/>
       
      </LineChart>
      </center>
		</Col>
		<Col sm={6}>
		<center>
		<LineChart width={300} height={150} data={avgData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="scenario"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="totalPoints" stroke="#8884d8" activeDot={{r: 8}}/>
       
      </LineChart>
      </center>
		</Col>
		</Row>




		</Row>
		

	);
}
return (
    	<div>data</div>
    );




  	
  
}
highlighti(id){
	var highlight=id;
	var actual =this.state.actual;
	var selectedTimestamp=0;



	actual.forEach(function(eachActual){
		if(eachActual.ID==id){

			selectedTimestamp=eachActual.TIMESTAMP;

		}
	});

	
	

	this.setState({
		highlight:highlight,
		selectedTimestamp:selectedTimestamp

	});


}

ale(){
	

}



displaySequenceActual(){

		var actual=this.state.actual;


		var individualResult=[];
		var that = this;


		if(actual && actual.length>0){
			var start =actual[0].ID;
		
			actual.forEach(function(data,index) {
				individualResult.push(
					<span>&nbsp;<button onClick={() => that.highlighti(data.ID)} className="btn btn-info btn-circle">{data.ID-start+1}</button>&nbsp;&nbsp;&nbsp;</span>
			
				);		
			});
		}

		return(

				<div>
				{individualResult}
				</div>
		);
	}


	displaySequenceOccured(){

		var actual=this.state.occured;

		var individualResult=[];
		var that = this;


		if(actual && actual.length>0){

			var start =this.state.actual[0].ID;
		
			actual.forEach(function(data,index) {
				individualResult.push(
					<span>&nbsp;<button onClick={() => that.highlighti(data.ID)} className="btn btn-primary btn-circle">{data.ID-start+1}</button>&nbsp;&nbsp;&nbsp;</span>
				);		
			});
		}

		return(

				<div>
				{individualResult}
				</div>
		);
	}




	





displaySequence(){
	var that = this;

	var sequence=[];
	var individualResult=[];
	var individualResult1=[];

	var occured=this.state.occured;
	

	return(
		<div>
				<center>
  				Sequence of Events:<br/>{this.displaySequenceOccured()}<br/><br/>
  				Anticipated Sequence of Events: {this.displaySequenceActual()}
  				</center>
  				<br/>
		</div>	
		);	

	
	return(
		<div></div>
		);

}

displayIndividual(){
	var individualResult=[];
	var datas=this.state.table.rows;
	var highlight=-1;
	if(this.state.highlight){
		highlight=this.state.highlight;
	}
	if(datas.length>0){
	datas.forEach(function(data) {
		var cla='score';
		if(data.ID==highlight){
			cla='selected';

		}
		individualResult.push(
			<Col className={cla}sm={4}>
			<div >
			<Row>
			<Col sm={8}>
				
				<h6>
					<b><span className='heading'>Event Name:</span> </b> <br/><b>{data.EVENT_NAME}</b>
				</h6>
				<h6>
				<span className='heading'>Skill: </span><br/>{data.SKILL_TYPE} <br/>
				</h6>
				<h6>
				<span className='heading'>Specific Skill: </span><br/>{data.SPECIFIC_SKILL}
				</h6>

			
			</Col>
			<Col sm={4}>
			<br/>
			<br/>
			<br/>
			<div className='inside'>
			<CircularProgressbar percentage={data.POINTS} />
			</div>
			</Col>
			</Row>
			</div>
			</Col>
			);		

	});
	return(
		<div>
  				{individualResult}
		</div>	
		);	

	}
	return(
		<div></div>
		);
	
	//individualResult.push(<h6>{data.EVENT_NAME}</h6>)
	

}

fileChangedHandler = (event) => {
  const file = event.target.files[0]
}


state = {selectedFile: null}

fileChangedHandler = (event) => {
  this.setState({selectedFile: event.target.files[0]})
}

uploadHandler = () => { 
	const formData = new FormData()

	
  	formData.append('myFile', this.state.selectedFile, this.state.play_id)

  	axios.post('http://localhost:1338/fileUpload', formData, {
    onUploadProgress: progressEvent => {
      console.log(progressEvent.loaded / progressEvent.total)
    }
 	}).then(function (response) {
		var check = response.data;
		console.log(check);

		this.setState({
			playvids:check.data
		})
		

		}.bind(this))
		.catch(function (error) {
    		
  		});

}


  displayReportHeader(){
	var datas=this.state.table.rows;
	if(datas.length>0){
		var totalScore=0;
		datas.forEach(function(data){
			totalScore=totalScore+parseInt(data.POINTS);

		});
		
		var avgScore=Math.round(totalScore/datas.length);
		return(
		<div>
		<h4 className='heading'>Results <a onClick="alert('printing is not connexted')"><Glyphicon glyph="print" /></a></h4>

		
		<Row>
		<Col sm={6}>
		<center>
		<h6>
		<b>Scenario Name:</b><br/>
		{datas[0].SCENARIO_NAME}
		</h6>
		<h6>
		<b>Category:</b><br/>
		{datas[0].CATEGORY}
		</h6>
		</center>
		
		<center>
		<h6>
		<b>Trainee Name:</b><br/>
		{datas[0]["TRAINEE Name"]}
		</h6>
		</center>
		</Col>

		<Col sm={6}>
		<center>
		<h6>
		<b>Observer Name:</b><br/>
		{datas[0]["Observer Name"]}
		</h6>
		<h6>
		<b>Average Score:</b><br/>
		{avgScore}
		</h6>
		<h6>
		<b>Expertise Level:</b><br/>
		N/A
		</h6>
		</center>
		</Col>

		</Row>
		</div>
		);

	}
	return(
		<h4 className='heading'>Results</h4>
		);
}	


 handleStateChange(state, prevState) {
    // copy player state to this component's state
    this.setState({
      player: state
    });
  }

  play() {
    console.log("hello")
    
  }







  render() {

  	var startTime=0;
  	var endTime=0

  	if(this.state.occured && this.state.occured.length>0){
  		startTime=this.state.occured[0].TIMESTAMP;
  		endTime=this.state.occured[this.state.occured.length-1].TIMESTAMP
  	}




  	
 

  
const AverageSkills = React.createClass({
	render () {
		return (
			<CircularProgressbar percentage={this.props.data} />
		);
		
		if(this.props.data!=-1){


			return (
				<CircularProgressbar percentage={this.props.data} />
			);
		}

		return(
			<center className='CircularProgressbar-path'><h1>N/A</h1></center>
		);
  	
  }
})


  	const divStyle = {
  		width: '200px'
	};
	const timelineStyle= {
		"background-color":"white",
		"border":"2px dotted grey"
	}


	var playvids=this.state.playvids;

	var tabContent=[];
	var navContent=[];

	if(playvids.length==0){



		navContent.push(
				<NavItem eventKey="0">No Video of this SBME uploaded</NavItem>

			)

		navContent.push(
				<NavItem eventKey="0">No Video of this SBME uploaded</NavItem>

			)
		navContent.push(
				<NavItem eventKey="0">No Video of this SBME uploaded</NavItem>

			)
		navContent.push(
				<NavItem eventKey="0">No Video of this SBME uploaded</NavItem>

			)
		navContent.push(
				<NavItem eventKey="0">No Video of this SBME uploaded</NavItem>

			)
		navContent.push(
				<NavItem eventKey="0">No Video of this SBME uploaded</NavItem>

			)
		navContent.push(
				<NavItem eventKey="0">No Video of this SBME uploaded</NavItem>

			)
		navContent.push(
				<NavItem eventKey="0">No Video of this SBME uploaded</NavItem>

			)
		navContent.push(
				<NavItem eventKey="0">No Video of this SBME uploaded</NavItem>

			)
		navContent.push(
				<NavItem eventKey="0">No Video of this SBME uploaded</NavItem>

			)


		tabContent.push(
				<Tab.Pane eventKey="1">
	        						<Player ref="player">
  										<source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
									</Player>


        						</Tab.Pane>

			)
		tabContent.push(
				<Tab.Pane eventKey="1">
	        						<Player ref="player">
  										<source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
									</Player>

        						</Tab.Pane>

			)
		tabContent.push(
				<Tab.Pane eventKey="1">
	        						<Player ref="player">
  										<source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
									</Player>

        						</Tab.Pane>

			)
		tabContent.push(
				<Tab.Pane eventKey="1">
	        						<Player ref="player">
  										<source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
									</Player>

        						</Tab.Pane>

			)
		tabContent.push(
				<Tab.Pane eventKey="1">
	        						<Player ref="player">
  										<source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
									</Player>

        						</Tab.Pane>

			)
		tabContent.push(
				<Tab.Pane eventKey="1">
	        						<Player ref="player">
  										<source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
									</Player>

        						</Tab.Pane>

			)
		tabContent.push(
				<Tab.Pane eventKey="1">
	        						<Player ref="player">
  										<source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
									</Player>

        						</Tab.Pane>

			)
		tabContent.push(
				<Tab.Pane eventKey="1">
	        						<Player ref="player">
  										<source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
									</Player>

        						</Tab.Pane>

			)
		tabContent.push(
				<Tab.Pane eventKey="1">
	        						<Player ref="player">
  										<source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
									</Player>

        						</Tab.Pane>

			)


		navContent.push(
				<NavItem eventKey="1">No Video of this SBME uploaded</NavItem>

			)

	}

    var that = this;
   var defaultActiveKey="1"

	playvids.forEach(function(data,index){

		if(defaultActiveKey=="1"){

      defaultActiveKey="d"+index;
      
    }
    




		tabContent.push(
				<Tab.Pane eventKey={"d"+index}>
									{index}
									<Player ref="player">
  										<source src={"http://localhost:1338/"+data.PATH} />
									</Player>
                  <Button onClick={()=>{this.play()}} bsSize="small">Rate Event</Button>
                </Tab.Pane>

			)
    



		navContent.push(
				<NavItem eventKey={"d"+index}>{"d"+index}</NavItem>

			)



	})

    return (
    

		<Grid >

    {this.displayVids()}
			<Row className="videoPlayer">	


      
				<Tab.Container id="left-tabs-example" defaultActiveKey={defaultActiveKey}>
  					<Row className="clearfix">
  						<Col sm={3}>
    						{this.displayReportHeader()}

    						<br/>
    						<br/>
    							<input type="file" onChange={this.fileChangedHandler}/>
								<button onClick={this.uploadHandler}>Upload!</button>
      						
    					</Col>
    					<Col sm={6}>
      						<Tab.Content animation>
        						{tabContent}
        							

      						</Tab.Content>
    					</Col>
    					<Col sm={3}>
      						<Nav bsStyle="pills" stacked>
        						{navContent}
      						</Nav>
    					</Col>



  					</Row>
				</Tab.Container>;

        



    		</Row>	

    		

				<Row>





			<Col sm={2}>





			</Col>
			<Col sm={8} className='main'>
	  		<Row>
	  			{this.displayReportHeader()}
	    		
	    		<br/>
	    		<br/>
	  		</Row>
	  		<Row>
	  		<Col sm={4}>

	  			<center><AverageSkills data={Math.round(this.state.avgSkillPoints.behavioral)} /></center>
	  			<center><h6>Behavioral Skills</h6></center>
	  			
	  		</Col>
	  		<Col sm={4}>
	  			<center><AverageSkills data={Math.round(this.state.avgSkillPoints.psychomotor)}  /></center>
	  			<center><h6>Psychomotor Skills</h6></center>
	  			
	  		</Col>
	  		<Col sm={4}>
	  			<center><AverageSkills data={Math.round(this.state.avgSkillPoints.cognitive)} /></center>
	  			<center><h6>Cognitive Skills</h6></center>
	  			
	  		</Col>
	  		</Row>
	  		<br/>
	  		<br/>
	  		
	  		<Row>
	  		
	  		
	  		{this.displaySequence()}



	  		<PhysioDataResults startTime= {startTime} endTime={endTime} deviceConnection={this.state.deviceConnection} serialNumber={this.state.serialNumber} timestamps={this.state.timestampsEvents} selectedTimestamp={this.state.selectedTimestamp} />
	  			
	  		
	  		</Row>

	  		<Row>
	  		{this.displayIndividual()}
	  		
	  			
	  		
	  		</Row>

	  		<Row>
		  		<br/>
		  		<br/>
		  		<div className='whi'>
		  			<center><h4 className='heading'>Previous Trend </h4></center>
		  		
		  			{this.trendAnalysis()}
		  		</div>
	  		</Row>


	  		<br/>
	    		<br/>
	    		<ReactTable
							columns={this.state.table.columns}
							data={this.state.table.rows}
							defaultFilterMethod={(filter, row) => (String(row[filter.id]) === filter.value)}
				/>
	    	
	 		</Col>
	 		<Col sm={2}></Col>
	 		</Row>
    
    </Grid>
	
	
    )
  }
}


export default NameForm; 