import React, { Component } from 'react';
import ItemsList from './components/ItemsList';

class App extends Component {
  state = {
    items: [
      {
        id: 1,
        name: "Hab Level",
        value: 0
      },
      {
        id: 2,
        name: "Level 1 Cargo",
        value: 0
      },
      {
        id: 3,
        name: "Level 2 Cargo",
        value: 0
      }
    ]
  };

  dec = (id) => {
    this.setState({
      items: this.state.items.map((item) => {
        if (item.id === id) {
          item.value -= 1;
        }
        return item;
      })
    });
    console.log(this.state.items)
  }
  
  inc = (id) => {
    console.log(id)
    this.setState({
      items: this.state.items.map((item) => {
        if (item.id === id) {
          item.value += 1
        }
        console.log(item)
        return item;
      })
    });
    console.log(this.state.items)
  }

  render() {
    return (
      <div className="App">
        <h1>App</h1>
        <hr />
        <ItemsList items={this.state.items} dec={this.dec} inc={this.inc} />
      </div>
    );
  }
}

export default App;
