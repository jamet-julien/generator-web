var user = {
  prenom : 'julien',
  age    : 33,
  nom    : 'dupont'
};




var oStep     = {
  test : user.prenom == 'julien',
  if   : {
    true  : {
        action : getAge,
        test   : user.age > 18,
        if     : {
          true : {
            action : [final, 'max majeur']
          },
          false : {
            action : [final, 'min mineur']
          }
        }
    },
    false : {}
  }
};

/**
 * [getAge description]
 * @return {[type]} [description]
 */
function getAge(){
  user.age -= 15;
}

/**
 * [final description]
 * @param  {[type]} sMsg [description]
 * @return {[type]}      [description]
 */
function final( sMsg){
  alert( sMsg);
}

DecisionTree.decide( oStep, user)
         .then( console.log)
         .catch( console.warn);
