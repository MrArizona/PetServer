var express = require('express');
var router = express.Router();
var idRouter = express.Router();
var petController = require('./petController');


var decodeToken = require('../../auth/auth').decodeToken;
var getFreshUser = require('../../auth/auth').getFreshUser;
var queryExtractor = require('../../middleware.js').prepareQuery
//Access control middleware
var  ownsPet = function(){
  return function(req, res, next){
    // console.log('ownsPet()')
    var pet = req.pet

    if (String(pet.owner) == String(req.user._id)){
      // console.log('user owns this pet!')
      next();
    }else{
      console.log('User does not have access to this resource.')
      res.status(400).send('This is not you pet bitch.')

      // console.log('Actual owner: ',   pet.owner)
      // console.log('Received user: ',   req.user._id)
    }
  }
}

var checkUser = [decodeToken(), getFreshUser(), ownsPet()];





idRouter.param('id', petController.param);
//Edit ability needs authorization
idRouter.route('/:id')
.put(checkUser,petController.put)
.get(petController.getId)

router.use('/id', idRouter)

router.route('/')
.get(queryExtractor(), petController.get)
.post(decodeToken(), getFreshUser(),petController.post)











module.exports = router;
