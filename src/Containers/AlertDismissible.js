import React, { Component } from 'react';
import { Row, Grid, Panel, formgroups, Alert} from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button, InputGroup, Glyphicon, Col, Tab} from 'react-bootstrap';

class AlertDismissible extends React.Component {
  constructor(props) {
    super(props);

    this.state = { show: true };
  }

  render() {
    const handleHide = () => this.setState({ show: false });
    const handleShow = () => this.setState({ show: true });
    
    

    var divs = [];

    if(this.state && this.state.show){
      divs.push(
              <div>
              <Alert show={this.state.show} variant="success">
                <p>
                  Duis mollis, est non commodo luctus, nisi erat porttitor ligula,
                  eget lacinia odio sem nec elit. Cras mattis consectetur purus sit
                  amet fermentum.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={handleHide} variant="outline-success">
                    Close me ya'll!
                  </Button>
                </div>
              </Alert>

              {!this.state.show && <Button onClick={handleShow}>Show Alert</Button>}
              </div>
        )
    }

    return (
        <div>
          {divs}
        </div>
      
    );
  }
}

export default AlertDismissible;