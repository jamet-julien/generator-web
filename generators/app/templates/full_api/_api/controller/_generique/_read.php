<?php

$sClass   = ucfirst( $s_folder);

if( count( $a_Query)){

  $sSerial  = array_shift( $a_Query);
  $oModel   = new $sClass( $sSerial);

  if( $oModel->isExist){
    $a_Result['code']   = 1;
    $a_Result['message']= 'success';
    $a_Result['data']   = $oModel->resume;
  }else{
    $aResult['message'] = 'Instance doesn\'t exist';
  }

}else{

  $oParent = new $sClass();
  $aData   = $oParent->all();

  foreach ($aData as $oModel) {
    $a_Result['data'][] = $oModel->resume;
  }

  $a_Result['code']    = 1;
  $a_Result['message'] = 'success';

}
