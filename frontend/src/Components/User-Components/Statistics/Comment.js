import React from 'react';
import PropTypes from 'prop-types';
import "./TeamStatistics.css";

export default class Comment extends React.Component {

    constructor(props) {
        super(props);
    }

    generate = () => {
        let { comments, matchNum } = this.props;
        let output = []
        console.log(matchNum)

        for (let i = 0; i < comments.length; i++) {
            output.push(<p>Match {matchNum[i]}: {comments[i]}</p>)
        }
        
        return output;
        
    }

    render() {
        return (this.generate())
    }
}