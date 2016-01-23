<?php
    
//{BANNER}

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