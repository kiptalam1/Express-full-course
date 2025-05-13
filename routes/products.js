import express from 'express'

const router = express.Router()

// get all products;
router.get('/api/products', (req, res) => {
    res.send([{ id: 123, name: 'chicken breast', price: 4.99 }])
})

export default router
