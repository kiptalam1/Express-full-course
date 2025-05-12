import express from 'express'

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

const mockUsers = [
    { id: 1, name: 'adams', username: 'adama' },
    { id: 2, name: 'evans', username: 'snave' },
    { id: 3, name: 'jela', username: 'chel' },
]

app.get('/', (req, res) => {
    res.status(201).json({
        msg: 'Hello world',
    })
})

// get all users;
app.get('/api/users', (req, res) => {
    // console.log(req.query)
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

// post requests (requires json parser i.e. express.json);
app.post('/api/users', (req, res) => {
    const { body } = req
    const newUser = { id: mockUsers.length + 1, ...body }
    mockUsers.push(newUser)
    return res.status(201).json({
        msg: 'User added successfully',
    })
})

// put requests (all user fields must be included to avoid null values);
app.put('/api/users/:id', (req, res) => {
    const {
        params: { id },
        body,
    } = req
    const parsedId = parseInt(id)

    if (isNaN(parsedId)) return res.sendStatus(400)
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
    if (findUserIndex === -1) return res.sendStatus(404)
    mockUsers[findUserIndex] = { id: parsedId, ...body }
    res.sendStatus(200)
})

// patch requests (updates only the changed fields);
app.patch('/api/users/:id', (req, res) => {
    const {
        body,
        params: { id },
    } = req
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) return res.sendStatus(400)
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
    if (findUserIndex === -1) res.sendStatus(404)
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }
    return res.sendStatus(200)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
