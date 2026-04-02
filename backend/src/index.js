import express from 'express'
import morgan from 'morgan'
import {connectDB} from './db.js'

const backend = express()

backend.use(morgan('dev'))

backend.use(express.json())

connectDB();

backend.listen(4001)
console.log('Servidor corriendo', 4001);