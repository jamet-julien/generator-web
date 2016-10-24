<?php



if( strpos( $_SERVER['SERVER_NAME'], 'byarmstrong') !== false){

  define('MYSQL_HOST',	'<%= host %>');
  define('MYSQL_LOGIN',	'<%= user %>');
  define('MYSQL_PWD',		'<%= password %>');
  define('MYSQL_DB',		'<%= database %>');

}else{

  define('MYSQL_HOST',	'<%= host %>');
  define('MYSQL_LOGIN',	'<%= user %>');
  define('MYSQL_PWD',		'<%= password %>');
  define('MYSQL_DB',		'<%= database %>');

}
