import React, {Component} from 'react'

class Toolbar extends Component {
    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
        this.state = {
            open: true
        }
    }

    componentDidMount() {
        console.log('search component did mount')
    }

    onClick(event) {
        console.log('clicked')
        this.setState({open: !this.state.open})
        console.log('this.state.open', this.state.open)
    }

    render() {
        return (
            <div id="toolbar" className={this.state.open ? "open" : null}>
                <button className="hamburger" onClick={this.onClick}>
                    <span>Menu</span>
                </button>
                <div id="menu">
                    <h2>Controls</h2>
                    <ul>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Toolbar;
