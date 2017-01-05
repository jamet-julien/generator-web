<?php
// system
session_start();
ini_set('display_errors', 'on');
$_GET = array_map('strip_tags', $_GET) ;

// init vars
$a_js            = array();
$a_css           = array();
$a_include_pages = array();

$sQuery          = ( isset($_GET['query']))?  $_GET['query'] : '';
$aQuery          = explode('/', $sQuery) + array('home');
$s_folder        = array_shift( $aQuery);

$i_lang          = 1 ;
$s_lang          = ( isset($_GET['lang']))?  strtolower( $_GET['lang']) : 'fr' ;
$s_locales       = $s_lang . '_' . strtoupper( $s_lang) ;
$aResult         = array(
													'code'    => 0,
													'message' => 'error',
													'data'    => array(),
												);

$s_Method         = $_SERVER['REQUEST_METHOD'];



// require vars
require_once __DIR__ . '/../vars/global.vars.php' ;

// locales
require_once __DIR__ . '/locales/' . $s_locales . '/trad.php' ;
require_once __DIR__ . '/locales/' . $s_locales . '/configuration.php' ;

// utils
require_once __DIR__ . '/../classes/utils.php' ;

// mysql
require_once __DIR__ . '/../vars/mysql.vars.php' ;
if(MYSQL_DB !== '') $oDAO = new DAO();

switch( $s_folder)
{
	default :

		if(isset( $aModule[ $s_folder ]) && isset( $aModule[ $s_folder ]['controller']))
		{

			$_file = __DIR__ . '/controller' . $aModule[ $s_folder ]['controller'] ;

			if( is_file( $_file)) require_once( $_file );
			unset($_file);
		}

	break;


}

header('Content-Type: application/json');
echo json_encode( (object) $aResult);
exit();
?>
