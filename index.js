import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

const mockUsers = [
    { id: 1, name: 'adams' },
    { id: 2, name: 'evans' },
    { id: 3, name: 'jela' },
]

app.get('/', (req, res) => {
    res.status(201).json({
        msg: 'Hello world',
    })
})

// get all users;
app.get('/api/users', (req, res) => {
    console.log(req.query)
    const {
        query: { filter, value },
    } = req

    if (filter && value)
        return res.send(
            mockUsers.filter((user) => user[filter].includes(value))
        )

    // when filter and value are undefined
    return res.send(mockUsers)
})

// find single user;
app.get('/api/users/:id', (req, res) => {
    // console.log(req.params)
    const parsedId = parseInt(req.params.id)
    if (isNaN(parsedId))
        return res.status(400).json({ msg: 'Bad request. Invalid ID' })

    const findUser = mockUsers.find((user) => user.id === parsedId)
    if (!findUser) return res.sendStatus(404)
    res.status(200).send(findUser)
})

// get all products;
app.get('/api/products', (req, res) => {
    res.send([{ id: 123, name: 'chicken breast', price: 4.99 }])
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
