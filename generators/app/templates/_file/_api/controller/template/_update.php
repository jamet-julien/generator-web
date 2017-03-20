<?php

parse_str( file_get_contents( 'php://input') ,$aPut);
$sClass  = '<%= modelName %>';

/***********************************************
 __     ___    ____
 \ \   / / \  |  _ \
  \ \ / / _ \ | |_) |
   \ V / ___ \|  _ <
    \_/_/   \_\_| \_\
***********************************************/

<%- include('param', { data: data});%>


/***********************************************
  _____ ___ _   _____ _____ ____
 |  ___|_ _| | |_   _| ____|  _ \
 | |_   | || |   | | |  _| | |_) |
 |  _|  | || |___| | | |___|  _ <
 |_|   |___|_____|_| |_____|_| \_\
 ***********************************************/
 if( count( $a_Query)){

  $aTreat = treatPost( $aPUT, $aFilter);

  $sSerial  = array_shift( $a_Query);
  $oModel   = new $sClass( $sSerial);

/***********************************************
  _   _ ____  ____    _  _____ _____
 | | | |  _ \|  _ \  / \|_   _| ____|
 | | | | |_) | | | |/ _ \ | | |  _|
 | |_| |  __/| |_| / ___ \| | | |___
  \___/|_|   |____/_/   \_\_| |_____|
***********************************************/

  if( $oModel->isExist){

    foreach ($aTreat['data'] as $sKey => $sValue) {
      if( !in_array( $sKey, $aTreat['error'])){
        $oModel->$sKey = $sValue;
      }
    }


    $oModel->save();
    $a_Result['code']    = 1;
    $a_Result['message'] = 'succes';
    $a_Result['data']    = $oModel->resume;


  }else{
    $aResult['message'] = 'Instance doesn\'t exist';
  }

}else{
  $aResult['message'] = 'error identifiant needed';
}
