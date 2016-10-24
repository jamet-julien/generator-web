<?php

$a_css['<%= newController %>'] = array("rel" => "stylesheet", "media" => "all", "href" => HTTP_LAYOUT . "{$s_general_display}/dist/<%= newController %>.css");
$a_js['<%= newController %>']  = array("src" => HTTP_LAYOUT . "{$s_general_display}/dist/<%= newController %>.js");

if( count( $aQuery)){

  $sSubAction   = array_shift( $aQuery);

  switch( $sSubAction){
      // replace:{ADD SUB}
      default:
        $a_include_pages['content'] = $s_general_display .'/view/<%= newController %>/<%= newController %>.phtml';
        break;
  }


}else{

  $a_include_pages['content'] = $s_general_display .'/view/<%= newController %>/<%= newController %>.phtml';

}
