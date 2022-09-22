//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters
import sqlConfig from '../configs/connectDBmssql';

const sql = require('mssql');
let paymentMethod = async (request , response) => {
    var partnerCode = "MOMOJGMP20220805";
    var accessKey = "HuCjLWpAyVQiHujk";
    var secretkey = "2YqiHJ8OJu3UVTEr8abC4g19Ht4ftA7O";
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = "pay with MoMo";
    var redirectUrl = "http://localhost:8080/getAPImomo";
    var ipnUrl = "http://localhost:8080/getAPImomo";
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    var amount = "1000";
    var requestType = "captureWallet"
    var extraData = ""; //pass empty value if your merchant does not have stores    
    
    var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)
    
    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        accessKey : accessKey,
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        extraData : extraData,
        requestType : requestType,
        signature : signature,
        lang: 'vi'
    });
    //Create the HTTPS objects
    const https = require('https');
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    }
    //Send the request and get the response
    let url = ''; 
    const req = https.request(options, res => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (body) => {
            console.log('Body: ');
            console.log(body);
            console.log('payUrl: ');
            url = JSON.parse(body).payUrl ;
            console.log(JSON.parse(body).payUrl);
            return response.redirect(url)
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    })
    
    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    console.log("Sending....url")
    req.write(requestBody);
    req.end();
    // return response.redirect(url)
}
let momoPayPage = async (req, res)=>{
    await sql.connect(sqlConfig)
    let Itemcheck = {};
    let checkItem = 0; 
    let countItem = 0 ; 
    let monney = 0 ;
    if(req.cookies.user_id!=''){
        //get count item 
        checkItem = await sql.query(` select count (checkStore) AS countItem
        from GioHang
        where MaKH =${req.cookies.user_id} and checkStore = 1
        `)
        countItem =  checkItem.recordset[0].countItem ;
        // view item
        Itemcheck = await sql.query(`select  LinhKien.Gia   , GioHang.soluong 
        from LinhKien  
        INNER JOIN GioHang 
        on LinhKien.MaLK = GioHang.MaLK 
        where GioHang.checkStore=1 and GioHang.MaKH =${req.cookies.user_id}`);
        
        for(let i = 0 ; i <Itemcheck.rowsAffected; i++) {
            monney += Itemcheck.recordset[i].Gia * Itemcheck.recordset[i].soluong
        }
    }
    return res.render('PagePayment.ejs',{
        layout : false,
        Itemcheck ,
        monney ,    
        countItem
    });
}
let APIpayment = async (req, res)=>{
    let cardItem =[] ;
    let checkID = 0 ; 
    let user_id = req.cookies.user_id;
    let infoUser_id = '' ;
    if(req.query.resultCode==0){

        //infoUser_id
        infoUser_id = await sql.query(`select Hoten , SDT , DiaChi , Email 
        from KhachHang where MaKH = ${user_id}`);
        
        await sql.query(` UPDATE GioHang SET ThanhToan = 1 
        WHERE MaKh= ${req.cookies.user_id} and checkStore = 1 and ThanhToan = 0  `);

        // checkIdHoaDon
        checkID = await sql.query(` select count (MaHD) AS countItem from HoaDon`)

         // Inserts HoaDon
         await sql.query(` insert HoaDon values('${checkID.recordset[0].countItem + 1}',${user_id},'${infoUser_id.recordset[0].HoTen}',
         '${infoUser_id.recordset[0].DiaChi}','${infoUser_id.recordset[0].SDT}',
         '${infoUser_id.recordset[0].Email}',GETDATE());`);
    }
    console.log("API payment checkout",req.query.resultCode);
    console.log("API payment checkout",req.query);
    return res.render('payPage.ejs',
    {
        layout : false , 
    });
}
export default  {momoPayPage,paymentMethod,APIpayment} 