const express = require('express');
const router = express.Router();
let models = require('../db/db');

router.post('/getShip', async(req, res) =>{
    const {id} = req.body;
    let found = await models.ship.findByPk(id);
    if(found){
        return res.status(200).json(found);
    }
    else{
        return res.status(401);
    }
});

router.post('/updateProgress', async(req,res)=>{
   const {x, y, id} = req.body;
   await models.ship.update({x, y}, {
       where: {
           User_id : id
       }
   });
   res.status(200);
});



module.exports = router;


