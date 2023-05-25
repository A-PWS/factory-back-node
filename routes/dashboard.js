const router = require("express").Router();
const verify = require("../middleware/verifyToken");
const pool = require('../dbConnection/db');

router.get("/dashboardAVG", verify, (req, res) => {
    const query = `
        SELECT 
        AVG((reject_total.total_count + prod_total.total_quantity) / 24) AS average
    FROM
        (SELECT 
            SUM(count) AS total_count
        FROM
            reject_reasons
        JOIN n_shifts ON reject_reasons.shiftId = n_shifts.id
        WHERE
            DATE(n_shifts.date) = (SELECT 
                    date
                FROM
                    n_shifts
                ORDER BY date DESC
                LIMIT 1)) AS reject_total
            CROSS JOIN
        (SELECT 
            SUM(quantity) AS total_quantity
        FROM
            hours
        JOIN n_shifts ON hours.shiftId = n_shifts.id
        WHERE
            DATE(n_shifts.date) = (SELECT 
                    date
                FROM
                    n_shifts
                ORDER BY date DESC
                LIMIT 1)) AS prod_total;

    `;

    pool.query(query, async function(err, result, fields){
        if (err) {
            res.json({ code: 2, message: err.sqlMessage });
          } else {
            if (result.length > 0) {
              
                res.json( {average:  Math.round(result[0].average * 100) / 100});
             
            } else {
              return  res.json({})
            }
          }
    })

   
});

router.get("/dashboardTotalProductionUpToDate", verify, (req, res) => {
    const query = `
    SELECT SUM(hours.quantity) as total_quantity
    FROM hours
    JOIN n_shifts ON hours.shiftId = n_shifts.id
    WHERE DATE(n_shifts.date) = (SELECT date
                                 FROM n_shifts
                                 ORDER BY date DESC
                                 LIMIT 1);
    
    `;

    pool.query(query, async function(err, result, fields){
        if (err) {
            res.json({ code: 2, message: err.sqlMessage });
          } else {
            if (result.length > 0) {
              
                res.json( result);
             
            } else {
              return  res.json({})
            }
          }
    })

   
});
router.get("/dashboardTotalRejectionUpToDate", verify, (req, res) => {
    const query = `
    SELECT SUM(reject_reasons.count) as total_count
    FROM n_shifts
    JOIN reject_reasons ON n_shifts.id = reject_reasons.shiftId
    WHERE DATE(n_shifts.date) = (SELECT date
                                 FROM n_shifts
                                 ORDER BY date DESC
                                 LIMIT 1);
    
    `;

    pool.query(query, async function(err, result, fields){
        if (err) {
            res.json({ code: 2, message: err.sqlMessage });
          } else {
            if (result.length > 0) {
              
                res.json( result);
             
            } else {
              return  res.json({})
            }
          }
    })

   
});

module.exports = router;