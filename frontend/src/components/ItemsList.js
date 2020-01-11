import React, { Component } from 'react'
import FormItem from './FormItem';
import PropTypes from 'prop-types';

export class ItemsList extends Component {
    render() {
        return this.props.items.map((item) => (
            <FormItem key={item.id} item={item} dec={this.props.dec} inc={this.props.inc}/>
        ));
    }
}

ItemsList.propTypes = {
    items: PropTypes.array.isRequired
}
export default ItemsList
