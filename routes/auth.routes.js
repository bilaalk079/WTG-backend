import express from 'express'
import { Login, logOut, refreshToken, SignUp } from '../controllers/auth.controller.js'


const router = express.Router()

router.post('/signup', SignUp)
router.post('/login', Login)
router.post('/logout', logOut)
router.get('/refresh', refreshToken)

export default router