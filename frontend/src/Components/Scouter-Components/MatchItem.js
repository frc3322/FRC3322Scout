import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

export default class MatchItem extends Component {
    render() {
        return (
            <Container className="matchItem">
                <Row>
                    <Col xs="6"><h4>Team {this.props.teamNumber}</h4></Col>
                    <Col xs="6" style={{textAlign: "end"}}> <h4>Match {this.props.matchNumber}</h4></Col>
                </Row>
            </Container>
        )
    }
}
