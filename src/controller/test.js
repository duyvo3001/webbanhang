import sqlConfig from '../configs/connectDBmssql';
const sql = require('mssql');

let testrq = async(req, res) => {
  console.log("okela")
  console.log(req.body)
}
export default {testrq};