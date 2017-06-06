<?php


//[ Ajout : 2015-06-30 09:23:11 ( julien Jamet ) ]
class Model{

	private $_sOperateur          = '<>!=';

	protected $_sSiteName         = "";
	protected $_sTable            = "" ;
	protected $_sReferer          = "id" ;

	protected $_sBaseName         = "";

	protected $_oDAO            = null;

	protected $_aDefaultCreate    = array();
	protected $_aData             = array();
	protected $_aUpdate           = array();

	protected $_bAutoExec         = true;
	protected $_aQueueQuery       = array();

	protected $_bPrefixUsed       = false;

	protected $_aOptionPreview     = array();/*array(
														'use'        => false,
														'champ'      => 'mode',
														'previewOn' => 'preview'
			 									);*/

	static private $_aCacheObject = array();

	/**
	 * [__construct description]
	 * @param [type] $sId [description]
	 */
	public function __construct( $mRefererValue = null, $sRefererSecondaire = ''){

		global $oDAO;

		$this->_oDAO = $oDAO;

		$aNameInfo = explode( '_', strtolower( $this->_sTable));

		if( $this->_bPrefixUsed){
			$this->_sSiteName = ($this->_sSiteName == '')? current( $aNameInfo ).'_' : $this->_sSiteName;
			$this->_sBaseName = ($this->_sBaseName == '')? end( $aNameInfo).'_' : $this->_sBaseName;
		}

		if( !is_null( $mRefererValue) and !is_array( $mRefererValue)){
			$this->_read( $mRefererValue, $sRefererSecondaire);
		}

		if( is_array( $mRefererValue)){
			$this->_create( $mRefererValue);
		}

		if( is_bool( $mRefererValue) === true && $mRefererValue){
				$this->_bAutoExec = false;
		}


	}

	/**
	 * [_showQuery description]
	 * @param  [type] $sQuery [description]
	 * @return [type]         [description]
	 */
	private function _showQuery( $sQuery, $sType = "*"){
		return true;

		$sType      = strtolower( $sType);
		$sTypeQuery = strtolower();

		if( $sTypeQuery == $sType){
			echo '<div style="border:1px solid green;background-color:rgb(147, 211, 147) !important;color:green;font-family:sans-serif;font-size:12px;padding:5px">';
				echo "<p style=\"color : green !important\">{$sQuery}</p>";
			echo '</div>';
		};
	}

	 /**
     * [create description]
     * @param  [type] $sTable
     * @param  array  $aData
     * @return [type]
     */
    private function _create( array $aData ){

		$aData   = array_merge( $this->_aDefaultCreate, $aData);
		$aData   = $this->_treatInputInsert( $aData);

			if( count( $aData)){

					$sValues = $this->_getFormatValues( $aData, array('SET ', ', ') );
					$sQuery     = "INSERT INTO {$this->_sTable} {$sValues}";

	        $this->_showQuery( $sQuery, 'insert');

					if( $this->_bAutoExec){

		        $this->_oDAO->direct_query($sQuery);

		        $iLastId     = $this->_oDAO->get_insert_id();

						$this->setData( $aData);

		        $this->_setValue( 'id',$iLastId);

		        $this->_treatAfterInsert();

					}else{

						$this->_aQueueQuery[] = $sQuery;

					}

			}

    }

    /**
     * [_getPreview description]
     * @return [type] [description]
     */
    private function _getCondOption(){
        $sReturn = '';
        $aReturn = array();

        // mode preview or not
		if( isset(  $this->_aOptionPreview['use']) AND count(  $this->_aOptionPreview) == 3){

			$sReturn  = " `{$this->_oDAO->real_escape_string( $this->_aOptionPreview['champ'])}` ";
			$sReturn .= ( !$this->_aOptionPreview['use'])? "!=" : "=";
			$sReturn .= " '{$this->_oDAO->real_escape_string( $this->_aOptionPreview['previewOn'])}'";

			$aReturn[] = $sReturn;

		}

        // localisation des elements en base
        if(  isset( $this->_aOptionLang) AND
             isset( $this->_aOptionLang['value']) AND
             isset( $this->_aOptionLang['champ']) AND
             $this->_aOptionLang['value'] != '' AND
             $this->_aOptionLang['champ'] != ''
          ){

            $sReturn  = " `{$this->_oDAO->real_escape_string( $this->_aOptionLang['champ'])}` ";
            $sReturn .= "=";
            $sReturn .= " '{$this->_oDAO->real_escape_string( $this->_aOptionLang['value'])}'";

            $aReturn[] = $sReturn;

        }

		return implode( ' AND ', $aReturn);

    }

    /**
     * [update description]
     * @param  [type] $sTable
     * @param  array  $aData
     * @param  array  $aWhere
     * @return [type]
     */
    private function _update(){

		$aKey   = array_keys( $this->_aUpdate );
		$aValue = array_values( $this->_aUpdate);
		$aData  = array_combine( $aKey, $aValue);

		$aWhere               = array();
		$sKeyReferer          = $this->_sBaseName.$this->_sReferer;
		$aWhere[$sKeyReferer] = $this->_getValue( $this->_sReferer);

        $sWhere  = $this->_getFormatValues( $aWhere );

        $aData   = $this->_treatInputUpdate( $aData);

        $sValues = $this->_getFormatValues( $aData, array('SET ', ', ') );

        $sCondOption = ( ($sValue = $this->_getCondOption()) != '')? "AND {$sValue}" : "";

        $sQuery     = "UPDATE {$this->_sTable} {$sValues} {$sWhere} {$sCondOption}";

			if( $this->_bAutoExec){
	        $this->_showQuery( $sQuery, 'update');
	        return $this->_oDAO->direct_query($sQuery);
			}else{
					$this->_aQueueQuery[] = $sQuery;
			}
    }

     /**
     * [_buildOperateur description]
     * @param  [type] $sValue [description]
     * @return [type]         [description]
     */
    private function _buildOperateur( $sValue = '', $sOperateur = ''){

    	if( $sValue != ''){
        	$sFirstLetter = $sValue[0];

	        if( strstr( $this->_sOperateur, $sFirstLetter)){
	            $sOperateur .= $sFirstLetter;
	            $sNewValue = substr( $sValue, 1);
	            $sOperateur = $this->_buildOperateur( $sNewValue, $sOperateur);
	        }

    	}

        return $sOperateur;
    }

     /**
     * [get getFormatValues description]
     * @param  [type] $aWhere
     * @return [type]
     */
    private function _getFormatValues( $aData, $sParams = array('WHERE ', ' AND ')){
        $sValue = NULL;
        if (! is_null( $aData ) ) {
            $aStr   = array();

            foreach ($aData as $key => $value) {

                $sOperateur = '=';

                $sNewValue = $this->_oDAO->real_escape_string( $value);
								$sNewValue = ( is_numeric( $sNewValue) || $sNewValue == "NULL")? "$sNewValue" : "'$sNewValue'";
                $aStr[]    = "`{$key}` $sOperateur $sNewValue";
            }

            $sValue = $sParams[0] . implode( $sParams[1], $aStr);
        }
        return $sValue;
    }

    /**
	 * [_read description]
	 * @param  [type] $sId [description]
	 * @return [type]      [description]
	 */
	private function _read( $sId, $sRefererSecondaire = ''){

		$sReferer       = ($sRefererSecondaire == '')? $this->_sBaseName.$this->_sReferer : $sRefererSecondaire;

		$sCondOption = ( ($sValue = $this->_getCondOption()) != '')? "AND {$sValue}" : "";

		$sQuery       	= "SELECT * FROM {$this->_sTable} WHERE `{$sReferer}` = '{$sId}' {$sCondOption} LIMIT 1";

		if(($mResult = $this->_getCache( $sQuery)) === false){

			$this->_showQuery( $sQuery, 'select');
			$aModelSQL  	= $this->_oDAO->single_query($sQuery);
		}else{
			$aModelSQL  	= $mResult;
		}

		if( is_array( $aModelSQL)){
			$this->setData( $aModelSQL);
		}
	}

	/**
	 * [_getCache description]
	 * @param  string $sQuery [description]
	 * @return [type]         [description]
	 */
	protected function _getCache( $sQuery = ""){

		$sMD5Query = md5( $sQuery);

		if( array_key_exists($sMD5Query, self::$_aCacheObject)){
			return self::$_aCacheObject[$sMD5Query];
		}

		return false;
	}

	/**
	 * [_getCache description]
	 * @param  string $sQuery [description]
	 * @return [type]         [description]
	 */
	protected function _setCache( $sQuery = "", $mResult = null){

		$sMD5Query = md5( $sQuery);
		self::$_aCacheObject[$sMD5Query] = $mResult;
		return $this;

	}

	/**
	 * @brief [brief description]
	 * @details [long description]
	 *
	 * @param  [description]
	 * @return [description]
	 */
	protected function _setCacheCompute( $aInfo = array()){

		$sReferer       = $this->_sReferer;

        if( count( $aInfo) > 0){

            $sId            = $aInfo[$sReferer];
            $sQuery         = "SELECT * FROM {$this->_sTable} WHERE {$sReferer} = '{$sId}' LIMIT 1";
            $this->_setCache( $sQuery, $aInfo);

            $sReferer       = 'id';
            $sId            = ( array_key_exists('id', $aInfo))? $aInfo[$sReferer] : current($aInfo);
            $sQuery         = "SELECT * FROM {$this->_sTable} WHERE {$sReferer} = '{$sId}' LIMIT 1";
            $this->_setCache( $sQuery, $aInfo);

        }

		return true;
	}

    /**
     * [_treatInput traitement avant enregistrement dans la base]
     * @param  $_aData [description]
     * @return [type]         [description]
     */
    protected function _treatInputInsert( $_aData){
    	return $_aData;
    }

    /**
     * [_treatAfterInsert traitement avant enregistrement dans la base]
     * @param  $_aData [description]
     * @return [type]         [description]
     */
    protected function _treatAfterInsert(){
    	return true;
    }

     /**
     * [_treatInput traitement avant enregistrement dans la base]
     * @param  $_aData [description]
     * @return [type]         [description]
     */
    protected function _treatInputUpdate( $_aData){
    	return $_aData;
    }

     /**
     * [_treatInput traitement avant enregistrement dans la base]
     * @param  $_aData [description]
     * @return [type]         [description]
     */
    protected function _treatInputDelete( $_aData){
    	return $_aData;
    }

	/**
	 * [get description]
	 * @param  [type] $sValue [description]
	 * @return [type]         [description]
	 */
	protected function _getValue( $sValue){
		if(array_key_exists( $sValue, $this->_aData) ){

			return $this->_aData[$sValue];

		}else if( array_key_exists( strtoupper( $sValue), $this->_aData)){

			$sUpperValue = strtoupper( $sValue);
			return $this->_aData[$sUpperValue];

		}else{
			return NULL;
		}
	}

	/**
	 * [get description]
	 * @param  [type] $sValue [description]
	 * @return [type]         [description]
	 */
	protected function _setValue( $sKey, $sValue){

		if( array_key_exists( $sKey, $this->_aData) ){

			$this->_aData[$sKey]   = $sValue;
			$this->_aUpdate[$sKey] = $sValue;

		}else if( array_key_exists( strtoupper( $sKey), $this->_aData)){

			$sUpperValue = strtoupper( $sValue);
			$sKeyUpdate  = strtoupper( $sKey);
			$this->_aData[$sKeyUpdate]   = $sValue;
			$this->_aUpdate[$sKeyUpdate] = $sValue;

		}else{
			return NULL;
		}
	}

	/**
	 * [_tmpPath description]
	 * @param  [type] $sValue [description]
	 * @return [type]         [description]
	 */
	protected function _tmpPath( $sValue){
		if( $sValue == ''){
			return '';
		}
		return HTTP_TMP . $sValue;
	}

	/**
	 * [_upgrade description]
	 * @param  [type] $oModel [description]
	 * @return [type]         [description]
	 */
	protected function _upgrade( $oModel){
		return $oModel;
	}

	/**
	 * [_findFileOnTiny description]
	 * @param  string $sSource [description]
	 * @return [type]          [description]
	 */
	protected function _findFileOnTiny( $sSource = ''){
		$aFile = array('TINI');

		$sPattern = "#/(\w*\.(?:jpg|jpeg|png|pdf|zip))#";
		preg_match_all($sPattern, $sSource, $aResult);

		if( count($aResult) > 1){
			$aFile =$aResult[1];
		}

		return $aFile;
	}

	/*

	 */
	protected function _getMysql(){
		return $this->_oDAO;
	}

	/**
	 * [get description]
	 * @param  [type] $sValue [description]
	 * @return [type]         [description]
	 */
	public function getValue( $sValue = ''){
		return $this->_getValue( $sValue);
	}

 /**
   * [update description]
   * @param  [type] $sTable
   * @param  array  $aData
   * @param  array  $aWhere
   * @return [type]
   */
  public function delete(){

	$aWhere               = array();
	$sKeyReferer          = $this->_sBaseName.$this->_sReferer;
	$aWhere[$sKeyReferer] = $this->_getValue( $this->_sReferer);

      $sWhere  = $this->_getFormatValues( $aWhere );
      $aData   = $this->_treatInputDelete( $this->_aData);

      $sQuery  = "DELETE FROM {$this->_sTable} {$sWhere}";

			if( $this->_bAutoExec){

	      $this->_showQuery( $sQuery, 'delete');
	      $this->_oDAO->direct_query($sQuery);
			}else{

				$this->_aQueueQuery[] = $sQuery;

			}
      return true;
  }

	/**
	 * [queueQuery description]
	 * @return [type] [description]
	 */
	public function insertMultiple( $aData = array()){

		if( count( $aData) && !$this->_bAutoExec){
			$this->_create( $aData);
		}

		return $this;
	}

	/**
	 * [queueQuery description]
	 * @return [type] [description]
	 */
	public function launchQueueQuery(){

		if( count( $this->_aQueueQuery)){

			$sBigQuery = implode( ';', $this->_aQueueQuery);
			$this->_oDAO->launch_multi_query(	$sBigQuery);

		}

		$this->_aQueueQuery = array();

		return false;

	}

	/**
	 * [all description]
	 * @param  string $sOption [description]
	 * @return [type]          [description]
	 */
	public function all( $sOption = '1'){
		$aModel = array();

		$sClassName     = get_class( $this);
		$sReferer       = $this->_sBaseName.$this->_sReferer;

		$sCondOption = ( ($sValue = $this->_getCondOption()) != '')? "{$sValue} AND" : "";

		$sOption = "{$sCondOption} {$sOption}";
    $sQuery  = "SELECT * FROM {$this->_sTable} WHERE {$sOption}";

		if(($mResult = $this->_getCache( $sQuery)) === false){

			$this->_showQuery( $sQuery, 'all');
			$aModelSQL  	= $this->_oDAO->multiple_query($sQuery);
			$this->_setCache( $sQuery, $aModelSQL);

		}else{
			$aModelSQL  	= $mResult;
		}

		foreach( $aModelSQL as $aInfoModel){


				$oModel   = new $sClassName();

				$oModel->setData( $aInfoModel);

				$oModel   = $this->_upgrade( $oModel);

				$aModel[] = $oModel;


		}

		return $aModel;
	}

	public function allData( $sField,  $sOption = '1'){
		$aData = array();

		$sClassName     = get_class( $this);
		$sReferer       = $this->_sBaseName.$this->_sReferer;

		$sCondOption = ( ($sValue = $this->_getCondOption()) != '')? "{$sValue} AND" : "";

		$sOption = "{$sCondOption} {$sOption}";
		$sQuery  = "SELECT {$sField} FROM {$this->_sTable} WHERE {$sOption}";

		if(($mResult = $this->_getCache( $sQuery)) === false){

			$this->_showQuery( $sQuery, 'allData');
			$aModelSQL  = $this->_oDAO->multiple_query_row($sQuery);
			$this->_setCache( $sQuery, $aModelSQL);

		}else{
			$aModelSQL  	= $mResult;
		}

		if( is_array( $aModelSQL) && count( $aModelSQL)){
			$aData  = call_user_func_array( "array_merge", $aModelSQL);
		}

		return $aData;
	}

	/**
	 * [all description]
	 * @param  string $sOption [description]
	 * @return [type]          [description]
	 */
	public function custom( $sQueryUser = "SELECT t.* FROM [:table:] t WHERE 1"){
		$aModel = array();

		$sClassName     = get_class( $this);

		$sQuery       	= str_replace('[:table:]', $this->_sTable, $sQueryUser);

		if(($mResult = $this->_getCache( $sQuery)) === false){
			$this->_showQuery( $sQuery, 'custom');

			$aModelSQL  	= $this->_oDAO->multiple_query($sQuery);

			$this->_setCache( $sQuery, $aModelSQL);
		}else{
			$aModelSQL  	= $mResult;
		}

		if( !is_array($aModelSQL)){
			return array();
		}

		foreach( $aModelSQL as $aInfoModel){
			$oModel = new $sClassName();

			$oModel->setData( $aInfoModel);
			$oModel = $this->_upgrade( $oModel);

			$aModel[] = $oModel;
		}
		return $aModel;
	}

	/**
	 * [cache description]
	 * @return [type] [description]
	 */
	public function putOnCache(){
		$this->all();
		return $this;
	}

	/**
	 * [getType description]
	 * @return [type] [description]
	 */
	public function getType(){
		return get_class($this);
	}

	/**
	 * [getReferer description]
	 * @return [type] [description]
	 */
	public function getReferer(){
		return $this->_sReferer;
	}

	/**
	 * [isExist description]
	 * @return boolean [description]
	 */
	public function isExist(){
		return (count( $this->_aData) > 0);
	}

	/**
	 * [save description]
	 * @return [type] [description]
	 */
	public function save(){
		$this->_update();
		return $this;
	}


	/**
	 * [_setData description]
	 * @param array $aInfo [description]
	 */
	public function setData( array $aInfo){

		$this->_setCacheCompute( $aInfo);

		foreach( $aInfo as $sKey => $sValue){

			$sNewKey = str_replace( $this->_sBaseName, '', $sKey);
			$this->_aData[$sNewKey] = $sValue;

			if( array_key_exists( $sKey, $this->_aData) ){
				$this->_aUpdate[ $sKey ] = $sValue;
			}

		}

		return $this;
	}

	/**
	 * [getData description]
	 * @param array $aInfo [description]
	 */
	public function getData( $sTring = ''){
		if( $sTring != ''){
			return ( array_key_exists($sTring, $this->_aData))? $this->_aData[$sTring] : '';
		}
		return $this->_aData;
	}

	/**
	 * [all description]
	 * @param  string $sOption [description]
	 * @return [type]          [description]
	 */
	public function distinct( $sSelect = "*", $sOption = '1'){
		$aModel    = array();

		$sQuery    = "SELECT DISTINCT {$sSelect} FROM {$this->_sTable} WHERE {$sOption}";

		$this->_showQuery( $sQuery, 'distinct');
		$aModelSQL = $this->_oDAO->multiple_query($sQuery);

		return $aModelSQL;
	}

	/**
	 * [count description]
	 * @param  string $sOption [description]
	 * @return [type]          [description]
	 */
	public function count( $sOption = '1'){

    	$sQuery       	= "SELECT COUNT(*) FROM {$this->_sTable} WHERE {$sOption}";
    	$iCountResult   = $this->_oDAO->single_result( $sQuery);

    	return $iCountResult;

	}

	/**
	 * [count description]
	 * @param  string $sOption [description]
	 * @return [type]          [description]
	 */
	public function one( $sOption = '1'){

    	$sQuery       	= $sOption;
    	$iCountResult   = $this->_oDAO->single_result( $sQuery);

    	return $iCountResult;

	}

	/**
	 * [sum description]
	 * @param  string $sOption [description]
	 * @return [type]          [description]
	 */
	public function sum( $sField , $sOption = '1'){

    	$sQuery       	= "SELECT SUM({$sField}) FROM {$this->_sTable} WHERE {$sOption}";
    	$iCountResult   = $this->_oDAO->single_result( $sQuery);

    	return $iCountResult;

	}

	/**
     * [export description]
     * @param  array  $aOption [description]
     * @return [type]          [description]
     */
    public function export( $aArray = array()){
        if( empty( $aArray)){
            $oData  = $this->_aData;
        }else{
            $oData = (object) $aArray;
        }
        return $oData;
    }

    /**
     * [exportSmall description]
     * @return [type] [description]
     */
    public function exportSmall(){
        $oDatas = $this->_oData;
        if( is_null($oDatas)){
        	return (object) array();
        }
        return $oDatas;
    }

    /**
     * [allFile description]
     * @param  array  $aChamps [description]
     * @return [type]          [description]
     */
	public function allFile( $aChamps = array()){

		$aElements = $this->all();
		$aFile     = array();

		foreach( $aElements as $oElements){
			foreach( $aChamps as $sChamps){
				$sValue = $oElements->$sChamps;

				if( strpos( $sValue, ' ') !== false){
					$aFile = array_merge($aFile, $this->_findFileOnTiny( $sValue));
				}elseif( strpos( $sValue, '.') !== false){
					$aFile[] = $sValue;
				}
			}
		}

		return $aFile;
	}

	/**
	 * [__toString description]
	 * @return string [description]
	 */
	public function __toString(){

		$sResult = '';

		$sClassName = get_class($this);
		$oClass     = new ReflectionClass( $sClassName);


		$sResult .= '<div style="border:1px solid green;background-color:rgb(147, 211, 147);color:green;font-family:sans-serif;font-size:12px;padding:5px">';
		$sResult .= '<h2 style="text-transform:uppercase">Informations class "'.get_class($this).'"</h2>';

		$aData   = array_keys( $this->_aData);

		$sResult .= '<div style="display:inline-block; vertical-align:top;margin-right:50px">';
		$sResult .= '<h3 style="text-decoration:underline">Attributs <em>directs SQL</em></h3>';
		foreach( $aData as $sValue){
			$sResult .= ' - <span style="font-size:14px">'.$sValue.'</span><br/>';

		}
		$sResult .= "</div>";

		$aResultInform  = array();
		$aMethods       = $oClass->getMethods();

		$sResult .= '<div style="display:inline-block; vertical-align:top">';
		$sResult .= '<h3 style="text-decoration:underline">Function <em>calculate</em></h3>';

		foreach( $aMethods as $oMethod){
			$sValue = $oMethod->name;

			if( substr( $sValue, 0, 1) != '_'){
				$sType = "";

				$sParent = $oMethod->class;
				$sOption = ( $sParent != $sClassName)? '<span style="color:rgb(128, 97, 0)">( function dans Class <strong>'.$sParent.'</strong>)</span>' : '';
				$sType   = "<span style=\"color:rgb(128, 97, 0)\">return <strong>{$sType}</strong></span>";
				$sResult .= ' - <span style="font-size:14px">'.$sValue.'</span> '.$sOption.'<br/>';

			}
		}

		$sResult .= "</div>";

		$sResult .= '</div>';

	}

	/**
	 * [__isset description]
	 * @param  [type]  $sValue [description]
	 * @return boolean         [description]
	 */
	public function __isset( $sValue){
		return ( array_key_exists( $sValue, $this->_aData) || method_exists( $this, $sValue));
	}

	/**
	 * [__get description]
	 * @param  [type] $sValue [description]
	 * @return [type]         [description]
	 */
	public function __get( $sValue){
		if( method_exists( $this, $sValue)){
			$mValue = $this->$sValue();
		}else{
			$mValue = $this->_getValue( $sValue);
		}
		return ( getType( $mValue) == 'string')? stripslashes( $mValue) : $mValue;
	}

	/**
	 * [__get description]
	 * @param  [type] $sValue [description]
	 * @return [type]         [description]
	 */
	public function __set( $sKey, $sValue){
		$this->_setValue( $sKey, $sValue);
	}
}
