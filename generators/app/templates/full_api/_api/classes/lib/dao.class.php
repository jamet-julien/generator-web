<?php

class DAO{

	var $feed ;

	/**
	 * [__construct description]
	 * @param string $s_encode [description]
	 */
	function __construct($s_encode='')
	{
		$this->feed = new mysqli( MYSQL_HOST, MYSQL_LOGIN, MYSQL_PWD, MYSQL_DB);
		if($this->feed->connect_errno) {
    	echo "Echec lors de la connexion à MySQL : (" . $this->feed->connect_errno . ") " . $this->feed->connect_error;
		}
		$this->feed->set_charset("utf8");

	}

	/**
	 * [single_result description]
	 * @param  [type] $s_query [description]
	 * @return [type]          [description]
	 */
	function single_result($s_query)
	{
		if($res=$this->feed->query( $s_query)){
			if($row=$res->fetch_row()){
				return $row;
			}
		}else {
	    echo "Error: " . $this->feed->error."<br/>";
			return false;
		}
	}

	/**
	 * [get_insert_id description]
	 * @return [type] [description]
	 */
	function get_insert_id(){
		return $this->feed->insert_id;
	}

	/**
	 * [real_escape_string description]
	 * @param  [type] $sData [description]
	 * @return [type]        [description]
	 */
	function real_escape_string( $sData){
			return $this->feed->real_escape_string( $sData);
	}

	/**
	 * [single_query description]
	 * @param  [type] $s_query [description]
	 * @return [type]          [description]
	 */
	function single_query($s_query)
	{
		if($res=$this->feed->query( $s_query)){
			if($row=$res->fetch_assoc()){
				return $row;
			}
		}else {
	    echo "Error: " . $this->feed->error;
			return false;
		}
	}

	/**
	 * [multiple_query description]
	 * @param  [type] $s_query [description]
	 * @param  string $_field  [description]
	 * @return [type]          [description]
	 */
	function multiple_query($s_query, $_field = '')
	{
		$a_data = array();
		if($res=$this->feed->query( $s_query)){

			$res->data_seek(0);
			while ($row = $res->fetch_assoc()) {
			    $a_data[] = $row;
			}

			return $a_data;
		}else {
	    echo "Error: " . $this->feed->error."<br/>";
			return false;
		}
	}

	/**
	 * [launch_multi_query description]
	 * @param  [type] $sQuery [description]
	 * @return [type]         [description]
	 */
	function launch_multi_query( $sQuery){

		if( $this->feed->multi_query( $sQuery) === TRUE){
			return true;
		}else {
	    echo "Error: " . $this->feed->error."<br/>";
			return false;
		}

	}

	/**
	 * [multiple_query_row description]
	 * @param  [type] $s_query [description]
	 * @param  string $_field  [description]
	 * @return [type]          [description]
	 */
	function multiple_query_row($s_query, $_field = '')
	{
		$a_data = array();
		if($res=$this->feed->query( $s_query)){
			$res->data_seek(0);
			while ($row = $res->fetch_row()) {
			    $a_data[] = $row;
			}

			return $a_data;
		}else {
	    echo "Error: " . $this->feed->error."<br/>";
			return false;
		}
	}

	/**
	 * [direct_query description]
	 * @param  [type] $s_query [description]
	 * @return [type]          [description]
	 */
	function direct_query($s_query)
	{
		return $this->feed->query( $s_query) ;
	}
/* end of class */
}

?>
