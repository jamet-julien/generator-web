<?php
// system
session_start();
ini_set('display_errors', 0);

// init vars
require_once __DIR__ . '/../controller/_init_var.php' ;
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
