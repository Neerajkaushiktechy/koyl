import jwt from "jsonwebtoken";

const linkToken = (email,id) => {
    return jwt.sign({email:email,id:id}, process.env.JWT_SECRET_KEY, { expiresIn: '30m' });
}

const createToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
}

export {
    createToken,
    linkToken
}

