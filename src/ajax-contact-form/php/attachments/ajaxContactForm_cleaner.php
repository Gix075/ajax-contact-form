<?php
    
//{BANNER}

$fileName = "files/".$_GET['file'];
$sleepMinutes = $_GET['minutes'];
sleep($sleepMinutes * 60);
$date = date('d-m-Y H:i:s');
$logPath = dirname(__FILE__);
$log = fopen($logPath."/attachments_logs.txt","a");

if (file_exists($fileName)) {
    
    if(unlink($fileName)) {
        $logRow = "FILE: ".$fileName." - REMOVED! - DATE: ".$date."\n";
        $success = true;
        $msg = "File removed";
    }else{
        $logRow = "FILE: ".$fileName." - NOT REMOVED! - DATE: ".$date."\n";
        $success = false;
        $msg = "File not removed";
    }
    
}else{
    $logRow = "FILE: ".$fileName." - TRY TO REMOVE IT BUT FILE NOT EXISTS! - DATE: ".$date."\n";
    $success = false;
    $msg = "File not exist!";
}

fwrite($log,$logRow); 
fclose($log);

$result = array();
$result['success'] = $success;
$result['file'] = $_GET['file'];
$result['msg'] = $msg;
$json = json_encode($result);


echo $json;


