import React from 'react'
import { Container, Row, Col, Button, FormCheck } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Switch } from '@material-ui/core';
import './DataEntryItem.css'

export default class ToggleItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {itemValue: props.item.dataValue};
        
    }

    changeState = () => this.setState((prevState)=>{return {itemValue: !prevState.itemValue}}, () => {this.props.update(this.state.itemValue)});

    giveComponent = () => {
        let { item } = this.props;
        let { itemValue } = this.state;
        console.log(itemValue);
        
        switch (item.chartType) {
            case "O":
            return (<Container className="dataEntryItem">
                <Row>
                    <Col xs="1" md="2"/> 
                    <Col xs="3" md="2" className="colCentered"><h3> {item.name}  </h3></Col>
                    <Col xs="4" md="4" />
                    <Col xs="3" md="2" className="colCentered"><Switch checked={itemValue} onClick={this.changeState} color="primary" /></Col>
                    <Col xs="1" md="2"/> 
                    </Row>
                
                
                </Container>);
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

ToggleItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    update: PropTypes.func.isRequired
}