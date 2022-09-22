import sqlConfig from '../configs/connectDBmssql';
const sql = require('mssql')

let DetailsPage = async (req, res) => {
    await  sql.connect(sqlConfig);
    let malk =  req.param('malk');
    
    const result =  await sql.query(`SELECT  [MaLK] ,[TenLK],[Gia] ,[Hinh1],[MoTa] FROM LinhKien
    where [MaLK] = '${malk}' `);
    return res.render('detailsPage.ejs',{
        layout : false , 
        dataResult : result
    });
}
let updateItem = (req , res) =>{
    
}
let deleteItem = (req , res) =>{

}
export default {
    DetailsPage ,updateItem ,deleteItem
}