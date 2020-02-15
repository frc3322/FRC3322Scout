import React, { Component } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import MatchItem from './MatchItem'
import axios from 'axios'
import './SelectMatch.css'

export default class SelectMatch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            matches: [],
            itemNum: 0,
            searchTeamNumber: '',
            searchMatchNumber: '',
            newMatchShown: false,
            teamNumber: 0,
            matchNumber: 0,
            allianceNumber: 0,
            allianceColor: "blue"
        }
    }


    url = "http://" + window.location.hostname + ":8080";
    fetchEntries = (teamNumber = '', matchNumber = '') => { 

        fetch(this.url + '/getallscoutentries/' + this.state.itemNum + "?teamNumber=" + teamNumber + "&matchNumber=" + matchNumber).then(doc => doc.json()).then(doc => {
            let itemsGotten = 0;
            let newMatches = [];
            console.log(doc);
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

    handleClosed = () => {
        this.setState({newMatchShown: false});
    }

    formOnChanged = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }
    
    createMatch = () => {
        let {teamNumber, matchNumber, allianceNumber, allianceColor} = this.state;
        axios.post(this.url + '/create-match', {teamNumber, matchNumber, allianceColor, allianceNumber}).then(this.handleClosed());
    }

    render() {
        return (
            <React.Fragment>
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
                    <Row><Col xs="12"><Button onClick={()=>this.setState({newMatchShown: true})} style={{width: "100%"}}>Add Match</Button></Col></Row>
                    <Modal>Test</Modal>
                    {this.state.matches}
                </Container>
                
                <Modal show={this.state.newMatchShown}>
                <Modal.Header closeButton>
                <Modal.Title>Create Match</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display: 'flex', flexDirection:"column"}} className="searchContainer">
                    <input name="teamNumber" onChange={this.formOnChanged} placeholder="Team Number" />
                    <input name="matchNumber" onChange={this.formOnChanged} placeholder="Match Number" />
                    <label>Alliance Color</label>
                    <select name="allianceColor" onChange={this.formOnChanged} >
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                    </select>
                    <input name="allianceNumber" onChange={this.formOnChanged} placeholder="Alliance Number" />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClosed}>
                    Close
                </Button>
                <Button variant="primary" onClick={this.createMatch}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
            </React.Fragment>
        )
    }
}
