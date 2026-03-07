import express from 'express'
import morgan from 'morgan'
import {connectDB} from './db.js'
import authRouter from "./routes/auth.routes.js"

const backend = express()

backend.use(morgan('dev'))

backend.use(express.json())

connectDB()

backend.use("/api", authRouter)

backend.listen(4000)
console.log('Servidor corriendo', 4000)