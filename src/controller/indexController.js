import sqlConfig from '../configs/connectDBmssql';
const sql = require('mssql')
let getHomePage = async (req ,res) =>    
{
    await sql.connect(sqlConfig)

    // du lieu data topsell muon lay
    let dataSP = [{ key : 'DataUser',  value : 'SP028'},{ key : 'DataUser1' , value : 'SP160'}, { key : 'DataUser2' , value : 'SP238'}]
    // du lieu data maloai muon lay
    let dataML =[{ key : 'DataLap' , value : 'LAP'},
    { key : 'resultLinhKien' ,value : 'VGA', value1 :'A04' ,value2 :'A06' ,value3 :'A07' ,value4 :'A08' ,value5 :'A10' ,value6 :'A11' ,},
        { key : 'resultManHinh' , value : 'A03'},
        { key : 'resultPhukien' , value : 'A02'},]
        
    for (let i = 0; i < dataSP.length; i++) {
        dataSP[i].value = await checkdataSP(dataSP[i])
    }
    for (let i = 0; i < dataML.length; i++) {
        dataML[i].value = await checkdataML(dataML[i])
    }
    //lay data san pham topsell
    async function checkdataSP (item){
        return await sql.query(`SELECT  [MaLK] ,[TenLK],[Gia] ,[Hinh1],[MoTa] FROM LinhKien
        where [MaLK] = '${item.value}'`)
    }
    //lay  data san pham theo ma loai
    async function checkdataML (item){
        return await sql.query(`SELECT  [MaLK] ,[TenLK],[Gia] ,[Hinh1],[MoTa] FROM LinhKien
        where  [MaLoai] = '${item.value1}' or [MaLoai] = '${item.value}' or [MaLoai] = '${item.value2}'or 
        [MaLoai] = '${item.value3}'or [MaLoai] = '${item.value4}'or [MaLoai] = '${item.value5}'or [MaLoai] ='${item.value6}'`)
    }
    return res.render('index.ejs',{
        resultDataSP :(await dataSP) ,
        resultDataML :(await dataML)  
    });
} 

let AlldevicesPage = async (req, res) => {

    await  sql.connect(sqlConfig);
    let resultAll =[]

    if( req.param('device')=='laptop'){
        resultAll = await  sql.query(`SELECT  [MaLK] ,[TenLK],[Gia] ,[Hinh1],[MoTa] FROM LinhKien
        where  [MaLoai] = 'LAP' `);
    }

    if( req.param('device')=='linhkien'){
        resultAll = await  sql.query(`SELECT  [MaLK] ,[TenLK],[Gia] ,[Hinh1],[MoTa] FROM LinhKien
        where  [MaLoai] = 'A04' OR [MaLoai] ='A05' OR [MaLoai] ='A06'OR [MaLoai] ='A07'OR 
        [MaLoai] ='A08'OR [MaLoai] ='A10'OR [MaLoai] ='CAS'OR [MaLoai] ='MAI'OR [MaLoai] ='NIC'OR 
        [MaLoai] ='VGA'OR [MaLoai] ='PSU'`);
    }

    if( req.param('device')=='phukien'){
        resultAll = await  sql.query(`SELECT  [MaLK] ,[TenLK],[Gia] ,[Hinh1],[MoTa] FROM LinhKien
        where  [MaLoai] = 'A09'OR [MaLoai] ='A14'OR [MaLoai] ='A01'OR [MaLoai] ='A02'OR [MaLoai] ='A03' `);
    }
    else {
        return res.render('DevicesPage',{
            layout:false ,
            resultAll : resultAll
        });
    }

    return res.render('DevicesPage',{
        layout:false ,
        resultAll :(await resultAll)
    });
}

export default {
    getHomePage,AlldevicesPage
}
 