// import pool from '../configs/connectDB'
import sqlConfig from '../configs/connectDBmssql'
const sql = require('mssql')
let getallUsers =async ( req,res) => {
    let [rows , fields] = await pool.execute(`select * from users`);
    console.log(typeof rows );
    return res.status(200).json({
        message : 'oke',
        data : rows
    })
}
let testUser = async (req, res) => {
        try {
         // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig);
        const result = await sql.query(`select * from CommentKH where Name ='hungkim'`);
        console.log('test result:', typeof result, 'test result:', result.recordset[0]);
        sql.close();
        return res.status(200).json({
            message : 'oke', 
            data : result
        })
        } catch (err) {
         console.log('loi ==',err);
        }
}
let createUser = async (req, res) => {
    let { firstName , LastName , Email , Address } = req.body ; 
    console.log("check",firstName,"check",LastName,"check",Email,"check",Address);

    await pool.execute(`INSERT INTO users ( firstName, lastName, email, address) VALUES (?,?,?,?);`,[ firstName , LastName , Email , Address ]);
    return res.status(200).json({
        message : 'oke' , 
        data :  firstName
    })
}
module.exports ={
    getallUsers ,createUser ,testUser
}