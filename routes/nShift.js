const router = require("express").Router();
const verify = require("../middleware/verifyToken");
const pool = require('../dbConnection/db');


router.get("/n_shifts", verify, (req, res) => {
    const query = 'SELECT * FROM n_shifts';

    pool.query(query, async function(err, result, fields){
        if (err) {
            res.json({ code: 2, message: err.sqlMessage });
          } else {
            if (result.length > 0) {
              
                res.json(result);
             
            } else {
              return  res.json({code: 2, message : 'no data'})
            }
          }
    })

   
});

router.post("/addn_shifts", verify, (req, res) => {


   let nShift = {
    shiftType: req.body.shiftType,
    date: req.body.date,
    carderCount: req.body.carderCount,
    manPower: req.body.manPower,
    lowCarderCountReason: req.body.lowCarderCountReason,
    productType: req.body.productType
    }


   //query to create nshift
   let sql = "INSERT INTO n_shifts SET ?";

   //execute query
   let query = pool.query(sql, nShift, function (err, result, fields){

       if(err) { 
           //err no 1062 means duplicate entry
           if(err.errno == 1062){
               res.json({code: 2, message : "duplicate"})
           }else{
               res.json({code: 2, message : err.sqlMessage})
           }
       }else{
       res.status(200).json({code: 1, message : "Success", resultSql : result})
       }

   })    

});

router.delete("/deleteShift/:id",verify, (req, res) => {
    const deleteQuery = `DELETE FROM n_shifts WHERE id = ${req.params.id}`;

    let query = pool.query(deleteQuery,  function (err, result, fields){

        if(err) { 
            return res.json({code: 2, message : err.sqlMessage})
        }else{
            return  res.json({code: 1, message : 'Deleted Shift'})  
        }

    })    
})

router.get("/getOneShift/:shifId", verify, (req, res) => {
    const query = 'SELECT * FROM n_shifts WHERE id = ?';
    const reqId = [req.params.shifId];

    pool.query(query, reqId,async function(err, result, fields){
        if (err) {
            res.json({ code: 2, message: err.sqlMessage });
          } else {
            if (result.length > 0) {
              
                res.json(result[0]);
             
            } else {
              return  res.json({code: 2, message : 'no data'})
            }
          }
    })

   
});


router.get("/hour", verify, (req, res) => {
    const query = 'SELECT * FROM hours';

    pool.query(query, async function(err, result, fields){
        if (err) {
            res.json({ code: 2, message: err.sqlMessage });
          } else {
            if (result.length > 0) {
              
                res.json(result);
             
            } else {
              return  res.json({code: 2, message : 'no data'})
            }
          }
    })

   
});

router.get("/reject", verify, (req, res) => {
    const query = 'SELECT * FROM rejects';

    pool.query(query, async function(err, result, fields){
        if (err) {
            res.json({ code: 2, message: err.sqlMessage });
          } else {
            if (result.length > 0) {
              
                res.json(result);
             
            } else {
              return  res.json([])
            }
          }
    })

   
});


router.get("/getShiftTimeDropDown", verify, (req, res) => {
    const query = 'SELECT Shift, shiftType FROM shifttimeforthedropdown';

    pool.query(query, async function(err, result, fields){
        if (err) {
            res.json({ code: 2, message: err.sqlMessage });
          } else {
            if (result.length > 0) {
              
                res.json(result);
             
            } else {
              return  res.json([])
            }
          }
    })

   
});

router.get("/getLowReasonDropDown", verify, (req, res) => {
    const query = 'SELECT reason FROM loproduction_reason';

    pool.query(query, async function(err, result, fields){
        if (err) {
            res.json({ code: 2, message: err.sqlMessage });
          } else {
            if (result.length > 0) {
              
                res.json(result);
             
            } else {
              return  res.json([])
            }
          }
    })

   
});

router.post("/addhour", verify, (req, res) => {

    let hourObj = {
        shiftId: req.body.shifId, 
        hour: req.body.hour, 
        quantity: req.body.quantity, 
        reasonForLowProductions: req.body.reasonForLowProductions
    }
    let sql = "INSERT INTO hours SET ?";


   //execute query
   let query = pool.query(sql, hourObj, function (err, result, fields){

    if(err) { 
        //err no 1062 means duplicate entry
        if(err.errno == 1062){
            res.json({code: 2, message : "duplicate"})
        }else{
            res.json({code: 2, message : err.sqlMessage})
        }
    }else{
    res.status(200).json({code: 1, message : "Success"})
    }

})    
});

router.post("/reject_reasons", verify, (req, res) => {

    const rejReason = req.body;

    
    

    let sql = "INSERT INTO reject_reasons SET ?";


   //execute query
   let query = pool.query(sql, rejReason, function (err, result, fields){

    if(err) { 
        //err no 1062 means duplicate entry
        if(err.errno == 1062){
            res.json({code: 2, message : "duplicate"})
        }else{
            res.json({code: 2, message : err.sqlMessage})
        }
    }else{
    res.status(200).json({code: 1, message : "Success"})
    }

})    


   
});






module.exports = router;