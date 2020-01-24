import React from 'react'

const AUTO = 0, TELEOP = 1, ENDGAME = 2;

export default class DataEntry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {teamNumber: 0, matchNumber: 0, stats: [[], [], []]};
    }

    teamNumber = 0;
    componentDidMount() {
        let url = window.location.host + "/:8080/getteaminmatch/"+parseInt(this.props.match.params.teamNumber)+"/"+parseInt(this.props.matchNumber);
    }
    

    render() {
        return (
            <div><h1>Hello {this.state.teamNumber}</h1></div>
        )
    }
}
