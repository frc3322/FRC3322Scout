import React from 'react'
import './Testing.css'

export default class TestComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {test: false}
    }
    render() {
        return (
            <div className={this.state.test ? "test-off" : "test-on"} style={{backgroundColor: "red"}}>
                Hello world!
                <button onClick={() => this.setState(prevState => {return{test: !prevState.test}})}></button>
            </div>
        )
    }
}
