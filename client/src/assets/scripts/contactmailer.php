<?php
//simple php email sender, returns 1 on success or error message if failed
$message_success = false;
$message_error = "";
if(isset($_POST['name']) && $_POST['name'] != ''){
    if(filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)){
        $name = $_POST['name'];
        $phone = $_POST['phone'];
        $email = $_POST['email'];
        $note = $_POST['note'];
        
        $to = "your@mail.com";
        $body = "";
        $body .= "Name: " . $name . "\r\n";
        $body .= "Phone: " . $phone . "\r\n";
        $body .= "Email: " . $email . "\r\n";
        $body .= "Note: " . $note . "\r\n";
        $body .= "It's automatic mail message. \r\n";
        
        try {
        mail($to, "test", $body);
        } catch (Exception $e) {
            $message_error = "Server error.";
            echo 'Execption: ',  $e->getMessage(), "\n";
        }
        
        $message_success = true;
        echo $message_success;
    }
    else{
        $message_error = "Not valid email.";
        echo $message_error;
    }
}
else{
    $message_error = "Not valid name.";
    echo $message_error;
}


?>