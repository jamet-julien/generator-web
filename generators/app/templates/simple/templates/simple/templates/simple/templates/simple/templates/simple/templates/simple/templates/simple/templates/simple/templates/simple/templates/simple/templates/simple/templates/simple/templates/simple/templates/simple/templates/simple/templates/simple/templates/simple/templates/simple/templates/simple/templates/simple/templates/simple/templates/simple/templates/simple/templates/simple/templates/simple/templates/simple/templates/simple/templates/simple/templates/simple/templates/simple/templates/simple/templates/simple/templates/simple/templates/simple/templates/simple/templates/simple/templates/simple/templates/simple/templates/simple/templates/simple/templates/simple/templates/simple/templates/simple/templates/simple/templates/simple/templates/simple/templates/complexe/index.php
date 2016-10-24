<?php
// system
session_start();
ini_set('display_errors', 'on');

// init vars
$a_js            = array();
$a_css           = array();
$a_include_pages = array();

$sQuery          = ( isset($_GET['query']) && trim( $_GET['query']) !== '')?  $_GET['query'] : 'home';
$aQuery          = explode( '/', $sQuery);

$s_folder        = array_shift( $aQuery);

$a_meta          = array();
$i_lang          = 1 ;
$s_lang          = ( isset($_GET['lang']))?  strtolower( $_GET['lang']) : 'fr' ;
$s_locales       = $s_lang . '_' . strtoupper( $s_lang) ;

$s_general_display ;
$mysql;

$s_device        = 'none';

// require vars
$s_theme         = "default";
require_once __DIR__ . '/vars/global.vars.php' ;

// locales
require_once __DIR__ . '/locales/' . $s_locales . '/trad.php' ;
require_once __DIR__ . '/locales/' . $s_locales . '/configuration.php' ;

// utils
require_once __DIR__ . '/classes/utils.php' ;

// mysql
require_once __DIR__ . '/vars/mysql.vars.php' ;
if(MYSQL_DB !== '') $oDAO = new DAO();


// display
require_once __DIR__ . '/controller/_display/categorizr.php';
require_once __DIR__ . '/vars/inc.vars.php' ;
require_once __DIR__ . '/controller/_display/display.php' ;

switch($s_folder)
{
	default :

		if(
				isset( $aModule[ $s_folder ]) &&
				isset( $aModule[ $s_folder ]['controller'])
			){

				$aControler = array(
						'root'    => __DIR__,
						'folder'  => 'controller',
						'ctrl'    => $aModule[$s_folder]['controller'],
				);

				$_file = implode( '/', $aControler);

				if( is_file( $_file)) require_once( $_file );
				unset($_file);

		}

	break;
}

foreach($a_meta as $key => $val) $a_meta[$key] = htmlspecialchars($val) ;

// output
foreach( $a_include_pages as $key => $val)
{
	if(!empty( $val)) include __DIR__ . PATH_LAYOUT . $val ;
}



if(isset($_SESSION['message'])) unset($_SESSION['message']);
