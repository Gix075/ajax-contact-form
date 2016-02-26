<?php

//{BANNER}

date_default_timezone_set('Etc/UTC');

require 'config.php';
require 'phpmailer/PHPMailerAutoload.php';

$attachmentsFilesDir = dirname(__FILE__).'/attachments/files';
$resultmsg = array();
$name = "";
$surname = "";
$email = "";
$msg = "";
$attachments = false;


/* ********************************************************************** */
/* Get Input Values */
/* ********************************************************************** */

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
if($_REQUEST['acf_message']) {
    $msg = trim(stripslashes ($_REQUEST['acf_message']));
}

// Attachments
if($_REQUEST['acf_attachments']) {
	$attachments = true;
	$attachmentsFiles = $_REQUEST['acf_attachments'];
	$attachmentsFiles = explode(',', $attachmentsFiles);
}

if ($name == "" || $email == "" || $msg == "") {
    $resultmsg['result'] = "fail";
    $resultmsg['msg'] = "Name, Email and Message fields are required!";
    return $resultmsg;
}

/* ********************************************************************** */
/* MESSAGE BODY SETUP */
/* ********************************************************************** */

$message = "<div style=\"font-family: ".$text_font_family."; font-size:".$text_size."; color:".$text_color.";\">";
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


/* ********************************************************************** */
/* PHP MAILER MESSAGE SETUP */
/* ********************************************************************** */

$mail = new PHPMailer;

/* SMTP */
/* ====================== */
if ($smtp == true) {
    $mail->isSMTP();
    $mail->Host = $smtp_host;
    $mail->Port = $smtp_port;
    $mail->SMTPAuth = $smtp_auth;
    $mail->Username = $smtp_username;
    $mail->Password = $smtp_password;
}

/* Mail Data */
/* ====================== */

$from = array();
$from[0] = ($from_email != "") ? $from_email : $email ;
$from[1] = ($from_name != "") ? $from_name : $name ;

$mail->setFrom($from[0], $from[1]);
$mail->addReplyTo($email, $name);
$mail->addAddress($to);
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

/* ********************************************************************** */
/* send the message, check for errors */
/* ********************************************************************** */
if (!$mail->send()) {
    $resultmsg['result'] = "fail";
    $resultmsg['msg'] = $mail->ErrorInfo;
} else {
    $resultmsg['result'] = "success";
}

$json = json_encode($resultmsg);
echo $json;