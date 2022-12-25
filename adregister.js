const express=require("express")
const path = require("path")
var bodyParser=require("body-parser");
const{MongoClient}=require('mongodb');
const { pid } = require("process");
const url='mongodb://localhost:27017';
const client=new MongoClient(url);
const db_name='Echallan';
const app=express()
const port=4000;
const staticPath = path.join(__dirname,'public');

//static path: the entire public directory is made static
app.use(express.static(staticPath));
 
app.get("/", (req, res) => {
    res.sendFile(`${staticPath}/index.html`);
});

app.get("/Admin", (req, res) => {
    res.sendFile(`${staticPath}/admin.html`);
});

app.get("/userlogin", (req, res) => {
    res.sendFile(`${staticPath}/userlogin.html`);
});

app.use(bodyParser.urlencoded({
    extended:false

}));
client.connect();
const db=client.db(db_name)

app.post("/Admin.html", async (req, res) => {
    try{
        const policeid=req.body.policeid;
        const password=req.body.licenseNo;

        const adminid = await db.adminregister.findOne({policeid:policeid});

        if(policeid.password==password){
            res.status(201).render("driverform");
        }else{
            res.send("invalid login details");
        }
    } catch (error) {
        res.status(400).send("invalid login details"+error);
    }
});

app.post("/driverform.html", async (req, res) => {
    try{
        const fullname=req.body.fullname
        const license=req.body.LicenseNo
        const policeid=req.body.Policeid
        const violationdate=req.body.Dateofviolation
        const vehicleno=req.body.VehicleNumber
        const Mobileno=req.body.pass.MobileNo
        const dt={
            "fullname":fullname,
            "license":license,
            "policeid":policeid,
            "violation":violationdate,
            "vehicle":vehicleno,
            "Mobile":Mobileno
        }
    } catch (error) {
        res.status(400).send(error);
    }
  const Collection=  db.collection('driverdata')
    Collection.insertOne(dt, function(err,collection){
        if(err)console.log(err);    
        else console.log("Record inserted");
    })
});
/*
app.post("/userlogin", async (req, res) => {
    try{
        const vehicleno=req.body.Vehicle;
        const password=req.body.Pass;

        const userid = await db.driverdata.find({vehicle:vehicleno});

        if(vehicleno.password==password){
            res.status(201).render("pay");
        }else{
            res.send("invalid login details");
        }
    } catch (error) {
        res.status(400).send("invalid login details");
    }
});*/

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});