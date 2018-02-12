import React from 'react';
import PropTypes from 'prop-types';

const Icon = (props) => (
    <svg className={props.className}>
        <use xlinkHref={`/assets/svg/sprite.svg#icon-${props.name}`} />
    </svg>
);

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string
};

Icon.defaultProps = {
    className: 'icon'
};

export default Icon;
