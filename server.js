
const express = require("express")
const path = require("path")

const environment = process.env.NODE_ENV || "development"
const port = process.env.PORT || 9000
const app = express()

function ensureSecure(req, res, next) {
    if (req.headers["x-forwarded-proto"] === "https") {
        // OK, continue
        res.header("Access-Control-Allow-Origin", "*")
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        )
        return next()
    }
    if (environment === "production") {
        return res.redirect(301, "https://" + req.headers.host + req.url) // eslint-disable-line
    }
    return next()
}

// force https for production
app.use(ensureSecure)
app.get('/*', (req, res, next) => {
    console.log('here')
    next()
})

app.get('/api', (req, res) => {
    console.log('api call made')
    res.status(200).send('api call made')
})

// serve static assets normally - I guess static assets are files
// app.use(express.static(path.join(__dirname, "/dist/")))  // if trying to run the 'dist' version of the app from the non 'dist' server.js
app.use(express.static(path.join(__dirname, "/")))
// console.log("__dirname", __dirname)
// app.use('/bundle.js', express.static(path.join(__dirname, '/dist/bundle.js')))


// Handles all NON API routes so you do not get a not found error.
app.get("*", (request, response) => {
    console.log("__dirname", __dirname)
    // response.sendFile(path.join(__dirname, "/dist/index.html")) // if trying to run the 'dist' version of the app from the non 'dist' server.js
    response.sendFile(path.join(__dirname, "/index.html"))

    // response.sendFile(path.join(__dirname, 'app/index.html'))
})

app.listen(port)
console.log(`server started on port ${port}`)
