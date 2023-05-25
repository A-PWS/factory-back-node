const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../middleware/validation");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require('../dbConnection/db');
const verify = require("../middleware/verifyToken");




router.post("/register", async (req, res) => {

    //validating the request body
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    
    //setting values
    const userName = req.body.name;
    const userEmail = req.body.email;
    const userPassword = hashedPassword;
    const createdDate  =  convertToMySQLTimestamp(new Date().toLocaleString());
    ;

    //user object
    let user = {name: userName, email: userEmail, password: userPassword, created_at: createdDate }

    //query to create user
    let sql = "INSERT INTO users SET ?";

    //execute query
    let query = pool.query(sql, user, function (err, result, fields){

        if(err) { 
            //err no 1062 means duplicate entry
            if(err.errno == 1062){
                res.json({code: 2, message : "Email is Taken"})
            }else{
                res.json({code: 2, message : err.sqlMessage})
            }
        }else{
        res.status(200).json({code: 1, message : "Success"})
        }

    })    

});


function convertToMySQLTimestamp(dateTimeString) {
    const dateParts = dateTimeString.split(', ')[0].split('/');
    const timeParts = dateTimeString.split(', ')[1].split(' ')[0].split(':');
    const amPm = dateTimeString.split(', ')[1].split(' ')[1];
  
    let hours = parseInt(timeParts[0]);
    if (amPm === 'PM') {
      hours += 12;
    }
    hours = hours.toString().padStart(2, '0');
  
    const year = dateParts[2];
    const month = dateParts[0].padStart(2, '0');
    const day = dateParts[1].padStart(2, '0');
    const minutes = timeParts[1].padStart(2, '0');
    const seconds = timeParts[2].padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  

router.post("/login", async (req, res) => {

    //validating request body
    const { error } = loginValidation(req.body);
    if (error) {
        return res.json({code: 2, message : 'Illegal credentials'});
    }

    //query to get the full row of the provided email
    const selectEmailQuery = 'SELECT * FROM users WHERE email = ?';
    const reqEmail = [req.body.email];

    //execute query
    let selectQuery = pool.query(selectEmailQuery, reqEmail, async function (err, result, fields) {
        if (err) {
          res.json({ code: 2, message: err.sqlMessage });
        } else {
          if (result.length > 0) {
            // Email exists, handle accordingly (e.g., check password now)

            //password of the requesred user from db
            const password = result[0].password;

            //decrypt & compare the actual password with the user given password
            const validPass = await bcrypt.compare(req.body.password, password);
            if (!validPass){
                return  res.json({code: 2, message : 'invalid email or password'})  
            }else{

                //CREATE AND ASIGN JWT TOKEN
                const token = jwt.sign({ email: result[0].email, password:result[0].password }, process.env.JWT_SECRET);
                return  res.json({success: true,code: 1, message : 'Succesful Login', token: token, user_details: result[0].email })  
            }          
          } else {
            // Email doesn't exist
            return  res.json({code: 2, message : 'no user with that email'})
          }
        }
      });

});

router.get("/logout/:token",  (req, res) => {
    return  res.json({code: 1, message : 'Logged out'})  
});

router.delete("/deleteUser", verify, (req, res) => {

    const token = req.header('Authorization')
    if (!token) {
        return res.status(401).send('Access Denied')
    }else{

        const tokenArr = token.split(" ");
        jwt.verify(tokenArr[1], process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.status(401).send("failed to verify token");
            } else {
                

                const deleteQuery = 'DELETE FROM users WHERE email = ?;';
                const userEmail = [decodedToken.email];

                let query = pool.query(deleteQuery, userEmail, function (err, result, fields){

                    if(err) { 
                        return res.json({code: 2, message : err.sqlMessage})
                    }else{
                        return  res.json({code: 1, message : 'Deleted User'})  
                    }
            
                })    

            }
        })
    }


});


router.get("/",  (req, res) => {
    res.send("login running");
});

module.exports = router;