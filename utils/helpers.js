import bcrypt from 'bcrypt'

const saltRounds = 10

export const hashPassword = (password) => {
    console.log('Password received:', password)
    const salt = bcrypt.genSaltSync(saltRounds)
    console.log('salt' + salt)
    return bcrypt.hashSync(password, salt)
}

export const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed)
}
