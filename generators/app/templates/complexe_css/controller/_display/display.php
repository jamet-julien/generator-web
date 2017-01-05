<?php
// device and IE
$s_device = categorizr();
if(
	preg_match("#MSIE 6#", $_SERVER['HTTP_USER_AGENT'])
	||
	preg_match("#MSIE 7#", $_SERVER['HTTP_USER_AGENT'])
	||
	preg_match("#MSIE 8#", $_SERVER['HTTP_USER_AGENT'])
) $s_device = 'ie' ;

// Init display

if(isset($_GET['display']) && in_array($_GET['display'], $a_display_devices))
{

	$s_general_display = $s_device = $_GET['display'];

}else {

	$s_general_display = ( in_array($s_device , $a_display_devices))? $s_device : 'desktop' ;

}

$a_css           = (isset( $a_global_inc[ $s_general_display ]['css']))?  $a_global_inc[$s_general_display]['css']: array();
$a_js            = (isset( $a_global_inc[ $s_general_display ]['js']))? $a_global_inc[$s_general_display]['js'] : array();
$a_include_pages = (isset( $a_global_inc[ $s_general_display ]['tpl']))? $a_global_inc[$s_general_display]['tpl'] : array();
