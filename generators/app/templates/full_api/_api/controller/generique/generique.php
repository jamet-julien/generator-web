<?php

switch( $s_Method){

  case 'GET':
    require_once( __DIR__ . '/read.php');
    break;
  case 'POST':
    require_once( __DIR__ . '/add.php');
    break;
  case 'DELETE':
    require_once( __DIR__ . '/delete.php');
    break;
  case 'PUT':
    require_once( __DIR__ . '/update.php');
    break;
  default:

    $aResult['message'] = 'error method';
    break;
}
