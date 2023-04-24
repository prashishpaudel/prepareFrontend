/*jslint node: true, esversion:6 */ 
import React, { Component } from 'react';
import { Row, Grid, Panel, formgroups, Alert} from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button, InputGroup, Glyphicon, Col} from 'react-bootstrap';
//import './NameForm.css';
import Form from 'react-bootstrap-form';
import axios from 'axios';
import backendlink from '../../config/links.js';

import play from '../img/playbutton.jpg'
import pause from '../img/pausebutton.jpg'
import like from '../img/like.png';
import dislike from '../img/dislike.png';
import acc from '../img/acc.png';
import hr from '../img/hr.png';

import sweat from '../img/sweat.png';
import temp from '../img/temp.png';


import ReactTable from 'react-table';
import 'react-table/react-table.css'
import './PlayScenarioContainer.css'
import queryString from 'query-string';
import setAuthorizationToken from './setAuthorizationToken.js'

import PhysioContainer from './PhysioContainer.js';

import ScanMonitorContainer from './ScanMonitorContainer.js';


class NameForm extends Component {

  constructor(props) {
	super(props);
	var query=queryString.parse(this.props.match.location.search);   
	this.state = {
			loaded:0,
			scenario_id:query.scenario_id,
			learnerData:[],
			deviceData:[],
			level:-1,
			roleRating:{},
			significantEvent:[],
			comments:[],
			play:0,
			playStatus:{
				timeleft:0,
				flashCounter:0
			},
			table: {
				sort: {
					column: "age",
					order: "desc"
				},
				columns: [
					{
			   Header: 'Event name',
		        accessor: 'EVENT_NAME'
		      },
		      {
		        Header: 'Skill type',
		        accessor: 'SKILL_TYPE'
		      },
		      {
		      	Header: 'Specific Skill',
		      	accessor: 'SPECIFIC_SKILL'
		      },
		      {
		      	Header: 'Time Start',
		      	accessor: 'TIME_START'
		      }
	      ],
				rows: [
					{
						event_id:1
					}
				]
			}
 };

  }

 
   componentDidMount() {	
   		var params={
   			scenario_id:this.state.scenario_id
   		}
   		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		axios.get(backendlink.backendlink+'/getevent',{ 
    		params: params
  		})
		.then(function (response) {
			var check = response.data;
			
			if(check&&check.error){
				window.location.href = "./login?message="+check.message;
			}
			

    		var tables=this.state.table;
			var data=response.data.data;
			var playStatus=this.state.playStatus;
			


			if(response.data&&response.data.scenarioDetails&&response.data.scenarioDetails.length>0&&response.data.learnerData&&response.data.deviceData&&playStatus&&response.data.roles&&response.data.roles.length>0){
				this.setState({scenarioName:response.data.scenarioDetails[0].SCENARIO_NAME});
				this.setState({scenarioTime:response.data.scenarioDetails[0].TIME_DURATION});
				playStatus.timeleft=response.data.scenarioDetails[0].TIME_DURATION;

				//Chhavne
				//response.data.deviceData = [{"SERIALNUMBER":123,"STARTTIME":0},{"SERIALNUMBER":1234,"STARTTIME":0}];

				
				this.setState({
					playStatus:playStatus,
					roles:response.data.roles,
					learnerData:response.data.learnerData,
					deviceData:response.data.deviceData,
					loaded:1
				});

			}else{
				var error= {
					flag:1,
					message:'Major problem this is then ent]'
				}
			}
			

			data.forEach(function(row){

				Object.keys(row).forEach(function(key){
					if(typeof row[key] === "string"){
					if(row[key].includes('link</a>')||row[key].includes('<!--HTML-->')){
						row[key]=<div dangerouslySetInnerHTML={{__html: row[key]}} />;
					}
					}
				});
			});
			
			tables.rows=data;
			if(data.length>0){
				this.setState({table:tables});

			}else{
				var elert={
					flag:1,
					message:"No data found in this Report"
				}
				this.setState({elert:elert});
			}
			this.updateNodeTimestamp();

		}.bind(this))
		.catch(function (error) {
    		
  		});
	}
	patanai(){
  		alert('hamza');
  	}
	addRoleRating(SCENARIO_ROLE_ID,index,rating){
  	var roles=[];
  	
  	if(this.state && this.state.roles){
  		roles=this.state.roles;
  		
  	}
  	console.log(roles);
  	roles[index]['RATING']=rating;
  	this.setState({roles:roles});
  }
	selectNode(){
		var nodes=this.state.nodes;
		var timeLeft=this.state.playStatus.timeleft;
		var scenarioTime= this.state.scenarioTime;
		var ind=-1;
		nodes.forEach(function(node,index){
			if(node.time==scenarioTime-timeLeft){
				ind=index;
			}
		});
		if(ind>=0){
			this.selectEvent(ind);
		}
	}
	playbuttonTriggered(){
		if(this.state.play==0){
			this.setState({play:1});
			var abb=setInterval(function(){

				var playStatus=this.state.playStatus;
				playStatus.flashCounter=(playStatus.flashCounter+1)%2;
				this.selectNode();
				if(playStatus.timeleft==0||this.state.play==0){
					
				}else{
					playStatus.timeleft=playStatus.timeleft-1;
				}
				this.setState(playStatus:playStatus);
			}.bind(this), 1000);
		}else{
			this.setState({play:0})
		}
	}

	selectEvent(index){
		console.log(index);
		var nodes=this.state.nodes;
		if(nodes){
			
			nodes.forEach(function(node,index){
				node.selected=0;
			});
			nodes[index].selected=1;
			var rating=50;
				
				if(nodes[index].rating){
					rating=nodes[index].rating;
				}
				if(document.getElementById('ratingBarform')){
					document.getElementById('ratingBarform')['points'].value=rating;
				};

			this.setState(nodes:nodes);
		}
	}
	findRoleIndex(str){
		var options=[];
		var index=-1;
		if(this.state&& this.state.roles&& this.state.roles.length>0){
			this.state.roles.forEach(function(role,i){
				if(role.ROLE_NAME==str){
					index=i;
				}
			});
		}
		return index;
	}
	displayEvent(){
		var nodes=this.state.nodes;
		if(nodes){
			var ind=-1;
			nodes.forEach(function(node,index){
				if(node.selected==1){
					ind=index;
				}
			});
			if(ind>-1){

				var that=this;

				return(
					<div>
					<br/>
					<b>Event Name:</b>{nodes[ind].eventName}<br/>
					<b>Event Type:</b>{nodes[ind].label}<br/>
					<b>Specific Event:</b>{nodes[ind].specificLabel}<br/>
					</div>
					)
			}else{
				return(<center><br/><br/><h4>Select Event</h4></center>)
			}
			
		}
	}
	rateEvent(index){
		var nodes=this.state.nodes;
		var points=document.getElementById('points'+index).value;
		nodes[index].rating=points;
		this.setState({nodes:nodes});
	}

	eventLike(index){
		var nodes=this.state.nodes;
		
		nodes[index].completed=true;
		nodes[index].completedTime=new Date().getTime();

		


		this.setState({nodes:nodes});
	}


	eventLike1(index,rating){
		var nodes=this.state.nodes;
		nodes[index].completed=true;
		nodes[index].completedTime=new Date().getTime();
		nodes[index].skillLevel=rating;

		


		this.setState({nodes:nodes});
	}


	eventDislike(index){
		var nodes=this.state.nodes;
		
		nodes[index].completed=false;





		var timeleft = this.state.scenarioTime-nodes[index].time;

		var playStatus={
				'timeleft':timeleft,
				'flashCounter':1
			};
		this.setState({
			nodes:nodes,
			playStatus:playStatus
		});
	}


	displayRatingBar(){

		const play_pause={
		width:'60px'
		}
		var style={
			 'text-align': 'center',
			  'vertical-align': 'middle'
		}
		var style1={
			 'color': 'red'
		}
		var nodes=this.state.nodes;
		if(nodes){
			var ind=-1;
			nodes.forEach(function(node,index){
				if(node.selected==1){
					ind=index;
				}
			});

			
			if(ind>-1){

				var that=this;
				var id='points'+ind;
				var warning1='';
				var warning='';
				if(nodes[ind].time>(this.state.scenarioTime-this.state.playStatus.timeleft)){
					warning1='This event has not Occured yet according to the sytem time';
				}
				if(nodes[ind].rating){
					warning='This Event has been graded';
				}
				var ratingBar=[];


				if(nodes[ind].completed && nodes[ind].completed==true){
					ratingBar.push(
						<div>
						<Col sm={6}>
							<left>Poor</left>
						</Col>
						<Col sm={6}>
							<right>Excellent</right>
						</Col>
						<Col sm={12}>
						<form id='ratingBarform'>
						  <input className="range blue inputab" type="range" id={id} name='points' min="0" max="100"/>
						  <Button onClick={()=>{this.rateEvent(ind)}} bsSize="small">Rate Event</Button>
						</form>
						</Col>
						</div>
						)
				}
				else{

					ratingBar.push(
						<div>
							
							<br/>
							<Button onClick={()=>{that.eventLike1(ind,0)}}  bsStyle="info">Novice</Button>&emsp;&emsp;&emsp;&emsp;
  							<Button onClick={()=>{that.eventLike1(ind,1)}} bsStyle="primary">Intermediate</Button>&emsp;&emsp;&emsp;&emsp;
  							<Button onClick={()=>{that.eventLike1(ind,2)}} bsStyle="success">Expert</Button>
						</div>
						)


				}
				return(
					<div style={style}>
					<br/>
						<p style={style1}>{warning}</p>
						
						<p style={style1}>{warning1}</p>
						<Col sm={12}>


						
		
						{ratingBar}
						
						<br/>
						<br/>
						</Col>
					</div>
					);
				
			}else{
				return(<center><br/><h4>Select Event</h4></center>)
			}
			
		}
	}


	displayRatingBarList(){

		const play_pause={
		width:'60px'
		}
		var style={
			 'text-align': 'center',
			  'vertical-align': 'middle'
		}
		var style1={
			 'color': 'red'
		}
		var nodes=this.state.nodes;
		var ratingBar=[];
		if(nodes){
			var that=this;
			nodes.forEach(function(node,ind){
				var id='points'+ind;
					
				if(!nodes[ind].rating){


					if(nodes[ind].completed && nodes[ind].completed==true){
						ratingBar.push(
							<Row className="row212131">
								<Col sm={12}>
									
								
										<b>Event Name: </b>{nodes[ind].eventName}<br/>
										<b>Event Type: </b>{nodes[ind].label}<br/>
										<b>Specific Event: </b>{nodes[ind].specificLabel}<br/>
										<br/>
									
								</Col>
								<br/>
								<Col sm={12}>
									<Col sm={6}>
										<left>Poor</left>
									</Col>
									<Col sm={6}>
										<right>Excellent</right>
									</Col>
									<Col sm={12}>
									<form id='ratingBarform'>
									  <input className="range blue inputab" type="range" id={id} name='points' min="0" max="100"/>
									  <Button onClick={()=>{that.rateEvent(ind)}} bsSize="small">Rate Event</Button>
									</form>
									</Col>
								</Col>
							</Row>
							)
					}
					else{

						ratingBar.push(

							<Row className="row212131">
								<Col sm={12}>
									
								
										<b>Event Name: </b>{nodes[ind].eventName}<br/>
										<b>Event Type: </b>{nodes[ind].label}<br/>
										<b>Specific Event: </b>{nodes[ind].specificLabel}<br/>
										<br/>

									
								</Col>		
													
								<Col sm={12}>
								
								
									
										<Button onClick={()=>{that.eventLike1(ind,0)}}  bsStyle="info">Novice</Button>&emsp;&emsp;&emsp;&emsp;
			  							<Button onClick={()=>{that.eventLike1(ind,1)}} bsStyle="primary">Intermediate</Button>&emsp;&emsp;&emsp;&emsp;
			  							<Button onClick={()=>{that.eventLike1(ind,2)}} bsStyle="success">Expert</Button>
									

								</Col>
								
							</Row>



							
							)


					}
					
				}
				
			});




					
				return(
					<div style={style}>
					<br/>
						
						<Col sm={12}>


						
		
						{ratingBar}
						
						<br/>
						<br/>
						</Col>
					</div>
					);
				
			
			
		}
	}
	displayTimelne(){ 
		var that = this;
		var circles=[];

		console.log(screen.width);
		var width= 725
		var height=120;


		if(document.getElementById("gridsize")){
			 width= ((document.getElementById("gridsize").offsetWidth))-100;
		}else{
			 width= (screen.width/12)*7-40;
		}


		circles.push(<line x1={20} y1={height} x2={width+20} y2={height} stroke="green" strokeWidth={2} />)
		var scenarioTime= this.state.scenarioTime;
		var nodes=this.state.nodes;
		var upto = (((scenarioTime-(this.state.playStatus.timeleft))/scenarioTime)*width)+20;
		var significantEvent=this.state.significantEvent;
		if(significantEvent){
			var cs =50;
			significantEvent.forEach(function(event,index){
				console.log('Hello');
				console.log(index);
				var r = 20;
				var cyval =height+18-1*(r+5)*2-cs;
				var time = ((event.time/scenarioTime)*width)+20;
				circles.push(<rect x={time} y={cyval} fill="red" width={15} height={15} onClick={() => that.selectEvent(index)}></rect>);
			})

		}
		if(nodes){
			this.state.nodes.forEach(function(node,index){
			var color='';
			var r = 20;
			var cs =50;
			var legend=that.findRoleIndex(node.role);
			if(node.label=='Start'){
				color="rgba(46, 139, 87,1)";
				r=10;
				cs=10;

			}else if(node.label=='behavioral'){
				color="rgba(255, 182,193,1)";
				r=width/80;

			}else if(node.label=='psychomotor'){
				color="rgba(30,144,255,1)";
				r=width/80;

			}else if(node.label=='cognitive'){
				color="rgba(75,0,130,1)";
				r=width/80;
			}else{
				color="rgba(213, 93, 9,1)";	
				r=10;
				cs=10;
			}

			
			var time = ((node.time/scenarioTime)*width)+20;
			var count=0;
			
			for(var i=0;i<index;i++){				
				var temptime=((nodes[i].time/scenarioTime)*width)+20;
				if(Math.abs(time-temptime)<=(r*2+10)){
					count=count+1;
				}
			}
			var cyval =height+18-(count)*(r+5)*2-cs;
			if(node.selected==1){
				var color2="rgba(255, 240, 0,1)";
				circles.push(
				<circle cx={time} cy={cyval} fill={color2} r={r+10} onClick={() => that.selectEvent(index)}></circle>
				);
			}

			if(nodes[i].rating){
				circles.push(
					<circle cx={time} cy={cyval} fill="red" r={r+5} onClick={() => that.selectEvent(index)}></circle>
				);
			}
			
			if(time<=upto){
				var color1='';
				var flash=0;
				if(nodes[i].rating){
					color1="red";
				}else{
					
					flash=(that.state.playStatus.flashCounter)%2;
					color1="green";
				}
				if(flash==0){
				circles.push(
				<circle cx={time} cy={cyval} fill={color1} r={r+5} onClick={() => that.selectEvent(index)}></circle>
				);
				}
			}

			circles.push(
				<circle cx={time} cy={cyval} fill={color} r={r} onClick={() => that.selectEvent(index)}></circle>
				);
				circles.push(
				<text x={time+r+5} y={cyval+r/2} font-family="sans-serif" font-size="25px" fill="(0,0,0,0.5)">{legend+1}</text>
				);

		});
		for(var i=1;i<10;i++){
			circles.push(
			<circle cx={i*(width/10)+20} cy={height} fill="rgba(0,0,0,0.5)"   r={5}></circle>
			)
			var str= "rotate(0 "+(i*(width/10)+20)+","+290+")";
			circles.push(
			 <text x={i*(width/10)+28} y={height+14} font-family="sans-serif" font-size="15px" transform={str} fill="(0,0,0,0.5)">{Math.round((scenarioTime/10)*i)}</text>
			)
		}

		// circles.push(
		// 	 <text x={width/2} y={height+40} font-family="sans-serif" font-size="25px" fill="(0,0,0,0.5)">Minutes</text>
		// 	)

		circles.push(
				<circle cx={20} cy={height} fill="rgba(46, 139, 87,1)"  r={10}></circle>
		);

		circles.push(
				<circle cx={width+20} cy={height} fill="rgba(213, 93, 9,1)" r={10}></circle>
		);

		if(this.state.play==0){
			circles.push(<line x1={20} y1={height} x2={upto} y2={height} stroke="rgba(213, 93, 9,0.4)" strokeWidth={40} />)
		}else if(this.state.play==1){
			circles.push(<line x1={20} y1={height} x2={upto} y2={height} stroke="rgba(213, 93, 9,0.4)" strokeWidth={49} />)

		}
		
		return(
		<svg width={width+40} height={height+50}>
  				{circles}
			</svg>	
		);

		}		
	}

	displayLegend(){
		var that = this;
		var circles=[];
		var width=0;
		if(document.getElementById("gridsize")){
			 width= ((document.getElementById("gridsize").offsetWidth)/12)*7;
		}else{
			 width= (screen.width/12)*7;
		}
		
		var height=80;

			circles.push(
				<circle cx={25} cy={15} fill="rgba(75,75,75,1)" r={5}></circle>
				);
			circles.push(
				<text x={35} y={25} font-family="sans-serif" fontSize={20} fill="(0,0,0,0.5)">Legends</text>
				);
			
			circles.push(
			 <text x={40} y={60} font-family="sans-serif" font-size="25px" fill="(0,0,0,0.5)">Psychomotor</text>
			)

			circles.push(
				<circle cx={25} cy={55} fill="rgba(30,144,255,1)" r={10}></circle>
				);

			circles.push(
			 <text x={155} y={60} font-family="sans-serif" font-size="25px" fill="(0,0,0,0.5)">Cognitive</text>
			)
			
			circles.push(
				<circle cx={140} cy={55} fill="rgba(75,0,130,1)" r={10}></circle>
				);

			circles.push(
			 <text x={270} y={60} font-family="sans-serif" font-size="25px" fill="(0,0,0,0.5)">Behavioral</text>
			)

			circles.push(
				<circle cx={255} cy={55} fill="rgba(255, 182,193,1)" r={10}></circle>
				);

		
		if(this.state&& this.state.roles&& this.state.roles.length>0){
			var dist=0
			this.state.roles.forEach(function(role,i){
				var tempx=35+dist;
				var tempy=100;
				var str = role.ROLE_NAME.trim();
				dist=dist+6*str.length+40;
				
				circles.push(
					<text x={tempx-15} y={tempy+5} font-family="sans-serif" font-size="25px" fill="(0,0,0,0.5)">{i+1}</text>
				)

				circles.push(
					<circle cx={tempx} cy={tempy} fill="rgba(75,75,75,1)" r={5}></circle>
				)
				circles.push(
					<text x={tempx+10} y={tempy+5} font-family="sans-serif" fontSize={10} fill="(0,0,0,0.5)">{str}</text>
				)
				
			});

		}else{
			
		}
		return(
		<svg width={width+40} height={height+50}>
  				{circles}
			</svg>	
		);

			
		
	}

	updateNodeTimestamp(){
		var nodes=[];
		var temp={};
		this.state.table.rows.forEach(function(event){
			temp = {
				time:event.TIME_START,
				eventName:event.EVENT_NAME,
				label:event.SKILL_TYPE,
				specificLabel:event.SPECIFIC_SKILL,
				selected:0,
				id:event.EVENT_ID,
				role:event.ROLE_NAME,
				scenario_role_id:event.SCENARIO_ROLE_ID
			}
			nodes.push(temp);
		});
		this.setState({nodes:nodes});
	}
	displayPlaybutton(){
		const play_pause={
		width:'30px'
		}
		var that=this;
		if(this.state.play==0){
			return(<img onClick={()=>{that.playbuttonTriggered()}} style={play_pause} alt="logo" src={play} />);
		}else{
			return(<img onClick={()=>{that.playbuttonTriggered()}} style={play_pause} alt="logo" src={pause} />);
		}
	}


  displayRoleRating(){


   	

  }

	savePlay(){
		var trainee={};

		if(this.state&& this.state.trainee){
			trainee=this.state.trainee;
		}
		
		var roles=this.state.roles;

		roles.forEach(function(role){
			if(trainee[role.SCENARIO_ROLE_ID]){
				trainee[role.SCENARIO_ROLE_ID]['rating']=role.RATING;
			}
		});

  		var nodes = JSON.stringify(this.state.nodes);
  		
  		var comments=JSON.stringify(this.state.comments);
  		trainee=JSON.stringify(trainee);

  		
  		
  	 	var params= {
  	 		trainee:trainee,
  	 		nodes:nodes,
  	 		comments:comments,
  	 		scenario_id:this.state.scenario_id
  	 	}


  	 	
  	 		console.log(params);

  	 		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
  			axios.get(backendlink.backendlink+'/saveplay', {
	    		params: params
  			})
			.then(function (response) {
    			if(response.data.error){
				console.log(response.data);
    				console.log(response.data.error);
    				alert('PLease contact Admin');
				}else{
					
					location.reload();
					//window.location.href = "./";

				}
			}.bind(this))
			.catch(function (error) {
  			});

  	 	
  }
  saveComment(){
  	var significantEvent = this.state.significantEvent;
  	var playStatus= this.state.playStatus;
  	var timeLeft = playStatus.timeleft; 
  	var scenarioTime = this.state.scenarioTime;
  	var comment=document.getElementById("commentform").elements["comment"].value;
  	comment=comment.trim();
  	document.getElementById("commentform").elements["comment"].value="";
	
  	if(this.state&&this.state.comments ){
  		var comments=this.state.comments;
  		comments.push(comment);
  		var temp = {}; 
  		temp.name='comment';
  		temp.time=scenarioTime-timeLeft;
  		significantEvent.push(temp);
  		this.setState({comments:comments});	
  	}
		
	}
  saveTrainee(){
  	var deviceData=this.state.deviceData;
  	var learnerData=this.state.learnerData;

  	var roles=[];
  	if(this.state && this.state.roles){
  		roles=this.state.roles;
  	}
  	var masterFlag=0;
  	var allTrainees={};
  	roles.forEach(function(role){
  		var subjectIndex = document.getElementById("savetrainee").elements[role.SCENARIO_ROLE_ID+"learner"].value;
  	  	var deviceIndex = document.getElementById("savetrainee").elements[role.SCENARIO_ROLE_ID+"device"].selectedOptions;

  	  	if(!subjectIndex){
  	  		masterFlag=1;
  	  		alert("No Subject Selected");
  	  	}
  	  	else{
  	  		var traineefname = learnerData[subjectIndex]["LEARNER_NAME"];
	  	  	var traineelname = learnerData[subjectIndex]["LEARNER_NAME"];
	  	  	var dicipline = learnerData[subjectIndex]["FACULTY"];
	  	  	var years = learnerData[subjectIndex]["YEARS"];
	  	  	var LEARNER_ID=learnerData[subjectIndex]["LEARNER_ID"];
	  	  	var ROCKET_ID=learnerData[subjectIndex]["ROCKET_ID"];

	  	  	var serialNumber= [];
			var deviceConnectTime= [];
			

			console.log(deviceIndex);
			for(var i=0;i<deviceIndex.length;i++){
				console.log(deviceIndex[i].value);
				console.log(deviceData);
				serialNumber.push(deviceData[deviceIndex[i].value]["SERIALNUMBER"]);
				deviceConnectTime.push(deviceData[deviceIndex[i].value]["STARTTIME"]);
			}
			

	  	  	traineefname=traineefname.trim();
	  		traineelname=traineelname.trim();
	  		dicipline=dicipline.trim();
	  		
	  	  	var flag=0;
	  	  	if (flag==0){
	  	  		var trainee={
	  	  			traineefname:traineefname,
	  				traineelname:traineelname,
	  				dicipline:dicipline,
	  				years:years,
	  				deviceConnectTime:deviceConnectTime,
	  				serialNumber:serialNumber,
	  				learnerid:LEARNER_ID,
					rocketid:ROCKET_ID
	  	  		}
	  	  		allTrainees[role.SCENARIO_ROLE_ID]=trainee;
	  	  	}
	  			
  	  	}
  	  	});
  	  	
  		if(masterFlag==0){
  			this.setState({trainee:allTrainees});	
  		}
  	
  	


  }
  alertr(k){
  	console.log(k);
  }


  participantInfoForm(){

  	var roles=[];
  	var deviceData=this.state.deviceData;
  	var learnerData =this.state.learnerData;
  	var deviceDataHTML=[];
  	var learnerDataHTML=[];


  	
  	
  	if(this.state && this.state.roles){ 
  		roles=this.state.roles;
  	}
  	var patientInfoForm=[];

  	deviceData.forEach(function(eachData,index){
  		deviceDataHTML.push(
  			<option value={index}>{eachData.SERIALNUMBER}</option>
  			);
  	});




  	learnerData.forEach(function(eachData,index){
  		learnerDataHTML.push(
  			<option value={index}>{eachData.LEARNER_NAME}/{eachData.ROCKET_ID}/{eachData.LEARNER_ID}</option>
  			);
  	});




  	roles.forEach(function(role){
	  	var role_name=role.ROLE_NAME;
	  	patientInfoForm.push(<h4>Information About {role_name}</h4>);
	  	patientInfoForm.push(
  						<table>

  							<tr>
								<td width="160" valign="bottom" ><b>Select Subject</b></td>
	  							<td>
	  							  <select name={role.SCENARIO_ROLE_ID+"learner"} cols="80">
    									{learnerDataHTML}
  								</select>
	  							
	  							</td>
	  							<td></td>
	  						</tr>

	  						<tr>
								<td width="160" valign="bottom" ><b>Select Device</b></td>
	  							<td>
	  							  <select multiple id="deviceOptions" name={role.SCENARIO_ROLE_ID+"device"} cols="80">
    									{deviceDataHTML}
  								</select>
	  							
	  							</td>
	  							<td></td>
	  						</tr>	
						</table>

						)
						patientInfoForm.push(<br/>);
						patientInfoForm.push(<br/>);

  	});
  	
  	
  	
  	return(
				<div>
				{patientInfoForm}
				</div>
			);
  }


  displayPhysio(){


  	var trainee = this.state.trainee;

  	var physio = [];
  	
  	Object.keys(trainee).forEach(function(tr){
  		
  		trainee[tr].deviceConnectTime.forEach(function(data,ind){
  			
  			physio.push(
  				<div> Device Id: {trainee[tr].serialNumber[ind]} <br/> 
  				Device Connection Time: {trainee[tr].deviceConnectTime[ind]}
  				</div>
  			)	

  			physio.push(
  				<PhysioContainer deviceConnection={trainee[tr].deviceConnectTime[ind]} serialNumber={trainee[tr].serialNumber[ind]}/>
  			)	
  		})
  		

  	});
  	return physio;

  }

  	
	displaySaveButton(){
		var that = this;
		
		
		if(this.state&&this.state.nodes){

		var nodes = this.state.nodes;
		var flag=1;
		nodes.forEach(function(node){
			if(!node.rating){
				flag=0;
			}
		})

		var roles=[];
		 if(this.state && this.state.roles){
  			roles=this.state.roles;
  		}
  		var cont=[];
  		roles.forEach(function(role,index){
  		if(!role.RATING){
  		cont.push(
  			<div>
  				{role.ROLE_NAME}: 

  				<Button onClick={that.addRoleRating.bind(that, role.SCENARIO_ROLE_ID,index,1)}>Novice</Button>
  				<Button onClick={that.addRoleRating.bind(that, role.SCENARIO_ROLE_ID,index,2)}>Competent</Button>
  				<Button onClick={that.addRoleRating.bind(that, role.SCENARIO_ROLE_ID,index,3)}>Expert</Button>
  				<br/><br/>
  			</div>
  			)
  		}
  		
  		});
		

		if(flag==0){
			return(
			<h4>Please rate all events to save </h4>
			);
		}else{
			if(cont.length>0){
				return(
					<div>
						<h4> Please Rate the Skill of the Trainee:</h4>
						{cont}
						
					</div>
					)
				

			}else{
				return(
				<div>
				<Button onClick={this.savePlay.bind(this)}>Save</Button>
				</div>
			);

			}
			
		}
	}


}

  render(){
  	const divStyle = {
  		width: '200px'
	};
	const timelineStyle= {
		"background-color":"white",
		"border":"2px dotted grey"
	}
	const h4style={
		'font-size':'12px'
	}
	if(this.state.trainee){
		const play_pause={
		width:'55px',
		padding:'5px'
		}

		const boxPhysio={
		border: "1px solid black",
		height:"62px",
		padding:"5px",
		"background-color": "#ffd9cc"
		}


	return (
		<Grid>
			<Col sm={12}>
	  		<Row>
				<h4>Play Scenario: {this.state.scenarioName}</h4>
	  		</Row>
	  		<Row style={timelineStyle}>
	  		
	  		
	  		<Col sm={12}>
	  		</Col>
	  		
	  		<Col sm={6}>
	  		{this.displayLegend()}
	  		</Col>
	  		<Col sm={6}>
	  		<br/>
	  		<Button bsStyle="danger" className="Danger" onClick={ ()=> this.setState({ open1: !this.state.open1 })}>Add Significant Event</Button>
				<Panel collapsible expanded={this.state.open1}>	
					<Row>
					<Col sm={8}>
					<form action="" id="commentform">
						<textarea rows="2" cols="40"  name="comment"  />
					</form>
					</Col>
					<Col sm={4}>
					<center>
					<Button bsSize="medium" onClick={this.saveComment.bind(this)}>Add Event</Button>
					</center>
					</Col>
					</Row>

	    			</Panel>
	  		</Col>

	  		<Col sm={8}>
	  		{this.displayTimelne()}
	  		</Col>
	  		<Col sm={4}>
	  		
	  		</Col>
	  		<Col sm={8}>
	  		{this.displayRatingBar()}
	  		</Col>
	  		<Col sm={4}>
	  		 <center>{this.displayEvent()}

	  		 {this.displayPlaybutton()} <h4>{this.state.playStatus.timeleft}<span style={h4style}>sec left</span></h4> </center><br/>
	  		</Col>
	  		</Row>
	  		<br/>
			<Row>
				<Col sm={12}>
				{this.displayRatingBarList()}
				</Col>
				<Col sm={8}>
					{this.displaySaveButton()}		
				</Col>
			</Row>
		</Col>
	</Grid>
	)
}else{


	if(this.state.loaded==0){
		return(
			<h1>Loading</h1>
			)
	}

	return (
			<div>
				<h1>Enter Information about your trainee</h1>

				<Grid className="whiteBg">
					<Col sm={8}>
	  					<Row>
							<form action="" id="savetrainee">
								{this.participantInfoForm()}
					 			<Button className="btn-primary" onClick={this.saveTrainee.bind(this)}>Proceed</Button>
							</form> 
	  					</Row>
	  				</Col>
	  				<Col sm={4}>
	  					<Row>
	  					<h4>Scanned Devices</h4>
	  					<ScanMonitorContainer />
	  					</Row>
	  				</Col>

	  			</Grid>

				

			</div>
		);
}
  }
}


export default NameForm; 