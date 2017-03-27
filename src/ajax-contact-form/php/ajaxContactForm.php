<?php

//{BANNER}

date_default_timezone_set('Etc/UTC');

require 'config.php';
require 'phpmailer/PHPMailerAutoload.php';
$attachmentsFilesDir = dirname(__FILE__).'/attachments/files';
$backupsFilesDir = dirname(__FILE__).'/backups/files';
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

// Custom Fields
$custom_fields = FALSE;
if(isset($_REQUEST['acf_customs'])) {
    $custom_fields = $_REQUEST['acf_customs'];
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
$message .= "<p>".$messageFrom.": " .$name. "<br>";
$message .= $messageReplyTo.": " .$email."</p>";
$message .= "<div style=\"margin:10px 0 0 0;\">".$msg."</div>";

// Custom Fields
if ($custom_fields != FALSE && is_array($custom_fields)) {
    $message .= "<div style=\"margin:10px 0 0 0;\">";
        foreach ($custom_fields as $key => $value) {
            $message .= "<div style=\"margin:5px 0 0 0;\">";
            $message .= $key.": ".$value;
            $message .= "</div>";
        }
    $message .= "</div>";
}

$message .= "<p style=\"font-size:12px; color:#ccc;\"><em>Message sended by BRAINLEAF ajaxContactForm&trade;</em></p>";
$message .= "</div>";


/* ********************************************************************** */
/* MESSAGE BACKUP */
/* ********************************************************************** */

if ($backup_system_active == TRUE) {
    require_once 'backups/ajaxContactForm_backup.php';
    //$backupsFilesDir
    $backupAttachmentsFiles = ($attachments == TRUE) ? $attachmentsFiles : FALSE;
    $backup = new MessageBackup($backup_encrypt_key,$backup_encrypt_iv,$backup_zip_password,$backupsFilesDir,$name,$email,1,$subject,$msg,$attachmentsFilesDir,$backupAttachmentsFiles);
}

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

$mail->CharSet = 'UTF-8';
$mail->setFrom($from[0], $from[1]);
$mail->addReplyTo($email, $name);
$mail->addAddress($to);

/* CC */
/* ====================== */
if ($cc != "") {
    $cc_array = array();
    $cc_array = explode(",", $cc);
    foreach ($cc_array as $cc_address) {
        $mail->AddCC($cc_address);
    }
}

//* BCC */
/* ====================== */
if ($bcc != "") {
    $bcc_array = array();
    $bcc_array = explode(",", $bcc);
    foreach ($bcc_array as $bcc_address) {
        $mail->AddBCC($bcc_address);
    }
}

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
/* sends the message, checks for errors */
/* ********************************************************************** */
if (!$mail->send()) {
    $resultmsg['result'] = "fail";
    $resultmsg['msg'] = $mail->ErrorInfo;
} else {
    $resultmsg['result'] = "success";
}

$json = json_encode($resultmsg);
echo $json;