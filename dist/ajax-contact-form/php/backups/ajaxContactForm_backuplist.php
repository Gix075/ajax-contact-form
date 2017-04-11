<?php

/*! 
 * ************************************************************************* 
 *  AjaxContactForm | Simple ajax contact form 
 *  Version 1.10.0b - Date: 11/04/2017 
 *  HomePage: https://github.com/Gix075/ajax-contact-form 
 * ************************************************************************* 
*/ 


/**
 * BACKUP LIST PAGE CLASS
 */
class BackupList  {
	
	function __construct($backup_encrypt_key, $backup_encrypt_iv) {
		$this->encrypt_key = $backup_encrypt_key;
        $this->encrypt_iv = $backup_encrypt_iv;
	}
    
    public function getMessages() {
        $messages = array();
        $list = glob(dirname(__FILE__)."/files/*",GLOB_ONLYDIR); 
        foreach ($list as $key => $message) {
            if (count((array) $message) > 0) {
                $filename = basename($message);
                $item = new stdClass();
                $item->directory = $message;
                $item->json = file_get_contents($message."/".$filename.".json");
                //$item->json = $this->messageEncryptDecrypt('decrypt', (string) $item->json);
                $item->message = json_decode($item->json);
                if($item->message != "") {
                    $messages[$key]['data'] = $item->message;
                    $messages[$key]['name'] = $filename;
                }
            }
        }
        return $messages;
    }
    
    private function messageEncryptDecrypt($action, $string) {
            
        $output = false;
    
        $encrypt_method = "AES-256-CBC";
        $secret_key = $this->encrypt_key;
        $secret_iv = $this->encrypt_iv;
    
        // hash
        $key = hash('sha256', $secret_key);
        
        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hash('sha256', $secret_iv), 0, 16);
    
        if( $action == 'encrypt' ) {
            $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
            $output = base64_encode($output);
        }
        else if( $action == 'decrypt' ){
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
        }
            
        return $output;
   
    }
}
