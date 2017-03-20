<?php

switch( $s_Method){

  case 'GET':
    require_once( __DIR__ . '/_read.php');
    break;
  case 'POST':
    require_once( __DIR__ . '/_add.php');
    break;
  case 'DELETE':
    require_once( __DIR__ . '/_delete.php');
    break;
  case 'PUT':
    require_once( __DIR__ . '/_update.php');
    break;
  default:

    $a_Result['message'] = 'error method';
    break;
}
