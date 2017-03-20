<?php
// system
session_start();
ini_set('display_errors', 0);

// init vars
require_once __DIR__ . '/controller/_init_var.php' ;
require_once __DIR__ . '/vars/global.vars.php' ;

// utils
require_once __DIR__ . '/classes/utils.php' ;

// mysql
require_once __DIR__ . '/vars/mysql.vars.php' ;

if( MYSQL_DB !== '') $oDAO = new DAO();


$a_file = array(
	'root'   => __DIR__,
	'ctrl'   => 'controller',
	'folder' => $s_folder,
	'file'   => $s_folder.'.php'
);

$_file =  implode( '/', $a_file );

switch( $s_folder){

	default :
		if( is_file( $_file)) require_once( $_file);
		unset($_file);
	break;

}

header('Content-Type: application/json');
	echo json_encode( (object) $a_Result);
exit();
?>
