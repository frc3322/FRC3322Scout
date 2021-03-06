import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
import "./TeamStatistics.css";
import Comment from './Comment.js';

export default class StatisticItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {chartShown: false}
    }

    toggleChart = () => {
        this.setState((prevState)=>{return {chartShown: !prevState.chartShown}});
    }

    generate = () => {
        let { itemName, chartType, data, labels} = this.props;
        let nItems = data.length;
        switch (chartType) {
            case "L":
                return(
                <Row className="statsRow" onClick={this.toggleChart}>
                    <Col xs="6" md="4"><h4>{itemName}</h4></Col>
                    <Col xs="6" md="2"><h4>{(data.reduce((total, a) => total + a) / nItems).toFixed(2)}</h4></Col>
                    <Col md="6">{(this.state.chartShown) ? <Line data={{labels: labels, datasets: [{
                        label: itemName,
                        data: data,
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
                    }} /> : ""}</Col>
                </Row>);
            
            case "O":
                // Do pie chart stuff
                let doughnutData = [0, 0];
                data.forEach(element => (element === true) ? doughnutData[0]++ : doughnutData[1]++);
                
                return (<Row className="statsRow" onClick={this.toggleChart}><Col xs="6" md="4"><h4>{itemName}</h4></Col><Col className="itemCol" xs="6" md="2"><h4>{(data.reduce((total, a) => total + a) / nItems * 100).toFixed(2)}%</h4></Col><Col xs="12" md="6"> {(this.state.chartShown) ? <Doughnut data={{labels: ["Did the thing", "Didn't do the thing"], datasets: [{
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
                }]}} /> : ""} </Col></Row>);
            case "C":
                return(
                <Row className="statsRow">
                    <Col xs="6" md="4"><h4>{itemName}</h4></Col>
                    <Col xs="6" md="2"><Comment comments={data} matchNum={labels}/></Col>
                </Row>);
            default:
                return (<Row><Col>Unknown data type</Col></Row>);
        }
    }

    render() {
        return (this.generate())
    }
}

StatisticItem.propTypes = {
    itemName: PropTypes.string.isRequired,
    outputData: PropTypes.array.isRequired,
    chartType: PropTypes.string.isRequired,
}