<?php

parse_str( file_get_contents( 'php://input') ,$aPut);
$sClass   = ucfirst( $s_folder);


if( count( $a_Query)){

  $sSerial  = array_shift( $a_Query);
  $oModel   = new $sClass( $sSerial);

  if( $oModel->isExist){

    foreach ($aPut as $sKey => $sValue) {
      $oModel->$sKey = $sValue;
    }

    $oModel->save();
    $a_Result['code']    = 1;
    $a_Result['message'] = 'succes';
    $a_Result['data']    = $oModel->resume;


  }else{
    $a_Result['message'] = 'Instance doesn\'t exist';
  }

}else{
  $a_Result['message'] = 'error identifiant needed';
}
