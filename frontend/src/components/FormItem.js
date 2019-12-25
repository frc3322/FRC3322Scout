import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormItem extends Component {
    render() {
        return (
            <div>
                <h3>{ this.props.item.name }</h3>
                <button onClick={this.props.dec.bind(this.props.item.id)}>-</button> { this.props.item.value } <button onClick={this.props.inc.bind(this.props.item.id)}>+</button>
                <hr />
            </div>
        )
    }
}

FormItem.propTypes = {
    item: PropTypes.object.isRequired
}

export default FormItem;
