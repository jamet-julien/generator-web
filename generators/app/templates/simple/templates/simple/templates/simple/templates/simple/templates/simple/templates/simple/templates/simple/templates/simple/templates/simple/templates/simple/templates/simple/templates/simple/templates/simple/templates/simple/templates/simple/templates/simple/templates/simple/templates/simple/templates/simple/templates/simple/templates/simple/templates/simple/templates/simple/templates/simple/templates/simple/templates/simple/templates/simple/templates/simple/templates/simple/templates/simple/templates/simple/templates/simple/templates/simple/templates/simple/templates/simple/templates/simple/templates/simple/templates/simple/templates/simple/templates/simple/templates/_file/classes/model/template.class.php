<?php

class <%= modelParent %> extends Model{

	protected $_sPrefixSerial = '--';


	/**
	 * [_computeSerial description]
	 * @return [type] [description]
	 */
	 private function _computeSerial( $iNum = 0){

		 	$sSerial = $this->_generateRandomString( 7);
		 	$aResult = $this->count(" serial='{$sSerial}'");

			if( is_array( $aResult) && $aResult[0][0] != 0){
					if( $iNum < 5){
						$sSerial = $this->_computeSerial( ++$iNum);
					}else{
						exit('Too Serial wrong.');
					}
			}

			return $sSerial;

	 }


	 	/**
	 	 * [truncText description]
	 	 * @param  [type] $stext [description]
	 	 * @return [type]        [description]
	 	 */
	 	public function truncText( $sText, $iSize = 255){
			$sAdd     = ' ...';
			$iSize   -= strlen( $sAdd);
    	$iLength  = strlen( $sText);

	    if( $iLength <= $iSize){
				return $sText;
			}

	    if( $iSpacePosition = strrpos( $sText, ' ', $iSize - $iLength)){
				$iSize = $iSpacePosition;
			}

    	return substr_replace( $sText, $sAdd, $iSize);
	 	}

	/**
	 * [_computeSerial description]
	 * @param  integer $iNum [description]
	 * @return [type]        [description]
	 */
	 protected function _generateRandomString( $ilen = 10) {
     $sChar       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
     $iCharLn     = strlen( $sChar);
     $sResult     = '';

     for ($i = 0; $i < $ilen; $i++) {
         $sResult .= $sChar[ rand( 0, $iCharLn - 1)];
     }
     return $sResult;
 }

	/**
	 * [_treatInput traitement avant enregistrement dans la base]
	 * @param  $_aData [description]
	 * @return [type]         [description]
	 */
	protected function _treatInputInsert( $_aData){

		if( in_array( 'serial', array_keys( $_aData)  )){
			$_aData['serial'] = $this->_computeSerial();
		}

		return $_aData;
	}

	/**
	 * [_tmpPath description]
	 * @param  [type] $sValue [description]
	 * @return [type]         [description]
	 */
	protected function _tmpMedia( $sValue){
	  if( $sValue == ''){
	    return '';
	  }
	  return HTTP_MEDIA . $sValue;
	}


}
