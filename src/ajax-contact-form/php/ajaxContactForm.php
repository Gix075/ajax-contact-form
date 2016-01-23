<?php

//{BANNER}

include 'config.php';

$name = trim(stripslashes ($_REQUEST['acf_name']));
//$surname = trim(stripslashes ($_REQUEST['acf_surname']));
$name = $name." ".$surname;
$email = trim(stripslashes ($_REQUEST['acf_email']));
//$subject .= trim(stripslashes ($_REQUEST['acf_subject']));
$msg = trim(stripslashes ($_REQUEST['acf_message']));
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= "From: " . $email . "\r\n"; // Sender's E-mail
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= "Content-Transfer-Encoding: 7bit\n\n";

$message .= "<div style=\"font-family: ".$text_font_family."; font-size:".$text_size."; color:".$text_color.";\">";
if ($messageImage != "") {
    $message .= "<img src=\"".$messageImage."\" alt=\"contact form image\"";
}

$message .= "<h1 style=\"font-size:".$title_size."; color:".$title_color."; margin:10px 0 0 0;\">".$messageTitle."</h1>";
$message .= "<h2 style=\"font-size:".$subtitle_size."; color:".$subtitle_color."; margin:10px 0 0 0;\">".$messageSubTitle."</h2>";
$message .= "<p>Messaggio inviato da: " .$name. "<br>";
$message .= "E-mail per la risposta: " .$email."</p>";
$message .= "<p>".$msg."</p>";
$message .= "<p style=\"font-size:14px; color:#ccc;\"><em>Message sended by BRAINLEAF contactForm&trade;</em></p>";
$message .= "</div>";

$ok = mail($to,$subject,$message,$headers);
$resultmsg['result'] = $ok?"success":"fail";
$json = json_encode($resultmsg);
echo $json;

?>