<?php



if( strpos( $_SERVER['SERVER_NAME'], 'byarmstrong') !== false){

  define('MYSQL_HOST',	'<%= host %>');
  define('MYSQL_LOGIN',	'<%= user %>');
  define('MYSQL_PWD',		'<%= password %>');
  define('MYSQL_DB',		'<%= database %>');

}else{

  define('MYSQL_HOST',	getenv('MYSQL_HOST'));
  define('MYSQL_LOGIN',	getenv('MYSQL_LOGIN'));
  define('MYSQL_PWD',		getenv('MYSQL_PWD'));
  define('MYSQL_DB',		getenv('MYSQL_DB'));

}
