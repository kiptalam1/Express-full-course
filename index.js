import express from 'express'
import usersRoutes from './routes/users.js'
import productsRoutes from './routes/products.js'

const app = express()

app.use(express.json())

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




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
