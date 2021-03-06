import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './DataEntryItem.css'

const DECREMENT = 0, INCREMENT = 1, TOGGLE = 2;

export default class DataEntryItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {itemValue: props.item.dataValue};
        
    }

    changeState(type) {
        switch (type) {
            case DECREMENT:
                if (this.state.itemValue > 0) {
                    this.setState((prevState)=>{return {itemValue: prevState.itemValue - 1}}, () => {this.props.update(this.state.itemValue)});
                }
                break;
            case INCREMENT:
                if (this.state.itemValue < 100) {
                    this.setState((prevState)=>{return {itemValue: prevState.itemValue + 1}}, () => {this.props.update(this.state.itemValue)});
                }
                break;
            default:
                break;
        }
    }

    giveComponent = () => {
        let { item } = this.props;
        let { itemValue } = this.state;
        switch (item.chartType) {
            case "L":
            return (<Container className="dataEntryItem">
                <Row><Col xs="12" style={{textAlign: "center"}}><h3> {item.name} </h3></Col></Row>
                <Row><Col xs="1" md="2"/> 
                    <Col xs="3" md="2" className="colCentered"><Button className="dataEntryButton" onClick={this.changeState.bind(this, DECREMENT)}>-</Button> </Col>
                    <Col xs="4" md="4" className="colCentered"><span className="dataEntryNumInput">{itemValue}</span></Col>
                    <Col xs="3" md="2" className="colCentered"><Button className="dataEntryButton" onClick={this.changeState.bind(this, INCREMENT)}>+</Button> </Col>
                    <Col xs="1" md="2"/> 
                </Row>
                
                
                </Container>);
                break;
            default:
                return "";
        }
    }

    render() {
        return (
            this.giveComponent()
        );
    }
}

DataEntryItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    update: PropTypes.func.isRequired
}