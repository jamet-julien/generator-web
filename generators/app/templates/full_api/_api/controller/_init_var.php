<?php

$a_js            = array();
$a_css           = array();
$a_include_pages = array();

$a_Get           = filter_input_array( INPUT_GET, FILTER_SANITIZE_STRING);

$s_Query         = ( isset( $a_Get['query']) && trim( $a_Get['query']) != '')?  $a_Get['query'] : '_generique';
$a_Query         = explode( '/', $s_Query) + array('_generique');

$s_folder        = array_shift( $a_Query);

$s_device        = 'none';

$s_Method        = $_SERVER['REQUEST_METHOD'];

$a_Result        = array(
													'code'    => 0,
													'message' => 'error',
													'data'    => array(),
												);

$i_codeHeader    = 200;

$mysql;
