import React from 'react';
import ChildMatchComponent from "./ChildMatchComponent";
import {Col, Container, Row, DropdownButton, Dropdown} from "react-bootstrap";
import TeamInMatch from './Searches/TeamInMatch';
import DropdownItem from 'react-bootstrap/DropdownItem';
import AllTeamsInMatch from './Searches/AllTeamsInMatch';
import './SearchComponent.css';

const selectionNames = ["Search For Team In Match", "Search For All Teams In A Match"]

class SearchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {matches: [],
        searchType: 0,
        selected: ""
    };
    }

    setMatches = (matches) => {
        this.setState({matches: matches})
    };

    newItemSelected = (type) => {
        this.setState({searchType: type, selected: selectionNames[type]});
    };


    assignSearchElement = () => {
        switch (this.state.searchType) {
            case 0:
                return <TeamInMatch sendMatches={this.setMatches}/>;
            case 1:
                return <AllTeamsInMatch sendMatches={this.setMatches}/>;
            default:
                return <p>Error.</p>
    };
}

    render() {
        let matchComponents = [];
        this.state.matches.forEach((element)=>{
            matchComponents.push(<ChildMatchComponent key={element.matchNumber + "m_" + element.robot.allianceColor + element.robot.allianceNumber} match={element}> </ChildMatchComponent>);
        });
        
        return (
            <Container>
                <Row>
                    <Col xs="12" sm="6" md="6" lg="5">
                    <Dropdown>
                        <DropdownButton title={(this.state.selected !== "") ? this.state.selected : "Select Search"}>
                            <DropdownItem onClick={this.newItemSelected.bind(this, 0)}>{selectionNames[0]}</DropdownItem>
                            <DropdownItem onClick={this.newItemSelected.bind(this, 1)}>{selectionNames[1]}</DropdownItem>
                        </DropdownButton>
                    </Dropdown> 
                    </Col>
                    <Col></Col>
                </Row>
                        {this.assignSearchElement()}
                <Row>
                    <Col>
                        {matchComponents}
                    </Col>
                </Row>
            </Container>
        )

    }

}

export default SearchComponent;