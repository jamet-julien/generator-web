<?php

$aPost   = filter_input_array( INPUT_POST);
$sClass  = ucfirst( $s_folder);

if( count( $aPost)){

  $oParent  = new $sClass( $aPost);

  if( $oParent->isExist){

    $a_Result['code']    = 1;
    $a_Result['message'] = 'success';
    $a_Result['data']    = $oParent->resume;

  }else{
    $a_Result['message'] = 'Instance doesn\'t exist';
  }

}else{
  $a_Result['message'] = 'error data needed';
}
