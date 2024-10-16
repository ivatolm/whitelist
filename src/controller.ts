import express, { json } from 'express'
import api_allow_domain from './api/allow_domain'
import api_allow_ip from './api/allow_ip'
import api_get_list from './api/get_list'
import config from './../config/config'
import ChainController from './controllers/chain_controller'
import IptablesController from './controllers/iptables_controller'

/**
 * Role of the 'Controller' is to manage an application.
 * It has a few responsibilities:
 * 1. Start all services at startup
 * 2. Support service communication
 * 3. Stop services at shutdown
 */
class Controller {
  readonly chainController: ChainController
  readonly iptablesController: IptablesController

  constructor() {
    this.chainController = new ChainController()
    this.iptablesController = new IptablesController()
  }

  async startServices() {
    // Iptables controller
    await this.iptablesController.start(this)
    // Chain controller
    await this.chainController.start(this)
    // Api controller
    const app = express()
    app.use(json())
    app.use('/allow_domain', api_allow_domain)
    app.use('/allow_ip', api_allow_ip)
    app.use('/get_list', api_get_list)
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' })
    })
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`)
    })
  }

  async stopServices() {
    await this.chainController.stop()
  }

  getIptablesController() {
    return this.iptablesController
  }
}

export default Controller
