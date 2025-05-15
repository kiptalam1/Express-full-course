import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv'
dotenv.config()
import usersRoutes from './routes/users.js'
import productsRoutes from './routes/products.js'
import './strategies/local-strategy.js'
const app = express()

// connect to mongo db;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('connected to mongo'))
    .catch((err) => {
        console.log(`Error: ${err}`)
    })

app.use(express.json())
app.use(cookieParser())
app.use(
    session({
        secret: 'adams',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 600000 * 60,
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
    })
)
app.use(passport.initialize())
app.use(passport.session())

const PORT = process.env.PORT || 3000

// home route;
app.get('/', (req, res) => {
    res.status(201).json({
        msg: 'Hello world',
    })
})

// users routes;
app.use(usersRoutes)

// products routes;
app.use(productsRoutes)

app.post('/api/auth', passport.authenticate('local'), (req, res) => {
    res.sendStatus(200)
})

app.get('/api/auth/status', passport.authenticate('local'), (req, res) => {
    console.log(`inside /auth/status endpoint`)
    console.log(req.user)
    console.log(req.session)

    if (!req.user) return res.sendStatus(401)
    return res.send(req.user)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
