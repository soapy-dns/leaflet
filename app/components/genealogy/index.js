
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Api from '../../utils/api'
import { Grid, Container, Button, Input } from 'semantic-ui-react'
import '../../styles/genealogy.css'


class Genealogy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        const constraints = {
            video: true,
        }

       
    }

    render() {
        return (
            <div class="container">
                <header>
                    <div>Home</div>
                    <div>Search</div>
                    <div>Logout</div>
                </header>
                <aside>MENU</aside>
                <main>CONTENT</main>
                <footer>FOOTER</footer>
            </div>
        )
    }
}

Genealogy.propTypes = {
    map: PropTypes.object.isRequired,
}

export default Genealogy
