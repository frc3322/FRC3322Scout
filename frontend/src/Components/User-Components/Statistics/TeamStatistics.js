import React, { Component } from 'react'
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import './TeamStatistics.css';
import DropdownItem from 'react-bootstrap/DropdownItem';

export default class TeamStatistics extends Component {

    url = "http://" + window.location.hostname + ":8080";

    constructor(props) {
        super(props)
        this.state = {
            selected: "",
            auto: [],
            teleop: [],
            endgame: []
        }
    }

    getMatch = (teamNumber) => {
        fetch(this.url + '/getteamstats/' + teamNumber).then(doc=>doc.json()).then((doc) => {
            doc.forEach(element => {
                if (element.stats !== undefined) {
                    this.setState(prevState => ({
                        auto: [...prevState.auto, element.stats.auto],
                        teleop: [...prevState.teleop, element.stats.teleop],
                        endgame: [...prevState.endgame, element.stats.endgame],
                    }));
                }
            });

        });
    }

    displayEntries = () => {
        let mCollection;
        let output = [];
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
                return ("");
        }
        if (mCollection != undefined) {
            if (mCollection.length > 0) {
                
                let name = "";
                let n = 0;
                let data = [];

                for (let i = 0; i < mCollection[0].length; i++) {
                    switch (mCollection[0][i].chartType) {

                        case "L":
                            mCollection.forEach(match => {
                                data.push(match[i].dataValue);
                                n++;
                                name = match[i].name;
                            });
                            output.push(<Row key={i} className="statsRow"><Col xs="6" md="4"><h4>{name}</h4></Col><Col xs="6" md="2"><h4>{(data.reduce((total, a) => total + a) / n).toFixed(2)}</h4></Col></Row>);
                            data = [];
                            n = 0;
                            break;
                        
                        case "O":
                            // Do pie chart stuff
                            mCollection.forEach(match => {
                                data.push(match[i].dataValue);
                                n++;
                                name = match[i].name;
                            });
                            output.push(<Row key={i} className="statsRow"><Col xs="6" md="4"><h4>{name}</h4></Col><Col xs="6" md="2"><h4>{(data.reduce((total, a) => total + a) / n * 100).toFixed(2)}%</h4></Col></Row>);
                            data = [];
                            n = 0;
                            break;
                            break;
                    }
                }

                }
            }

        // 
        return(output);
    }

    setSelected = (name) => this.setState({selected: name}); 

    componentDidMount() {
        let { teamNumber } = this.props.match.params;
        this.getMatch(teamNumber);
    }

    render() {
        let { teamNumber } = this.props.match.params;  
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
