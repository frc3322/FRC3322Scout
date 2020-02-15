import React, { Component } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default class MatchItem extends Component {
    render() {
        let { teamNumber, matchNumber } = this.props;
        return (
            <Container className="matchItem">
                <Row>
                    <Col xs="6"><h4>Team {teamNumber}</h4></Col>
                    <Col xs="6" style={{textAlign: "end"}}> <h4>Match {matchNumber}</h4></Col>
                </Row>
                <Row><Col xs="1" md="4" /><Col><Link to={"/data-entry/" + teamNumber + "/" + matchNumber}><Button style={{width: "100%"}}>Edit</Button></Link></Col><Col xs="1" md="4" /></Row>
            </Container> 
        )
    }
}
