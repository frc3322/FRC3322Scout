import React from 'react'
import { Container, Row, Col, Button, FormCheck } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core';
import './DataEntryItem.css'

export default class CommentItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {itemValue: props.item.dataValue};
        
    }

    changeState = (e) => this.setState({itemValue: e.target.value}, () => {this.props.update(this.state.itemValue)});

    giveComponent = () => {
        let { item } = this.props;
        let { itemValue } = this.state;
        console.log(itemValue);
        
        switch (item.chartType) {
            case "C":
            return (<Container className="dataEntryItem">
                <TextField
                style={{width:"100%"}}
                id="outlined-multiline-static"
                label="Comment"
                multiline
                rows="4"
                defaultValue={item.dataValue}
                variant="outlined"
                onChange={this.changeState}
                />
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

CommentItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    update: PropTypes.func.isRequired
}