import Controller from './src/controller'
import { closeDatabase } from './src/db'
const controller = new Controller()
controller.startServices()

const signals = ['SIGTERM', 'SIGINT']
signals.forEach(function (sig) {
  process.on(sig, async () => {
    await controller.stopServices()
    await closeDatabase()
    process.exit()
  })
})
