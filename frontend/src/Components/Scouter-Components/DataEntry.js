import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import DataEntryItem from './DataEntryItem';

const AUTO = 0, TELEOP = 1, ENDGAME = 2;

export default class DataEntry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {stats: [[], [], []]};
    }

    teamNumber = 0;
    componentDidMount() {
        let { teamNumber, matchNumber } = this.props.match.params;
        this.setState({teamNumber, matchNumber});
        let url = window.location.host + "/:8080/getallscoutentries/"+parseInt(this.props.match.params.teamNumber)+"/"+parseInt(this.props.matchNumber);
    }
    

    render() {
        let { teamNumber, matchNumber} = this.state;
        return (
        <Container>
            <Row><Col xs="12" style={{textAlign: "center"}}><h1>Team {teamNumber} &emsp; Match {matchNumber} </h1></Col></Row>
            <DataEntryItem itemName = "Test"></DataEntryItem>
            </Container>
        )
    }
}
