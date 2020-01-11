import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Searches.css';
import { Col } from 'react-bootstrap';


class TeamInMatch extends Component {
    url = "http://localhost:8080";

    constructor(props) {
        super(props)
    
        this.state = {
            teamNumber: 0,
            matchNumber: 0
        }
    }

    onSubmit = (e)=>{
        e.preventDefault();
        this.getMatch(this.state.teamNumber, this.state.matchNumber);
    };

    onChange = (e)=>{
        this.setState({[e.target.name]: e.target.value});
        console.log(this.state);
    }

    getMatch = (teamNumber, matchNumber) => {
        fetch(this.url + '/getteaminmatch/' + teamNumber +'/' + matchNumber, {
        }).then(doc=>doc.json()).then(doc => this.props.sendMatches(doc));
    }
    render() {
        return (
            <React.Fragment>
                <form onSubmit={this.onSubmit} autoComplete="off" className="row">
                    <Col lg="3">
                    <input style={{'marginRight': '1em'}} placeholder="Team Number" name="teamNumber" className="Entryfield searchFormElement" onChange={this.onChange}/>
                    </Col>
                    <Col lg="3">
                    <input style={{'marginRight': '1em'}}placeholder="Match Number" className="Entryfield searchFormElement" name="matchNumber" onChange={this.onChange}/>
                    </Col>
                    <Col lg="2">
                    <button type="submit" className="searchButton searchFormElement">Search!</button>
                    </Col>
                </form>
            </React.Fragment>
        )
    }
}


TeamInMatch.propTypes = {
    sendMatches: PropTypes.func.isRequired
};

export default TeamInMatch;