<?php

    /*! 
 * ************************************************************************* 
 *  AjaxContactForm | Simple ajax contact form 
 *  Version 1.10.0b - Date: 11/04/2017 
 *  HomePage: https://github.com/Gix075/ajax-contact-form 
 * ************************************************************************* 
*/ 

    
    /**
     * Messages Backup System Class
     * -----------------------------------
     * this class provides a json backup for each message sended using AjaxContactForm
     */

    
    class MessageBackup  {
            
        function __construct($backup_settings, $email_message) {
            $this->settings = $backup_settings;
            $this->message = $email_message;
            $this->date = time();
            $this->message->date = date("d/m/Y - H:i:s",$this->date);
            $this->file_name = "msg_".date("Y-m-d_H-i-s",$this->date)."-".strtolower(str_replace(" ", "-", $email_message->from));
            $this->dir_name = $this->settings->directory."/".$this->file_name;
            $this->dir_resources = $this->dir_name."/resources";
            $this->backupdbfile = $backup_settings->directory."/acf.backups.db.json";
            $this->logfile = $backup_settings->directory."/acf.backups.logs.log";
        }
        
        public function saveMessage() {
            
            $make_base_dir = $this->makeBackupDirs($this->dir_name);
            $make_attachments_dir = $this->makeBackupDirs($this->dir_resources);
                
            $json = json_encode($this->message);
            //$json = $this->messageEncryptDecrypt("encrypt", $json);
            $save_json = FALSE;
            $save_attachments = FALSE;
            $save_backupsdb = FALSE;
            $save_logs = FALSE;
            
            // Message
            if(file_put_contents($this->dir_name."/".$this->file_name.".json", $json)) {
                $save_json = TRUE;
            }
            
            // Attachments
            if ($this->message->attachments != FALSE && is_array($this->message->attachments)) {
                $save_attachments = $this->saveAttachments();
            }else{
                $save_attachments = TRUE;
            }
            
            // Logs
            if ($make_base_dir == TRUE && $make_attachments_dir == TRUE && $save_json == TRUE && $save_attachments == TRUE) {
                $message = "SUCCESS (MESSAGE SAVED)";
            }else{
                $message = "ERROR (MESSAGE NOT SAVED)";
            }
            $this->writeLog($message);
        }
        
        // ATTACHMENTS
        // **************************************************************
        private function saveAttachments() {
            $attachments_number = count($this->message->attachments);
            $errors = 0;
            foreach ($this->message->attachments as $attachment) {
                $attachment_filename = basename($attachment);
                if(!copy($this->settings->attachments_dir."/".$attachment_filename, $this->dir_resources."/".$attachment_filename)) {
                    $errors = $errors + 1;
                }
            }
            return ($errors > 0) ? FALSE : TRUE;
        }
        
        // TOOL: ENCRYPT / DECRYPT
        // **************************************************************
        protected function messageEncryptDecrypt($action, $string) {
            
                $output = false;
            
                $encrypt_method = "AES-256-CBC";
                $secret_key = $backup_settings->encript_key;
                $secret_iv = $backup_settings->encript_iv;
            
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
        
        // TOOL: WRITE LOG
        // **************************************************************
        private function writeLog($message) {
            $log_date = date("Y/m/d H:i:s",$this->date);
            $log_message = $log_date." :: ".$this->file_name." : ".$message.PHP_EOL;
            return file_put_contents($this->logfile, $log_message,FILE_APPEND);
        }
        
        // TOOL: CREATE DIR
        // **************************************************************
        private function makeBackupDirs($dir) {
            
            if (!file_exists($dir)) {
                if (mkdir($dir,0755)) {
                    return TRUE;
                }else{
                    return FALSE;
                }
            }else{
                return TRUE;
            }
            
        }
        
    }