import React, {Component} from 'react'

class Search extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        console.log('search component did mount')
    }

    render() {
        return (
            <div id="search-bar">
                <div>
                    <input type="text" name="search" placeholder="Search..." />
                </div>
            </div>
        )
    }
}

export default Search;
