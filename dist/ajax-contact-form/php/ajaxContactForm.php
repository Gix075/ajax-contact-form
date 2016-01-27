<?php

/*! 
 * ************************************************************************* 
 *  AjaxContactForm | Simple ajax contact form 
 *  Version 1.5.0 - Date: 27/01/2016 
 *  HomePage: https://github.com/Gix075/ajax-contact-form 
 * ************************************************************************* 
*/ 


require_once("config.php");
require_once("phpmailer/class.phpmailer.php");
$mail = new PHPMailer();

$attachmentsFilesDir = dirname(__FILE__).'/attachments/files';

/* ************************************** */
/* Get Input Values */
/* ************************************** */

$name = false;
$surname = false;
$email = false;
$msg = false;
$attachments = false;

// Name
if($_REQUEST['acf_name']) {
    $name = trim(stripslashes ($_REQUEST['acf_name']));
}

// Surname
if($_REQUEST['acf_name'] && $_REQUEST['acf_surname']) {
    $surname = trim(stripslashes ($_REQUEST['acf_surname']));
    $name = $name." ".$surname;
}

// Email
if($_REQUEST['acf_email']) {
    $email = trim(stripslashes ($_REQUEST['acf_email']));
}

// Mail Subject 
if($_REQUEST['acf_subject']) {
    $subject = $subject.trim(stripslashes ($_REQUEST['acf_subject']));
}

// Mail Message 
if($_REQUEST['acf_email']) {
    $msg = trim(stripslashes ($_REQUEST['acf_message']));
}

// Attachments
if($_REQUEST['acf_attachments']) {
	$attachments = true;
	$attachmentsFiles = $_REQUEST['acf_attachments'];
	$attachmentsFiles = explode(',', $attachmentsFiles);
}

/* Text Message */
/* ====================== */
$message .= "<div style=\"font-family: ".$text_font_family."; font-size:".$text_size."; color:".$text_color.";\">";
if ($messageImage != "") {
    $message .= "<img src=\"".$messageImage."\" alt=\"contact form image\"";
}

$message .= "<h1 style=\"font-size:".$title_size."; color:".$title_color."; margin:10px 0 0 0;\">".$messageTitle."</h1>";
$message .= "<h2 style=\"font-size:".$subtitle_size."; color:".$subtitle_color."; margin:10px 0 0 0;\">".$messageSubTitle."</h2>";
$message .= "<p>Messaggio inviato da: " .$name. "<br>";
$message .= "E-mail per la risposta: " .$email."</p>";
$message .= "<div style=\"margin:10px 0 0 0;\">".$msg."</div>";
$message .= "<p style=\"font-size:14px; color:#ccc;\"><em>Message sended by BRAINLEAF contactForm&trade;</em></p>";
$message .= "</div>";


/* MAILER */

$mail->From = $email;
$mail->FromName = $name;
$mail->AddAddress($to);
$mail->IsHTML(true);
$mail->Subject = $subject;
$mail->Body = $message;

/* Attachments */
/* ====================== */
if ($attachments == true) {
    for ($i=0; $i < count($attachmentsFiles); $i++) {
        $mail->AddAttachment($attachmentsFilesDir.'/'.$attachmentsFiles[$i]);
	}
}

if($mail->Send()) {
    $resultmsg['result'] = "success";
}else{
    $resultmsg['result'] = "fail";
    $resultmsg['msg'] = $mail->ErrorInfo;
}

$json = json_encode($resultmsg);
echo $json;

?>