/*! 
 * ************************************************************************* 
 *  AjaxContactForm | Simple ajax contact form 
 *  Version 1.5.0 - Date: 27/01/2016 
 *  HomePage: https://github.com/Gix075/ajax-contact-form 
 * ************************************************************************* 
*/ 


/* 
    --------- NOTE -------------------------------------------------------
    This file is an example of javascript tool usage.
    Probably you need to customize it in order to use it on your server.
    Follow the istruction comments!
    ----------------------------------------------------------------------
*/


// AjaxContactForm Parameters
// ================================
var opts = {
    form: "#ajaxContactForm",
    formBtn: "#ajaxContactFormBtn",
    ws: 'ajax-contact-form/php/ajaxContactForm.php',
    showMsg: true,
    recaptcha: {
        pubKey: "YouRGooGLEreCapTcHAapIKeyPublicKey",
        element: "ajaxContactForm_recaptcha",
        theme: "light",
        ws: 'ajax-contact-form/php/ajaxContactForm_recaptcha.php'
    },
    attachments: {
        allowed: true,
        ws: 'ajax-contact-form/php/attachments/ajaxContactForm_attachments.php',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|zip)$/i,
        maxFileSize: 20971520,
        maxTotalSize: 20971520,
        maxFiles: 10,
        cleanAfterMinutes: 20
    },
    messages: {
        attachments: {
            clean: 'TIMEOUT - Your file was removed, please upload it again!',
            fileRemoved: 'File removed!',
            errors: {
                uploadFailed: 'Upload failed!',
                maxNumberOfFiles: 'Sorry, maximum number of files exceeded',
                maxFileSize: 'Sorry, file too large!',
                maxTotalSize: 'Sorry the attachment size amount exceeds the maximum quota!',
                timeout: 'TIMEOUT - Your file was removed, please upload it again!',
                fileType: 'File type not allowed!'
            }
        }
    },
    debug: true
};



$(window).on('load', function() {
    new ajaxContactForm(opts).init();        
});


