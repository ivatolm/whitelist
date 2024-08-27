import config from './config/config'

import express, { json } from 'express'
const app = express()
app.use(json())

import api_allow_domain from './src/api/allow_domain'
app.use('/allow_domain', api_allow_domain)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
