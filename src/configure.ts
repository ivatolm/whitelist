import { exec } from 'child_process'

function addReturnRule(ipRange) {
  const command = `iptables -I WHITELIST -d ${ipRange} -j RETURN`

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error adding RETURN rule: ${error.message}`)
      return
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    console.log(`Successfully added RETURN rule for IP range: ${ipRange}`)
  })
}

export { addReturnRule }
