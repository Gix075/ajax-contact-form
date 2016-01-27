<?php

/*! 
 * ************************************************************************* 
 *  AjaxContactForm | Simple ajax contact form 
 *  Version 1.5.0 - Date: 27/01/2016 
 *  HomePage: https://github.com/Gix075/ajax-contact-form 
 * ************************************************************************* 
*/ 


/* =============================================================== */
/* CONFIGURATION */
/* =============================================================== */

/* Mail Configuration */
/* ******************************* */

$subject = "Mail from your site: "; // This is the prefix of the message subject
$to = ""; // Your email inbox


/* Message Configuration */
/* ******************************* */

$messageTitle ="New Message"; // A title for the message (will be displayed inside the message)
$messageSubTitle = "This is a message from your site"; // A subtitle for the message (will be displayed inside the message)
$messageImage = ""; //Write here a valid url (eg: http://yoursite.com/images/mail-logo.jpg) to show an image inside the message. If you don't want any image just leave this option empty;


/* Message CSS Style */
/* ******************************* */

$text_font_family = "Helvetica,Arial,sans-serif"; // common font family
$text_size = "18px"; // common text font size 
$text_color = "#555"; // common text color 
$title_size = "24px"; // title font size 
$title_color = "#555"; // title color
$subtitle_size = "20px"; // subtitle font size 
$subtitle_color = "#555"; // subtitle color


/* Google ReCaptcha */
/* ******************************* */
$secretKey = "yourlongsecretkeyhere";
$googleServer = "https://www.google.com/recaptcha/api/siteverify";

?>