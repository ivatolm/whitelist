import config from './config/config'

import { setupChain, resetChain } from './src/configure'
setupChain()
resetChain()
import { loadDomainsAndIPs } from './src/db'
const { domains, ips } = await loadDomainsAndIPs()
import { whitelistIP, whitelistIPs } from './src/whitelist'
try {
  ips.forEach(ip => whitelistIP(ip))
  domains.forEach(async (domain) => {
    const ranges = await domainToRanges(domain)
    whitelistIPs(ranges)
  })
}
catch (error) {
  console.error(`Cannot load entries from database: ${error}`)
}

import express, { json } from 'express'
const app = express()
app.use(json())

import api_allow_domain from './src/api/allow_domain'
app.use('/allow_domain', api_allow_domain)

import api_allow_ip from './src/api/allow_ip'
app.use('/allow_ip', api_allow_ip)

import api_get_list from './src/api/get_list'
import { domainToRanges } from './src/resolve'
app.use('/get_list', api_get_list)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
