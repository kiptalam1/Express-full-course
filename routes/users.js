import express from 'express'
import { validationResult, matchedData, checkSchema } from 'express-validator'
import { userValidator } from '../utils/validationSchema.js'
import { resolveIndexByUserId } from '../middleware/index-middleware.js'
import { mockUsers } from '../utils/constants.js'

const router = express.Router()

// get all users;
router.get('/api/users', (req, res) => {
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
router.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req
    const findUser = mockUsers[findUserIndex]
    if (!findUser) return res.sendStatus(404)
    res.status(200).send(findUser)
})

// post requests (requires json parser i.e. express.json);
router.post('/api/users', checkSchema(userValidator), (req, res) => {
    const results = validationResult(req)
    console.log(results)

    // if there are errors;
    if (!results.isEmpty())
        return res.status(400).send({ errors: results.array() })
    const data = matchedData(req)
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data }
    mockUsers.push(newUser)
    return res.status(201).json({
        msg: 'User added successfully',
    })
})

// put requests (all user fields must be included to avoid null values);
router.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex, body } = req
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body }
    res.sendStatus(200)
})

// patch requests (updates only the changed fields);
router.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex, body } = req
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }
    return res.sendStatus(200)
})

// delete requests;
router.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req
    mockUsers.splice(findUserIndex, 1)
    return res.sendStatus(200)
})

export default router
