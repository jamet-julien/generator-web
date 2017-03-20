<?php

<%- include('param', { data: data});%>

class <%= modelName %> extends <%= modelParent %>{

	protected $_sTable        = '<%= modelTable %>';
	protected $_sReferer      = '<%= modelRef %>';

	/**
	 * [_treatInput traitement avant enregistrement dans la base]
	 * @param  $_aData [description]
	 * @return [type]         [description]
	 */
	protected function _treatInputInsert( $_aData){

	<% if( bUseId ){ -%>
		$_aData['id']     = '';
	<%}
	if( modelRef != 'id'){ -%>
		$_aData['<%= modelRef %>'] = '';
	<%} -%>
		$_aData           = parent::_treatInputInsert( $_aData);

		return $_aData;

	}

	<%- include('function_parent', { parent: parent});%>

	<%- include('function_child', { child: child});%>

	<%- include('function_resume', { data: data});%>

}
