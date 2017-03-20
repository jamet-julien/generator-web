<?php



if( strpos( $_SERVER['SERVER_NAME'], 'byarmstrong') !== false){

  define('MYSQL_HOST',	'localhost');
  define('MYSQL_LOGIN',	'root');
  define('MYSQL_PWD',		'root');
  define('MYSQL_DB',		'socialbreakfast');

}else{

  define('MYSQL_HOST',	'localhost');
  define('MYSQL_LOGIN',	'root');
  define('MYSQL_PWD',		'root');
  define('MYSQL_DB',		'socialbreakfast');

}
