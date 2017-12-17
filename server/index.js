const express = require('express');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 9000;
const app = express();

function ensureSecure(req, res, next) {
    if (req.headers['x-forwarded-proto'] === 'https') {
        // OK, continue
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        return next();
    }
    if (environment === 'production') {
        return res.redirect(301, 'https://' + req.headers.host + req.url); // eslint-disable-line
    }
    return next();
}

// force https for production
app.use(ensureSecure);

// serve static assets normally
app.use(express.static(path.join(__dirname, '/')));
app.all('/', (req, res, next) => {
    console.log('path-', req.path)
    next()
})

// Handles all routes so you do not get a not found error
app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port);
console.log(`server started on port ${port}`);