<?php

$sClass  = '<%= modelName %>';
$oParent = new <%= modelName %>();
$aError  = [];


/***********************************************
  _____ ___ _   _____ _____ ____
 |  ___|_ _| | |_   _| ____|  _ \
 | |_   | || |   | | |  _| | |_) |
 |  _|  | || |___| | | |___|  _ <
 |_|   |___|_____|_| |_____|_| \_\
 ***********************************************/
if( count( $a_Query)){

  $sSerial  = array_shift( $a_Query);
  $oModel   = new $sClass( $sSerial);



/***********************************************
  ____  _____    _    ____
 |  _ \| ____|  / \  |  _ \
 | |_) |  _|   / _ \ | | | |
 |  _ <| |___ / ___ \| |_| |
 |_| \_\_____/_/   \_\____/
***********************************************/
  if( $oModel->isExist){
    $a_Result['data']   = $oModel->resume;
  }else{
    $a_Result['message'] = 'Instance doesn\'t exist';
  }

}else{

  $aData   = $oParent->all();

  foreach ($aData as $oModel) {
    $a_Result['data'][] = $oModel->resume;
  }

  $a_Result['code']    = 1;
  $a_Result['message'] = 'success';

}
