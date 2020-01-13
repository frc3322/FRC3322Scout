import React from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import SearchRoot from './Components/User-Components/SearchRoot';
import TeamStatistics from './Components/User-Components/Statistics/TeamStatistics';
import { Container, Row, Col } from 'react-bootstrap';
import SelectMatch from './Components/Scouter-Components/SelectMatch';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Container fluid="true">
          <Row>
              <Container fluid="true" className="navbar navbar-expand-lg">
                <Row style={{width: "100%"}}>
                  <Col className="navbarItem">
                    <Link to="/search">
                    <h1>Search</h1>
                    </Link>
                  </Col>
                  <Col className="navbarItem">
                    <Link to="/data-entry">
                    <h1>Enter Data</h1>
                    </Link>
                  </Col>
                </Row>
              </Container>
          </Row>


          <Row style={{marginTop: '1em'}}>
              <Switch>
              <Route exact path="/">
                  <div>
                  <Link to="/search">Go To Search!</Link>
                  </div>
                </Route>
                <Route path="/search">
                  <SearchRoot />
                </Route>
                <Route path="/teams/:teamNumber" component={TeamStatistics}>
                </Route>



              <Route path="/data-entry" component={SelectMatch}></Route>
                
              </Switch>
          </Row>

          </Container>
        </Router>
    )
  }
}

export default App;
