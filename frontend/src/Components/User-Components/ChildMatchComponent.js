import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './ChildMatchComponent.css';
import { Link } from 'react-router-dom';

class ChildMatchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            match: props.match
        };
    }

    render() {
        let { match } = this.props;
        return (
            <Row>
                <Col xs="12" md="9" lg="8">
                    <Container className="matchItem">
                        <Row>
                            <Col xs="4">
                                <h4> Match {match.matchNumber}</h4>
                            </Col>
                            <Col xs="4" style={{textAlign: 'center'}}>
                                <h4>Team {match.robot.teamNumber}</h4>
                            </Col>
                            <Col xs="4" style={{textAlign: 'end'}}>
                            <h4 style={{color: (match.won === true) ? "green": "red"}}>{(match.won === true) ? "Won": "Lost"}</h4>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: '1em'}}>
                            <Col className="mx-auto">
                                <div style={{display: 'flex', justifyContent: "center"}}>
                                    <Link to={"/teams/" + this.state.match.robot.teamNumber}>
                                        <Button style={{marginRight: '1em'}}>Team Statistiics</Button>
                                    </Link>
                                    <Button>Match Performance</Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
                <Col></Col>
            </Row>
        );
    }
}

export default ChildMatchComponent;