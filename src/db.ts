import Datastore from 'nedb'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const db = new Datastore({
  filename: path.join(__dirname, '/data/iptables.db'),
  autoload: true,
})

interface DBEntry {
  ip: string | undefined
  domain: string | undefined
}

const insert = (entry: DBEntry) => {
  return new Promise((resolve, reject) => {
    db.insert(entry, (err, newDoc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(newDoc)
      }
    })
  })
}

const saveIPAddress = async (ip: string) => {
  return await insert({ ip, domain: undefined })
}

const saveDomain = async (domain: string) => {
  return await insert({ ip: undefined, domain })
}

const loadDomainsAndIPs = () => {
  return new Promise<{ domains: string[], ips: string[] }>((resolve, reject) => {
    db.find({}, (err, docs: DBEntry[]) => {
      if (err) {
        reject(err)
      }
      else {
        // Separate entries into domains and ips lists
        const domains: string[] = []
        const ips: string[] = []

        docs.forEach((doc) => {
          if (doc.domain) {
            domains.push(doc.domain)
          }
          if (doc.ip) {
            ips.push(doc.ip)
          }
        })

        resolve({ domains, ips })
      }
    })
  })
}

export { saveIPAddress, saveDomain, loadDomainsAndIPs }
