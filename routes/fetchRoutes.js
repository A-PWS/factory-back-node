const router = require("express").Router();
const verify = require("../middleware/verifyToken");
const pool = require('../dbConnection/db');

router.get("/getShiftReport", verify, (req, res) => {
    const query = `
    SELECT n_shifts.id, n_shifts.shiftType, DATE_FORMAT(n_shifts.date, "%m/%d/%Y") as date,
           SUM(hours.quantity) as total_quantity, n_shifts.carderCount, n_shifts.manPower,
           SUM(reject_reasons.count) as total_count
    FROM n_shifts
    JOIN (SELECT shiftId, SUM(quantity) as quantity FROM hours GROUP BY shiftId) as hours
         ON n_shifts.id = hours.shiftId
    JOIN reject_reasons
         ON n_shifts.id = reject_reasons.shiftId
    WHERE MONTH(n_shifts.date) = MONTH(CURRENT_DATE())
      AND YEAR(n_shifts.date) = YEAR(CURRENT_DATE())
    GROUP BY n_shifts.id, n_shifts.shiftType, n_shifts.date, n_shifts.carderCount, n_shifts.manPower
`;


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


router.get("/getShiftReportReject", verify, (req, res) => {
    const query = `
    SELECT reject_reasons.hour, reject_reasons.shiftId, DATE(reject_reasons.date) as date,
    SUM(reject_reasons.count) as total_count, reject_reasons.reason
    FROM reject_reasons
    WHERE MONTH(reject_reasons.date) = MONTH(CURRENT_DATE())
    AND YEAR(reject_reasons.date) = YEAR(CURRENT_DATE())
    GROUP BY reject_reasons.hour, reject_reasons.shiftId, DATE(reject_reasons.date), reject_reasons.reason
    ORDER BY reject_reasons.id DESC

    `;


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

router.get("/getShiftReportReject", verify, (req, res) => {
    const query = `
    SELECT reject_reasons.hour, reject_reasons.shiftId, DATE(reject_reasons.date) as date,
    SUM(reject_reasons.count) as total_count, reject_reasons.reason
    FROM reject_reasons
    WHERE MONTH(reject_reasons.date) = MONTH(CURRENT_DATE())
    AND YEAR(reject_reasons.date) = YEAR(CURRENT_DATE())
    GROUP BY reject_reasons.hour, reject_reasons.shiftId, DATE(reject_reasons.date), reject_reasons.reason
    ORDER BY reject_reasons.id DESC
    `;


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

router.get("/hourBreakDown", verify, (req, res) => {
    const query = `
    SELECT reject_reasons.hour, reject_reasons.shiftId, SUM(reject_reasons.count) as total_count,
    n_shifts.shiftType, n_shifts.date
    FROM reject_reasons
    JOIN n_shifts ON n_shifts.id = reject_reasons.shiftId
    WHERE n_shifts.date = (
        SELECT date
        FROM n_shifts
        ORDER BY date DESC
        LIMIT 1
    )
    GROUP BY reject_reasons.hour, reject_reasons.shiftId, n_shifts.shiftType, n_shifts.date
    `;


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

router.get("/hourBreakDownQuntity", verify, (req, res) => {
    const query = `
    SELECT hours.quantity, hours.hour
    FROM hours
    JOIN n_shifts ON n_shifts.id = hours.shiftId
    WHERE n_shifts.date = (
        SELECT date
        FROM n_shifts
        ORDER BY date DESC
        LIMIT 1
    )
    GROUP BY hours.quantity, hours.hour
    `;


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


router.get("/getDailyReject", verify, (req, res) => {
    const query = `
    SET @lastEnteredDate = (
        SELECT date
        FROM n_shifts
        ORDER BY date DESC
        LIMIT 1
    );
    
    SELECT r.reason, IFNULL(y.Daycount, 0) as Daycount, IFNULL(z.Nightcount, 0) as Nightcount, @lastEnteredDate as day
    FROM reject_reasons as r
    LEFT JOIN (
        SELECT reason, SUM(count) as Daycount
        FROM reject_reasons
        INNER JOIN n_shifts ON reject_reasons.shiftId = n_shifts.id
        WHERE n_shifts.date = @lastEnteredDate AND n_shifts.shiftType = 'Day'
        GROUP BY reason
    ) as y ON r.reason = y.reason
    LEFT JOIN (
        SELECT reason, SUM(count) as Nightcount
        FROM reject_reasons
        INNER JOIN n_shifts ON reject_reasons.shiftId = n_shifts.id
        WHERE n_shifts.date = @lastEnteredDate AND n_shifts.shiftType = 'Night'
        GROUP BY reason
    ) as z ON r.reason = z.reason
    GROUP BY r.reason, y.Daycount, z.Nightcount, @lastEnteredDate;
    `.replace(/\`/g, '');
    
    // Execute the query using the connection pool
    pool.query(query, function(err, result, fields) {
      if (err) {
        res.json({ code: 2, message: err.sqlMessage });
      } else {
        if (result[1].length > 0) {
          result[1].forEach(eachResult => {
            eachResult.reason = eachResult.reason.replace(/\r\n/g, '');
          });
          res.json(result[1]);
        } else {
          res.json([]);
        }
      }
    });

   
});

module.exports = router;