<?php

$aJs             = array();
$aCss            = array();
$aView           = array();

$aGet            = filter_input_array( INPUT_GET, FILTER_SANITIZE_STRING);

$sQuery          = ( isset( $aGet['query']) && trim( $aGet['query']) != '')?  $aGet['query'] : 'home';
$aQuery          = explode( '/', $sQuery) + array('home');

$s_ctrl          = array_shift( $aQuery);

$a_meta          = array();
$mysql;
