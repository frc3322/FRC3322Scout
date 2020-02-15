import React from 'react'
import { Container, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import DataEntryItem from './DataEntryItem';
import PropTypes from 'prop-types'
import axios from 'axios';
import scoutValidate from "../../SchemaValidator.js"
import DropdownItem from 'react-bootstrap/DropdownItem';
import ToggleItem from './ToggleItem';

const AUTO = "Autonomous", TELEOP = "Teleop", ENDGAME = "Endgame";

export default class DataEntry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stats: {
                auto: [],
                teleop: [],
                endgame: []
            },
            currentPeriod: AUTO,
            itemsList: []
        };
    }

    teamNumber = 0;
    componentDidMount() {
        let { teamNumber, matchNumber } = this.props.match.params;
        this.setState({teamNumber, matchNumber});
        let url = "http://" + window.location.hostname + ":8080/getallscoutentries/0?teamNumber=" + parseInt(this.props.match.params.teamNumber) + "&matchNumber=" + parseInt(this.props.match.params.matchNumber);
        fetch(url).then(doc=>doc.json()).catch(err=>console.log("Error")).then(doc=>{
            if (doc.length > 0) {
                if (doc[0].hasOwnProperty('stats')) {
                    this.setState({stats: doc[0].stats}, this.displayItems)
                }
            }
        });
    }

    displayItems = () => {
        let itemsList = [];
        let mCollection;
        if (this.state.currentPeriod === AUTO) mCollection = this.state.stats.auto;
        else if (this.state.currentPeriod === TELEOP) mCollection = this.state.stats.teleop;
        else mCollection = this.state.stats.endgame;



        if (mCollection.length > 0) {
            mCollection.forEach((item, key) => {
                if (item.chartType === "L") {
                    itemsList.push(<Row key={key}> <Col /><Col md="6"><DataEntryItem index={key} item={item} update={this.updateFromChild.bind(this, key)} /></Col><Col /></Row>)
                } else if (item.chartType === "O") {
                    itemsList.push(<Row key={key}> <Col /><Col md="6"><ToggleItem index={key} item={item} update={this.updateFromChild.bind(this, key)} /> </Col><Col /></Row>)
                }
                }
            );
        }
        console.log(mCollection.length)
        this.setState({itemsList})
    }

    updateItems = () => {
        let { teamNumber, matchNumber} = this.props.match.params;
        let { stats } = this.state;
        
        let url = "http://" + window.location.hostname + ":8080/updateteam";;
        axios.post(url, {teamNumber, matchNumber, stats}).then(res=>console.log(res));
    }

    updateFromChild = (index, data) => {
        let mCollection;
        if (this.state.currentPeriod === AUTO) mCollection = this.state.stats.auto;
        else if (this.state.currentPeriod === TELEOP) mCollection = this.state.stats.teleop;
        else mCollection = this.state.stats.endgame;

        mCollection[index].dataValue = data;

        if (this.state.currentPeriod === AUTO) this.setState({"stats.auto": mCollection});
        else if (this.state.currentPeriod === TELEOP) this.setState({"stats.teleop": mCollection});
        else mCollection = this.setState({"stats.endgame": mCollection});
    }

    setSelected = (newPeriod) => {
        this.setState({currentPeriod: newPeriod, itemsList: []}, this.displayItems)
    }; 

    render() {
        let { teamNumber, matchNumber} = this.state;


        return (
            <Container fluid="true">
            <Row><Col xs="6" style={{textAlign: "center"}}><h1>Team {teamNumber} </h1> </Col> <Col style={{textAlign: "center"}}> <h1> Match {matchNumber} </h1></Col></Row>
            <Row><Col /><Col xs="12" md="4"> 

            <Dropdown>
                <DropdownButton style={{width: "100%"}} title={this.state.currentPeriod}>
                <DropdownItem onClick={this.setSelected.bind(this, AUTO)}>Autonomous</DropdownItem>
                <DropdownItem onClick={this.setSelected.bind(this, TELEOP)}>Teleop</DropdownItem>
                <DropdownItem onClick={this.setSelected.bind(this, ENDGAME)}>Endgame</DropdownItem>
                </DropdownButton>
            </Dropdown>
            </Col><Col /></Row><Row/>
            {this.state.itemsList}
            <Row style={{marginTop: "3em"}}><Col /> <Col md="5">
                <Button style={{width: "100%", padding: "1em"}} onClick={this.updateItems}> Save </Button>
                </Col><Col />
            </Row>
            </Container>
        )
    }
}