<?php

$a_js            = array();
$a_css           = array();
$a_include_pages = array();

$aGet            = filter_input_array( INPUT_GET, FILTER_SANITIZE_STRING);

$sQuery          = ( isset( $aGet['query']))?  $aGet['query'] : '';
$aQuery          = explode( '/', $sQuery) + array('home');

$s_folder        = array_shift( $aQuery);

$a_meta          = array();
$i_lang          = 1 ;
$s_lang          = ( isset( $aGet['lang']))?  strtolower( $aGet['lang']) : 'fr' ;
$s_locales       = $s_lang . '_' . strtoupper( $s_lang) ;

$s_device        = 'none';

$s_theme         = "default";
$s_Method        = $_SERVER['REQUEST_METHOD'];


$aResult         = array(
													'code'    => 0,
													'message' => 'error',
													'data'    => array(),
												);

$s_general_display;
$mysql;
