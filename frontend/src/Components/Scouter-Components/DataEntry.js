import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import DataEntryItem from './DataEntryItem';
import PropTypes from 'prop-types'

export default class DataEntry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {stats: [[], [], []]};
    }

    teamNumber = 0;
    componentDidMount() {
        let { teamNumber, matchNumber } = this.props.match.params;
        this.setState({teamNumber, matchNumber});
        let url = "http://" + window.location.hostname + ":8080/getallscoutentries/0?teamNumber=" + parseInt(this.props.match.params.teamNumber) + "&matchNumber=" + parseInt(this.props.match.params.matchNumber);
        fetch(url).then(doc=>doc.json()).catch(err=>console.log("Error")).then(doc=>{
            console.log(doc)
            if (doc.length > 0) {
                if (doc[0].hasOwnProperty('stats')) {
                    console.log(doc[0])
                    this.setState({stats: [doc[0].stats.auto, doc[0].stats.teleop, doc[0].stats.endgame]})
                }
            }
        });
    }

    displayItems = () => {
        let itemsList = [];
        let { stats } = this.state;
        if (stats[0].length > 0) {
            console.log(stats);
            stats[0].forEach((item, key) => itemsList.push(<DataEntryItem key={key} item={item} />));
        }
        return itemsList;
    }

    render() {
        let { teamNumber, matchNumber} = this.state;



        return (
        <Container fluid="true">
            <Row><Col xs="6" style={{textAlign: "center"}}><h1>Team {teamNumber} </h1> </Col> <Col> <h1> Match {matchNumber} </h1></Col></Row>
            <Row style={{marginTop: "2em"}} />
            {this.displayItems()}
            </Container>
        )
    }
}