<?php

class Header
{
    /**
     * [$statuscodes description]
     * @var array
     */
    protected static $statuscodes = array(
        100 => 'Continue',
        101 => 'Switching Protocols',

        200 => 'OK',
        201 => 'Created',
        202 => 'Accepted',
        203 => 'Non-Authoritative Information',
        204 => 'No Content',
        205 => 'Reset Content',
        206 => 'Partial Content',

        300 => 'Multiple Choices',
        301 => 'Moved Permanently',
        302 => 'Found',
        303 => 'See Other',
        304 => 'Not Modified',
        305 => 'Use Proxy',
        307 => 'Temporary Redirect',

        400 => 'Bad Request',
        401 => 'Unauthorized',
        402 => 'Payment Required',
        403 => 'Forbidden',
        404 => 'Not Found',
        405 => 'Method Not Allowed',
        406 => 'Not Acceptable',
        407 => 'Proxy Authentication Required',
        408 => 'Request Timeout',
        409 => 'Conflict',
        410 => 'Gone',
        411 => 'Length Required',
        412 => 'Precondition Failed',
        413 => 'Request Entity Too Large',
        414 => 'Request-URI Too Long',
        415 => 'Unsupported Media Type',
        416 => 'Requested Range Not Satisfiable',
        417 => 'Expectation Failed',

        500 => 'Internal Server Error',
        501 => 'Not Implemented',
        502 => 'Bad Gateway',
        503 => 'Service Unavailable',
        504 => 'Gateway Timeout',
        505 => 'HTTP Version Not Supported',
    );

    /**
     * [$aContentType description]
     * @var array
     */
    protected static $aContentType = array(
        'html' => 'text/html',
        'xml'  => 'text/xml',
        'svg'  => 'image/svg+xml',
        'json' => 'application/json',
        'ajax' => 'application/json',
        'text' => 'text/plain',
        'text' => 'text/plain',
        'gif'  => 'image/gif',
        'png'  => 'image/png',
        'jpeg' => 'image/jpg',
        'jpg'  => 'image/jpg',
    );

    /**
     * [$bSent description]
     * @var boolean
     */
    protected static $bSent            = false;

    /**
     * [$aBuffer description]
     * @var array
     */
    protected static $aBuffer          = array();

    /**
     * [$cookiesBuffer description]
     * @var array
     */
    protected static $cookiesBuffer   = array();

    /**
     * [$_sBody description]
     * @var string
     */
    private static $_sBody            = '';

    /**
     * [$_aFilters description]
     * @var array
     */
    private static $_aFilters         = array();

    /**
     * [__construct description]
     */
    public static function init()
    {
        self::$bSent = headers_sent();
    }

    /**
     * [_sendHeader description]
     * @return [type] [description]
     */
    private static function _sendHeader()
    {
        if (!self::$bSent & !headers_sent()) {
            foreach(self::$aBuffer as $part)
                if(strlen($part[1]) > 0)
                    header($part[0] . ': ' . $part[1]);
                else
                    header($part[0]);
            self::sendCookies();

            return true;
        }
        self::$bSent = true;

        return false;
    }

    /**
     * [_add description]
     * @param string $sType  [description]
     * @param string $sValue [description]
     */
    private static function _add($sType = '', $sValue = '')
    {
        self::$bSent = headers_sent();

        if (!self::$bSent) {
            self::$aBuffer[] = array( ucfirst( $sType), $sValue);
        }
    }

    /**
     * [sendCookies description]
     * @return [type] [description]
     */
    public static function sendCookies()
    {
        $return = true;
        foreach( self::$cookiesBuffer as $cookie)
            $return &= setcookie( $cookie['name'], $cookie['value'], $cookie['expire']);

        return $return;
    }

    /**
     * [addCookie description]
     * @param string $sName   [description]
     * @param string $sValue  [description]
     * @param string $sExpire [description]
     */
    public static function addCookie($sName = '', $sValue = '', $sExpire = '')
    {
        self::$cookiesBuffer[] = array(
            'name'   => $sName,
            'value'  => $sValue,
            'expire' => $sExpire
        );

    }

    /**
     * [setLocation description]
     * @param string $sLocation [description]
     */
    public static function setLocation($sLocation = '')
    {
        self::_add('Location', $sLocation);

    }

    /**
     * [setContentType description]
     * @param string $sMedia   [description]
     * @param string $sCharset [description]
     */
    public static function setContentType($sMedia = '', $sCharset = 'UTF-8')
    {
        if ( !array_key_exists( $sMedia, self::$aContentType)) {
            $sMedia = 'text/plain';
        } else {
            $sMedia = self::$aContentType[$sMedia];
        }

        self::_add('Content-Type', $sMedia . (($sCharset=='') ? '': '; charset=' . $sCharset));

    }

    /**
     * [setContentDisposition description]
     * @param string $disposition [description]
     * @param string $filename    [description]
     */
    public static function setContentDisposition($sDisposition = 'attachment', $sFilename ="download")
    {
        self::_add('Content-Disposition', $sDisposition . '; filename="' . $sFilename . '"');

    }

    /**
     * [setStatus description]
     * @param integer $iStatuscode [description]
     */
    public static function setStatus($iStatuscode = 200, $sStatus = '')
    {
        $sStatus = ( $sStatus === '')? self::$statuscodes[$iStatuscode] : $sStatus;
        self::_add($_SERVER["SERVER_PROTOCOL"].' ' . $iStatuscode . ' ' . $sStatus);

    }

    /**
     * [setContentTransferEncoding description]
     * @param string $sType [description]
     */
    public static function setContentTransferEncoding($sType = '')
    {
        self::_add('Content-Transfer-Encoding', $sType);

    }

    /**
     * [setLastModified description]
     * @param string $sDate [description]
     */
    public static function setLastModified($sDate = '')
    {
        self::_add('Last-Modified', $sDate);

    }

    /**
     * [setEtag description]
     * @param string $sEtag [description]
     */
    public static function setEtag($sEtag = '')
    {
        self::_add('Etag', $sEtag);

    }

    /**
     * [setExpires description]
     * @param string $sDate [description]
     */
    public static function setExpires($sDate = '0')
    {
        self::_add('Expires', $sDate);

    }

    /**
     * [setCacheControl description]
     * @param string $sCacheControl [description]
     */
    public static function setCacheControl($sCacheControl = '')
    {
        self::_add('Cache-Control', $sCacheControl);

    }

    /**
     * [setCacheControl description]
     * @param string $sCacheControl [description]
     */
    public static function setAccessControlAllowOrigin( $sDomainControl = '*')
    {
        self::_add('Access-Control-Allow-Origin', $sDomainControl);

    }

    /**
     * [execute description]
     * @return [type] [description]
     */
    public static function exec()
    {
        self::_sendHeader();
    }
}
