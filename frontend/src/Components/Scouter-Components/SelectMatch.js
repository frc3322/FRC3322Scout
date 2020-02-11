import React, { Component } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import MatchItem from './MatchItem'
import './SelectMatch.css'

export default class SelectMatch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            matches: [],
            itemNum: 0,
            searchTeamNumber: '',
            searchMatchNumber: ''
        }
    }


    url = "http://" + window.location.hostname + ":8080";
    fetchEntries = (teamNumber = '', matchNumber = '') => { 

        fetch(this.url + '/getallscoutentries/' + this.state.itemNum + "?teamNumber=" + teamNumber + "&matchNumber=" + matchNumber).then(doc => doc.json()).then(doc => {
            let itemsGotten = 0;
            let newMatches = [];
            
            doc.forEach(element => {
                newMatches.push(<Row className="scoutEntryItem" key={"t" + element.teamNumber + "m" + element.matchNumber}><MatchItem teamNumber={element.teamNumber} matchNumber={element.matchNumber} key={this.state.itemNum}></MatchItem></Row>)
                itemsGotten++;
            });

            this.setState((prevState) => {return {itemNum: prevState.itemNum + itemsGotten}});
            this.setState((prevState) => {return {matches: [...prevState.matches, ...newMatches]}});
        }); 
    }

    clearDataThenFetch = (teamNumber = '', matchNumber = '') => {
        this.setState({matches: [], itemNum: 0}, () => {
            this.fetchEntries(teamNumber, matchNumber);
        })
    }

    searchOnChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    componentDidMount() {
        this.fetchEntries(this.state.searchTeamNumber, this.state.searchTeamNumber);
    }
    
    render() {
        return (
            <Container className="searchContainer" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Row style={{width: "100%"}}>
                    <Col xs="0" md="2" />
                    <Col xs="6" md="3">
                    <input style={{width: "100%", padding: "1em 0.5em"}} placeholder="Team Number" name="searchTeamNumber" onChange={this.searchOnChange}></input>
                    </Col>
                    <Col xs="6" md="3"><input style={{width: "100%", padding: "1em 0.5em"}} placeholder="Match Number" name="searchMatchNumber" onChange={this.searchOnChange}></input></Col>
                    <Col xs="12" md="2" style={{display: "flex"}}><Button style={{width: "100%"}} onClick={this.clearDataThenFetch.bind(this, this.state.searchTeamNumber, this.state.searchMatchNumber, true)}>Search Entries</Button></Col>
                    <Col xs="0" md="2"/>
                </Row>
                {this.state.matches}
            </Container>
        )
    }
}
