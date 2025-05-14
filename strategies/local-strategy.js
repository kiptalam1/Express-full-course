import passport from 'passport'
import { Strategy } from 'passport-local'
import { mockUsers } from '../utils/constants.js'

passport.serializeUser((user, done) => {
    console.log(`inside serialize user`)
    console.log(user)

    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    console.log(`inside deserialize user`)
    console.log(`deserializing user`)

    try {
        const findUser = mockUsers.find((user) => (user.id = id))
        if (!findUser) throw new Error('User not found')
        done(null, findUser)
    } catch (error) {
        done(error, null)
    }
})

export default passport.use(
    new Strategy((username, password, done) => {
        try {
            const findUser = mockUsers.find(
                (user) => user.username === username
            )
            if (!findUser) throw new Error('User not found')
            if (findUser.password !== password)
                throw new Error('Invalid credentials.')
            done(null, findUser)
        } catch (err) {
            done(err, null)
        }
    })
)
