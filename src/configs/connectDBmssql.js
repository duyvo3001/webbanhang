import 'dotenv/config' 
const sqlConfig = {
  user: process.env.USERNAMESQL,
  password:process.env.PASSWORDS,
  database: process.env.DATABASE,
  server: process.env.SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    // encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}
export default sqlConfig ;
