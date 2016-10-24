<?php

  require_once( __DIR__.'/../_init.php');

  $a_css['home']     = array("rel" => "stylesheet", "media" => "all", "href" => HTTP_LAYOUT . "{$s_device}/dist/home.css");
  $a_js['home']       = array("src" => HTTP_LAYOUT . "{$s_device}/dist/home.js");

/***********************************************************
  ____  ____   ___   ____ _____ ____  _   _ ____  _____
 |  _ \|  _ \ / _ \ / ___| ____|  _ \| | | |  _ \| ____|
 | |_) | |_) | | | | |   |  _| | | | | | | | |_) |  _|
 |  __/|  _ <| |_| | |___| |___| |_| | |_| |  _ <| |___
 |_|   |_| \_\\___/ \____|_____|____/ \___/|_| \_\_____|

************************************************************/
  $a_include_pages['content'] =  $s_general_display . '/view/home/home.phtml';
