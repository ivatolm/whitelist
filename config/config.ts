import yargs from 'yargs/yargs'

const parseCLIArgs = () => {
  return yargs(process.argv).options({
    port: {
      alias: 'p',
      type: 'number',
      demandOption: true,
      description: 'Port to host server on',
      default: 3000,
    },
  }).help().parseSync()
}

type Config = {
  port: number
}
const config: Config = parseCLIArgs()

export default config
