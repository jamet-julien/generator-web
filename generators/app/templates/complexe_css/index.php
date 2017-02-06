<?php
// system
session_start();
ini_set('display_errors', 0);

// init vars
require_once __DIR__ . '/controller/_init_var.php' ;
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
