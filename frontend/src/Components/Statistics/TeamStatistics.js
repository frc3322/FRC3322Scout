import React, { Component } from 'react'
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import './TeamStatistics.css';
import DropdownItem from 'react-bootstrap/DropdownItem';

export default class TeamStatistics extends Component {

    url = "http://localhost:8080";

    constructor(props) {
        super(props)
        this.state = {
            selected: "",
            stats: [],
            auto: [],
            teleop: [],
            endgame: []
        }
    }

    schema = {
        auto: {
            testStat: Number,
        },
        teleop: {
            testStat: Number,
        },
        endgame: {
            testStat: Number,
        },
        
    }

    getMatch = (teamNumber) => {
        fetch(this.url + '/getteamstats/' + teamNumber).then(doc=>doc.json()).then((doc) => {
            doc.forEach(element => {
                if (element.stats !== undefined) {
                    this.setState(prevState => ({stats: [...prevState.stats, element.stats]}));
                }
            });

            //TODO Add verification

            let total, nItems;

            Object.keys(this.schema).forEach(section => {
                Object.keys(this.schema[section]).forEach(stat => {
                    total = 0;
                    nItems = 0;
                    this.state.stats.forEach(match => {
                        total += match[section][stat];
                        nItems++;
                    });

                    this.setState(prevState => ({[section]: [
                        ...prevState[section], {[stat]: (total/nItems)}
                    ]}));
                    
                });
            });
            

        });
    }

    displayEntries = () => {
        let mCollection;
        switch (this.state.selected) {
            case "Autonomous":
                mCollection = this.state.auto;
                break;
                
            case "Teleop":
                mCollection = this.state.teleop;
                break;

            case "Endgame":
                mCollection = this.state.endgame;
                break;
            
            default:
                console.log(this.state.selected);
                return ("");
        }
        let output = mCollection.map((element, id) => {
            let elementKeys = Object.keys(element);
            if (elementKeys !== undefined){
                return(
                <Row key={id} className="statsRow"><Col xs="6" md="4"><h4>{elementKeys[0]}</h4></Col><Col xs="6" md="2"><h4>{element[elementKeys[0]]}</h4></Col></Row>
                );
            } else {
                return "wtf";
            }
        });
        return(output);
    }

    setSelected = (name) => this.setState({selected: name}); 

    componentDidMount() {
        let { teamNumber } = this.props.match.params;
        this.getMatch(teamNumber);
    }

    render() {
        let { teamNumber } = this.props.match.params;  
        console.log(this.displayEntries());
        return (
        <Container fluid="true">
            <Row style={{paddingTop: '1em'}}>
                <Col style={{textAlign: 'center'}}>
                    <h3>Team {teamNumber} Statistics</h3>
                </Col>
            </Row>
            <Row>
                <Col />
                <Col lg="3" md="5" sm="12" className="statistics-selector">
                    <Dropdown>
                        <DropdownButton title={(this.state.selected !== "") ? this.state.selected : "Select"}>
                            <DropdownItem onClick={this.setSelected.bind(this, "Autonomous")}>
                                Autonomous
                            </DropdownItem>
                            <DropdownItem onClick={this.setSelected.bind(this, "Teleop")}>
                                Teleop
                            </DropdownItem>
                            <DropdownItem onClick={this.setSelected.bind(this, "Endgame")}>
                                Endgame
                            </DropdownItem>
                        </DropdownButton>
                    </Dropdown>
                </Col>
                <Col />
            </Row>
            <hr />
            <Row><Col xs="6" md="4"><h2>Statistic</h2></Col><Col xs="6" md="2"><h2>Average</h2></Col></Row>
            {this.displayEntries()}    
        </Container>
        )
    }
}
