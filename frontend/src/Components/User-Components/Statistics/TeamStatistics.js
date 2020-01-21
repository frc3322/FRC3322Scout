import React, { Component } from 'react'
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import './TeamStatistics.css';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { Line, Doughnut } from "react-chartjs-2";

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
        if (mCollection !== undefined) {
            if (mCollection.length > 0) {
                let itemName = "";
                let nItems = 0;
                let outputData = [];

                for (let i = 0; i < mCollection[0].length; i++) {
                    switch (mCollection[0][i].chartType) {

                        case "L":
                            mCollection.forEach(match => {
                                outputData.push(match[i].dataValue);
                                nItems++;
                                itemName = match[i].name;
                            });
                            output.push(<Row key={i} className="statsRow"><Col xs="6" md="4"><h4>{itemName}</h4></Col><Col xs="6" md="2"><h4>{(outputData.reduce((total, a) => total + a) / nItems).toFixed(2)}</h4></Col><Col md="6"><Line data={{labels: [...Array(outputData.length).keys()].map(element => "Match " + (element + 1)), datasets: [{
                                label: itemName,
                                data: outputData,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)'
                                ],
                                borderWidth: 1,
                                fill: false
                            }]}} options={{
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }} /> </Col></Row>);
                            outputData = [];
                            nItems = 0;
                            break;
                        
                        case "O":
                            // Do pie chart stuff
                            mCollection.forEach(match => {
                                outputData.push(match[i].dataValue);
                                nItems++;
                                itemName = match[i].name;
                            });
                            let doughnutData = [0, 0];
                            outputData.forEach(element => (element === true) ? doughnutData[0]++ : doughnutData[1]++);
                            
                            output.push(<Row key={i} className="statsRow"><Col xs="6" md="4"><h4>{itemName}</h4></Col><Col className="itemCol" xs="6" md="2"><h4>{(outputData.reduce((total, a) => total + a) / nItems * 100).toFixed(2)}%</h4></Col><Col xs="12" md="6"><Doughnut data={{labels: ["Did the thing", "Didn't do the thing"], datasets: [{
                                data: doughnutData,
                                backgroundColor: [
                                    'rgba(66, 245, 135, 0.2)',
                                    'rgba(255, 99, 132, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(61, 219, 122, 1)',
                                    'rgba(255, 99, 132, 1)'
                                ],
                                borderWidth: 1,
                                fill: false
                            }]}} /> </Col></Row>);
                            outputData = [];
                            nItems = 0;
                            break;
                        default:
                            output.push(<Row key={i}><Col>Unknown data type</Col></Row>);
                    }
                }

                }
            }

        
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
