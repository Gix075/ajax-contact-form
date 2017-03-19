<?php

/*! 
 * ************************************************************************* 
 *  AjaxContactForm | Simple ajax contact form 
 *  Version 1.9.0 - Date: 19/03/2017 
 *  HomePage: https://github.com/Gix075/ajax-contact-form 
 * ************************************************************************* 
*/ 


/* ======================================================================== 

    CONFIGURATION 
    See the GitHub Wiki to learn more about configuration
    https://github.com/Gix075/ajax-contact-form/wiki/Configuration 

 ========================================================================= */

/* Mail Configuration */
/* ******************************* */

$subject = "Mail from your site: "; // This is the prefix of the message subject
$to = ""; // Your email inbox
$cc = ""; // Add one or more email addresses (comma separated) as CC.
$bcc = ""; // Add one or more email addresses (comma separated) as BCC.
$from_email = ""; // Your sender email address
$from_name = ""; // Your sender name

/* 
    -------------------------------------------------------------------------------------------
    Note:
        "$from_email" and "$from_name" are optional, but
        without this parameters your message can be handled 
        as spam from your client.
        Use the real email address that will used to send the message from your server!
        Remember that the email message will have the user email address as reply address.
    -------------------------------------------------------------------------------------------    
*/

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


/* SMTP Configuration (Optional) */
/* ******************************* */

// The followinf options will be used to send mail message via SMTP
// To use this feature you need a valid SMTP server url with valid username and passwords

$smtp = false; // enable/disable smtp support
$smtp_auth = true; // enable/disable smtp authentication
$smtp_host = ""; // your smtp server url (example: mail.yourdomain.com)
$smtp_port = 25; // Your smtp port
$smtp_username = ""; // smtp username
$smtp_password = ""; // smtp password
?>