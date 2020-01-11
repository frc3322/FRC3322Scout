import React from 'react';
import './Search.css';
import SearchComponent from "./SearchComponent";
import { Container, Row, Col } from 'react-bootstrap';

class SearchRoot extends React.Component {
  render() {
    return (
        <Container>
          <Row>
            <Col style={{'paddingBottom': '2em'}}>
              <h2 style={{fontSize: '4em'}}>Search</h2>
            </Col>
          </Row>
          <Row>
            <Col style={{'paddingLeft': 0}}>
              <SearchComponent/>
            </Col>
          </Row>
        </Container>
    )
  }
}

export default SearchRoot;
