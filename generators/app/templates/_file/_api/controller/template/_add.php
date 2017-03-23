<?php

$bValid  = true;
$aPost   = filter_input_array( INPUT_POST);
$sClass  = '<%= modelName %>';
$oParent = new <%= modelName %>();
$aError  = [];


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

if( count( $aPost)){

  $aPOST  = array_merge( $aDefault, $aPost);
  $aTreat = treatPost( $aPOST, $aFilter);

  <% if( ~field.indexOf('email') ){ -%>
  // verification des EMAIL
  $aMail   = $oParent->all( "email = '{$aTreat['data']['email']}'");

  $sDomain = trim( strstr( $aTreat['data']['email'], '@'), '@');
  getmxrr( $sDomain, $aHost);

  if( count( $aMail) || (SPACE == "PROD" && !count( $aHost))){
    $sName                 = 'email';
    $bValid                = false;
    $aMandatory[ $sName ]  = false;
    $aError[]              = $sName;
  }
	<% } -%>




  // Mandatory OK ?
  foreach( $aMandatory as $sName => $bValue){
       if( in_array( $sName, $aTreat['error']) && !in_array( $sName, $aError)){
               $bValid               = false;
               $aMandatory[ $sName ] = false;
               $aError[]             = $sName;
       }
  }

/***********************************************
   ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
***********************************************/

  if( $bValid){

    $oModel  = new $sClass( $aTreat['data']);

    if( trim( $oModel->id) != '0'){

      $a_Result['code']    = 1;
      $a_Result['message'] = 'success';
      $a_Result['data']    = $oModel->resume;

    }else{
      $a_Result['message'] = 'Instance doesn\'t create';
    }

  }else{

    $a_Result['message'] = 'error data';
    $a_Result['error']   = $aError;

  }

}else{
  $a_Result['message'] = 'error data needed';
}
