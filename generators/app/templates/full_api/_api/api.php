<?php
// system
session_start();
ini_set('display_errors', 1);

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
		if( is_file( $_file)){
			require_once( $_file);
		}else{
			$a_Result['message'] = 'no method';
		}
		unset($_file);
	break;

}

Header::setStatus( $i_codeHeader);
Header::setContentType('json');
Header::exec();
echo json_encode( (object) $a_Result);
exit();
