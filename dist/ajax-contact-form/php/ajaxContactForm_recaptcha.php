<?php
    
/*! 
 * ************************************************************************* 
 *  AjaxContactForm | Simple ajax contact form 
 *  Version 1.7.2 - Date: 18/02/2017 
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