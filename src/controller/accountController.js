import sqlConfig from '../configs/connectDBmssql';
import {test_pass ,_pass} from '../services/hasspass';
const sql = require('mssql');

//get getAccountPagesignUP
let getAccountPageUp = async (req ,res) =>{
    return res.render('accountPageSignUp.ejs',{layout: false});
}
//get ggetAccountPagesignIN
let getAccountPageIn = async (req ,res) =>{
    return res.render('accountPageSignIn.ejs',{layout: false});
}
//create createUser
let createUser = async (req ,res) =>{ 

    let {Hoten,email,password,Repassword,phone,address} = req.body ; 
    let _Pass = _pass(password.trim(),Repassword.trim())

    await  sql.connect(sqlConfig)
    const result = await sql.query(`SELECT Email FROM KhachHang where Email='${email.trim()}'`) 

    if ((await result).rowsAffected == 1){
        console.log('registered');
        return res.redirect('/');
    }
    else{
        if( password === Repassword){
            let countUsers = await sql.query(`select Max(CONVERT(int, MaKH)) as tinh from KhachHang`);
            let count = +countUsers.recordsets[0][0].tinh +1;
            const CreateUser = sql.query(`
                insert into KhachHang (MaKH,HoTen,DiaChi,SDT,Email,Password)
                values('${count}','${Hoten.trim()}','${address.trim()}','${phone.trim()}','${email.trim()}','${_Pass.createpass.hash}')
            `) 
            res.cookie('user_id',count);
            return res.redirect('/');
        }
        else console.log('test failed ') ;
        return res.redirect('/');
    } 
}
let SignUser = async(req,res)=> {
    let {email,password1} = req.body ; 
    await  sql.connect(sqlConfig)
    let Repassword ='' , user_id = '';
    
    const result = await sql.query(`SELECT MaKH, Email, Password FROM KhachHang where Email='${email.trim()}'`) 
    for (let i = 0; i < result.rowsAffected; i++) {
         Repassword = result.recordset[i].Password
         user_id =result.recordset[i].MaKH
    }

    if ((await result).rowsAffected == 1){
        let _RePassTest = test_pass(password1.trim(),Repassword.trim())
 
        if(_RePassTest.test_Hash == true){ 
            // res.cookie('user_id',user_id);
            req.session.authenticated = true ; 
            req.session.user = {
                user_id , password1 
            } ; 
            res.cookie('user_id',user_id, { expires: new Date(Date.now() + 900000), httpOnly: true })
            return res.redirect('/');
        }
        else {
            console
            return res.send('sai mat khau');
        }
    }
}
export default {
    getAccountPageUp,
    getAccountPageIn,
    createUser,
    SignUser
}