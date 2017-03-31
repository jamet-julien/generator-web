<?php

$aFolderClass = array( 'lib/', 'model/sub/', 'model/', '' );


//filtre de traitement text
define( '_FILTER_STRING' , array(
    'filter' => FILTER_SANITIZE_STRING,
    'flags'  => FILTER_FLAG_NO_ENCODE_QUOTES
));
/**
 * [__autoload description]
 * @param  [type] $sClassName [description]
 * @return [type]             [description]
 */
function __autoload( $sClassName){
  global $aFolderClass;
	$sRootPath    = dirname( __FILE__ );
	$sFileName    = strtolower( $sClassName).'.class.php';

    foreach( $aFolderClass as $sPath){

    	$sPathFile = $sRootPath .'/'. $sPath . $sFileName;
    	if( is_readable( $sPathFile)){
    		require_once( $sPathFile);
    		return true;
    	}

    }

    header('Content-Type: application/json');
    	echo json_encode( (object) array(
              													'code'    => 0,
              													'message' => 'Method doesn\'t exist',
                                        'error'   => array('can\'t load'),
              												));
    exit();

}




/**
 * [isConnected description]
 * @return boolean [description]
 */

function isConnected(){
  if(
    isset($_SESSION['token']) && trim( $_SESSION['token']) != '' &&
    isset($_SERVER['HTTP_TOKEN']) && trim( $_SERVER['HTTP_TOKEN']) != '' &&
    $_SESSION['token'] == $_SERVER['HTTP_TOKEN']
  ){
    return true;
  }

  header('Content-Type: application/json');
    echo json_encode( (object) array(
                                      'code'    => 0,
                                      'message' => 'Need connection',
                                      'error'   => array('need_connection'),
                                    ));
  exit();

}


/**
 * [base64ToImg description]
 * @param  [type]  $base64_string [description]
 * @param  [type]  $output_file   [description]
 * @return {[type]                [description]
 */
function base64ToImg( $base64String, $outputFile) {
    $sFilename = '';
   $splited = explode(',', substr( $base64String , 5) , 2);
   $mime    = $splited[0];
   $data    = $splited[1];

   $mimeSplitWithoutBase64 = explode( ';', $mime,2);
   $mimeSplit              = explode( '/', $mimeSplitWithoutBase64[0],2);

   if( count( $mimeSplit) == 2){

      $extension = $mimeSplit[1];
      if($extension=='jpeg') $extension = 'jpg';

      $sFilename =$outputFile.'.'.$extension;
  }

  if( $sFilename != ''){
    file_put_contents( SERVER_TMP . $sFilename, base64_decode( $data) );
  }

  return $sFilename;
}

/**
 * [generateRandomString description]
 * @param  integer $ilen [description]
 * @return [type]        [description]
 */
function generateRandomString( $ilen = 10) {
  $sChar       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $iCharLn     = strlen( $sChar);
  $sResult     = '';

  for ($i = 0; $i < $ilen; $i++) {
      $sResult .= $sChar[ rand( 0, $iCharLn - 1)];
  }
  return $sResult;
}

/**
 * [remove_accents description]
 * @param  [type]  $str     [description]
 * @param  string  $charset [description]
 * @return {[type]          [description]
 */
function remove_accents( $str, $charset='utf-8')
{
    $str = htmlentities($str, ENT_NOQUOTES, $charset);

    $str = preg_replace('#&([A-za-z])(?:acute|cedil|caron|circ|grave|orn|ring|slash|th|tilde|uml);#', '\1', $str);
    $str = preg_replace('#&([A-za-z]{2})(?:lig);#', '\1', $str); // pour les ligatures e.g. '&oelig;'
    $str = preg_replace('#&[^;]+;#', '', $str); // supprime les autres caractères

    return $str;
}

/**
 * [toSlug description]
 * @param  [type] $sString    [description]
 * @param  [type] $sSeparator [description]
 * @return [type]             [description]
 */
function toSlug( $sString){

    $aReplace =
     [
        '/\s+/'          => "-",
        '/[^a-z0-9-]/i'  => '',
        '/\-{2,}/'       => '-',
        '/^-+|-+$/'      => '',
     ];

    return strtolower(
                      preg_replace(
                        array_keys( $aReplace),
                        array_values( $aReplace),
                        remove_accents( $sString)
                      )
                    );
}

/**
 * [encrypt description]
 * @param  [type] $sStr [description]
 * @return [type]       [description]
 */
function encrypt( $sStr){
  return base64_encode( mcrypt_encrypt( MCRYPT_RIJNDAEL_256, SECRET_KEY, $sStr, MCRYPT_MODE_CBC, base64_decode( SECRET_VECTEUR)));

}

/**
 * [decrypt description]
 * @param  [type] $sStr [description]
 * @return [type]       [description]
 */
function decrypt( $sStr){
  return trim( mcrypt_decrypt( MCRYPT_RIJNDAEL_256, SECRET_KEY, base64_decode( $sStr), MCRYPT_MODE_CBC, base64_decode( SECRET_VECTEUR)));
}


/**
 * [isEmpty description]
 * @param  [type]  $sValue [description]
 * @return boolean         [description]
 */
function isEmpty( $sValue){
  return( $sValue === '' || $sValue === 0 || $sValue === false);
}

/**
 * [treatPost description]
 * @param  [type] $aInfo   [description]
 * @param  [type] $aFilter [description]
 * @return [type]          [description]
 */
function treatPost( $aInfo, $aFilter){
  $aInfoVerif  = filter_var_array( $aInfo, $aFilter, false);
  $aInfoResult = array_merge( $aInfo, $aInfoVerif);
  return array(
    'error' => array_keys( array_filter( $aInfo, "isEmpty")),
    'data'  => $aInfoResult,
  );
}
