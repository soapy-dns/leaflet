import React from 'react';
import PropTypes from 'prop-types';

const Main = props => (
    <div>
        {props.children}
    </div>
);

Main.propTypes = {
    children: PropTypes.object.isRequired
};

export default Main;
