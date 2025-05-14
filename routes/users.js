import express from 'express'
import { validationResult, matchedData, checkSchema } from 'express-validator'
import { userValidator } from '../utils/validationSchema.js'
import { resolveIndexByUserId } from '../middleware/index-middleware.js'
import { mockUsers } from '../utils/constants.js'
import { User } from '../mongoose/schemas/user.js'
import { hashPassword } from '../utils/helpers.js'

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
router.post('/api/users', checkSchema(userValidator), async (req, res) => {
    const results = validationResult(req)
    console.log(results.array())

    // if there are errors;
    if (!results.isEmpty())
        return res.status(400).send({ errors: results.array() })
    const data = matchedData(req)
    data.password = hashPassword(data.password)
    console.log('Validated data:', data)
    const newUser = new User(data)
    try {
        const savedUser = await newUser.save()
        return res.status(201).json({
            msg: 'User added successfully',
            data: savedUser,
        })
    } catch (error) {
        return res
            .status(400)
            .json({ error: 'Failed to save user', details: error.message })
    }
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
