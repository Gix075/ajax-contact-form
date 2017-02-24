<?php
    
/*! 
 * ************************************************************************* 
 *  AjaxContactForm | Simple ajax contact form 
 *  Version 1.8.0 - Date: 24/02/2017 
 *  HomePage: https://github.com/Gix075/ajax-contact-form 
 * ************************************************************************* 
*/ 


include 'config.php';

/* *************************************************** */
/* Google Recaptcha Validation */
/* *************************************************** */

// Validation
$reCaptchaVal = $_REQUEST['response'];
$reCaptchaOptions = "?secret=".$secretKey."&response=".$reCaptchaVal;
$url = $googleServer.$reCaptchaOptions;

$response = file_get_contents($url);
echo $response; 

?>