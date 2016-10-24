<?php

// CONSTANT
$bPortNeed = true;
define('HTTP_DOMAIN', 	'http://' . $_SERVER['SERVER_NAME']);

if( strpos( $_SERVER['SERVER_NAME'], 'opes.byarmstrong') !== false){

  $bPortNeed = false;
  define('PATH_ROOT'  ,		'/<%= pathRoot %>/');
  define('SPACE', "DEV");

} else if( strpos( $_SERVER['SERVER_NAME'], 'socialwall-accor.byarmstrong') !== false){

  $bPortNeed = false;
  define('PATH_ROOT'  ,		'/');
  define('SPACE', "PROD");

} else {

  define('PATH_ROOT'  ,		'/<%= pathRoot %>/');
  define('SPACE', "LOCAL");

}





define('DEBUG_ACTIVE',	true);

$sPort = '';

if( $bPortNeed && isset( $_SERVER['SERVER_PORT']) && trim( $_SERVER['SERVER_PORT']) != ''){
  $sPort = ':'.$_SERVER['SERVER_PORT'];
}

// VAR
define('HTTP_ROOT'   ,	HTTP_DOMAIN . $sPort. PATH_ROOT);
define('HTTP_TMP'    ,	HTTP_ROOT   . '_tmp/');
define('PATH_LAYOUT' ,  '/webroot/' . $s_theme .'/');
define('HTTP_LAYOUT' ,  HTTP_ROOT   . PATH_LAYOUT );
define('HTTP_MEDIA'  ,	HTTP_ROOT   . 'webroot/media/');

// DISPLAY
$a_display_devices = array( 'desktop', 'tablet');
