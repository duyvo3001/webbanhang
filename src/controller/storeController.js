import sqlConfig from '../configs/connectDBmssql';
const sql = require('mssql')
  
// import store item
let getStoreItem = async (req , res) =>{
    if(req.cookies.user_id != null){
    await sql.connect(sqlConfig)
    let item = req.params.IdItem;

    let countCardID = await sql.query(`select Max(CONVERT(int, CardID)) as tinh from GioHang`);

    let count =  +countCardID.recordsets[0][0].tinh +1;

    const result = await sql.query(`
        insert into GioHang
        values(${count},1,${req.cookies.user_id},'${item}',0,0) 
    `);  
    return res.redirect('/');
    }
    else return res.send('tao tai khoản');
}
//get store Page
let StorePage = async (req, res) => {

    let dataNameLK =[]; 
    let tongCardID  = [];
    let userId = req.cookies.user_id ; 

    if(userId != undefined){
        // get check store item
        let checkItem = await sql.query(` select count (checkStore) AS countItem
        from GioHang
        where MaKH =${userId} and checkStore = 1
        `)
        let countItem =  checkItem.recordset[0].countItem ; 
        // get all item store records
        await sql.connect(sqlConfig)
        let arrayData =[]; 
        let monney = 0;
        let dataStore = await  sql.query(`select * from GioHang where MaKH=${userId}`);
        let dataTong = await sql.query(`select  LinhKien.Gia   , GioHang.soluong 
            from LinhKien  
            INNER JOIN GioHang 
            on LinhKien.MaLK = GioHang.MaLK 
            where GioHang.checkStore=1 and GioHang.MaKH =${userId}
        `);
        for(let i = 0 ; i <dataTong.rowsAffected; i++) {
            monney += dataTong.recordset[i].Gia * dataTong.recordset[i].soluong
        }
        for(let i = 0 ; i < dataStore.rowsAffected ; i ++) {
            arrayData.push(dataStore.recordset[i].CardID.trim()); //get data and push body

            dataNameLK[i] = await  sql.query(`select Linhkien.malk , LinhKien.tenlk , LinhKien.Gia , LinhKien.Hinh1  , GioHang.soluong ,GioHang.checkStore
            from LinhKien  
            INNER JOIN GioHang 
            on LinhKien.MaLK = GioHang.MaLK 
            where GioHang.CardID='${arrayData[i]}' and GioHang.MaKH =${userId} `);
        }
        return res.render('StorePage.ejs',{
            layout:false,
            dataNameLK :(await dataNameLK), 
            countItem1 : countItem , 
            checked : 'checked' , 
            monney : monney
        });
    }
    else{
        let countItem = 0 ; 
        return res.render('StorePage.ejs',
        {
            countItem1 : countItem,
            layout :false ,
            dataNameLK : dataNameLK,
            checked : '' , 
            monney :''
        });  
    }  
}

let getPayItem = async (req, res) => {
    await sql.query(`UPDATE GioHang
    
    WHERE MaKH = '${req.cookies.user_id}'  and MaLK= '${req.params.malk}'`)
    let dataNameLK = await  sql.query(`select  LinhKien.Gia , GioHang.soluong
    from LinhKien  
    INNER JOIN GioHang 
    on LinhKien.MaLK = GioHang.MaLK 
    where LinhKien.MaLK='${req.params.malk}'`);
}

let getPutItem = async (req, res) => {
    console.log('test')
    console.log('check', req.body) 
    // return res.redirect('/');
}
let getDeleteItem = async (req, res) => {

}   
export default {getStoreItem,StorePage,getPayItem,getPutItem,getDeleteItem} ; 