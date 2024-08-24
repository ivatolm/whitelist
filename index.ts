import config from './config/config'

import express, { json } from 'express'
const app = express()
app.use(json())

import api_allow_ip from './src/api/allow_ip'
app.use('/allow_ip', api_allow_ip)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
