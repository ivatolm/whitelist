import ChainController from './controllers/chain_controller'
import IptablesController from './controllers/iptables_controller'
import ApiController from './controllers/api_controller'

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
  readonly apiController: ApiController

  constructor() {
    this.chainController = new ChainController()
    this.iptablesController = new IptablesController()
    this.apiController = new ApiController()
  }

  async startServices() {
    await this.iptablesController.start(this)
    await this.chainController.start(this)
    await this.apiController.start(this)
  }

  async stopServices() {
    await this.chainController.stop()
  }

  getChainController() {
    return this.chainController
  }

  getIptablesController() {
    return this.iptablesController
  }
}

export default Controller
