import path from 'path'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

async function openDatabase() {
  const db = await open({
    filename: path.join(process.cwd(), './data/data.db'),
    driver: sqlite3.Database,
  })
  await db.exec(`
  CREATE TABLE IF NOT EXISTS ips (
    name TEXT PRIMARY KEY
  );
  CREATE TABLE IF NOT EXISTS domains (
    name TEXT PRIMARY KEY
  )`)
  console.log('Database connection opened.')
  return db
}

// async function closeDatabase(db: sqlite3.Database) {
//   await db.close((err) => {
//     if (err) {
//       console.error('Error closing the database:', err.message)
//     }
//     else {
//       console.log('Database connection closed.')
//     }
//   })
// }

async function saveIP(ip: string) {
  await db.run('INSERT INTO ips (name) VALUES (?) ON CONFLICT (name) DO NOTHING', [ip])
}

async function saveDomain(domain: string) {
  await db.run('INSERT INTO domains (name) VALUES (?) ON CONFLICT (name) DO NOTHING', [domain])
}

async function loadDomainsAndIPs() {
  const ips = await db.all('SELECT * FROM ips')
  const domains = await db.all('SELECT * FROM domains')
  const ipsFiltered = ips.map(x => x.name)
  const domainsFiltered = domains.map(x => x.name)
  return { ips: ipsFiltered, domains: domainsFiltered }
}

const db = await openDatabase()

export { saveIP, saveDomain, loadDomainsAndIPs }
