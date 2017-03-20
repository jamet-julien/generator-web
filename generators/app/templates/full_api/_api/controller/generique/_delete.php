<?php

parse_str( file_get_contents( 'php://input'), $aDelete);
$sClass   = ucfirst( $s_folder);


if( count( $a_Query)&& in_array( 'ref', array_keys( $aDelete))){

  $sSerial  = array_shift( $a_Query);
  $oModel   = new $sClass( $sSerial, $aDelete['ref']);

  if( $oModel->isExist){

    $oModel->delete();
    $a_Result['code']    = 1;
    $a_Result['message'] = 'succes';

  }else{
    $a_Result['message'] = 'Instance doesn\'t exist';
  }

}else{
  $a_Result['message'] = 'error identifiant needed';
}
