import React from 'react';
import { Link } from 'react-router';

const NotFound = () => (
    <div className="nav-offset">
        <div className="container-sm text-center">
            <h1 className="h1">Where did that go?</h1>
            <p>We're having trouble finding the page you're after.</p>
            <Link to="/" className="btn m-t-2">Return home</Link>
        </div>
    </div>
);

export default NotFound;
