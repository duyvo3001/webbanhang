import pool from 'C:/duy/nodejs/node_server/nodeserver/src/configs/connectDB';
let getHomePage = async (req ,res) =>{
  let [rows , fields] = await pool.execute('SELECT * FROM `users` ');
  // console.log("check rows" , rows);
return res.render('index.ejs',{DataUser :rows});
} 

// let getDetailsPage = async(req,res) =>{
//   let userID = req.params.id;
//   let [rows , fields] = await pool.execute(`SELECT * FROM users where ID =?`,[userID]);
//   return res.render('details.ejs',{DataUser :rows});
// }
// let updatePage = async (req,res) =>{

// }
let createUser = async (req,res) =>{
  let {firstName , LastName , Email , Address} = req.body ; 
   await pool.execute(`INSERT INTO users ( firstName, lastName,email,address) VALUES (?,?,?,?);`,[ firstName , LastName , Email , Address ]
  );
  return res.redirect('/');
};

let getAboutPage = (req,res) =>{
    return res.render('about.ejs')
}

let deleteUserSQL = async (req,res) =>{  
  await pool.execute('DELETE FROM users WHERE ID = ?' ,[req.body.ID] );
  return res.redirect('/');
}

let GetupdateUserSQL = async (req,res) =>{ 
  let _id = req.params.id;
  let [user] = await pool.execute(`SELECT * FROM users WHERE ID = ?` ,[_id] );
  // console.log("check" , user);
  return res.render('update.ejs',{DataUser : user[0]});
}

let PostupdateUserSQL = async (req,res) =>{ 
  await pool.execute(`UPDATE users
    SET firstName = ?, lastName = ?, email = ?  , address = ? 
    WHERE ID = ?` , [ req.body.firstName , req.body.LastName , req.body.Email , req.body.Address , req.params.id])
  return res.redirect('/');
}

module.exports={
    getAboutPage,
    // getDetailsPage,
    createUser,
    deleteUserSQL,
    GetupdateUserSQL,
    PostupdateUserSQL,
    getHomePage
}
