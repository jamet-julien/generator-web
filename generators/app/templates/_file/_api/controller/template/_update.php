<?php
parse_str( file_get_contents( 'php://input') ,$aPUT);
$bValid  = true;
$sClass  = '<%= modelName %>';
$oParent = new <%= modelName %>();

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

/***********************************************
  _   _ ____  ____    _  _____ _____
 | | | |  _ \|  _ \  / \|_   _| ____|
 | | | | |_) | | | |/ _ \ | | |  _|
 | |_| |  __/| |_| / ___ \| | | |___
  \___/|_|   |____/_/   \_\_| |_____|
***********************************************/
  if(  $bValid){

      if($oModel->isExist){

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
        $a_Result['message'] = 'Instance doesn\'t exist';
      }
  }else{
    $a_Result['message'] = 'error data';
    $a_Result['error']   = $aError;
  }


}else{
  $a_Result['message'] = 'error identifiant needed';
}
