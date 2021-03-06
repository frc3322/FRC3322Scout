import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Searches.css';
import { Col } from 'react-bootstrap';

class AllTeamsInMatch extends Component {
    url = "http://" + window.location.hostname + ":8080";
    

    constructor(props) {
        super(props)
        this.state = {
            matchNumber: 0
        }
    }

    onSubmit = (e)=>{
        e.preventDefault();
        this.getMatch(this.state.teamNumber);
    };

    onChange = (e)=>{
        this.setState({[e.target.name]: e.target.value});
    }

    getMatch = (teamNumber) => {
        fetch(this.url + '/getallscoutentries/0?teamNumber=' + teamNumber).then(doc=>doc.json()).then(doc => this.props.sendMatches(doc));
    }
    render() {
        return (
            <React.Fragment>
                <form onSubmit={this.onSubmit} autoComplete="off" className="row">
                        <Col lg="3">
                            <input className="searchFormElement Entryfield" style={{'marginRight': '1em'}} placeholder="Team Number" name="teamNumber" onChange={this.onChange}/>
                        </Col>
                        <Col lg="2">
                            <button className="searchFormElement searchButton" type="submit">Search!</button>
                        </Col>
                </form>
            </React.Fragment>
        )
    }
}


AllTeamsInMatch.propTypes = {
    sendMatches: PropTypes.func.isRequired
};

export default AllTeamsInMatch;