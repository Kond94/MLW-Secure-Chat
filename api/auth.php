<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
  
// include database and object files
include_once './config/database.php';
include_once './objects/chat_user.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare chat object
$chat_user = new ChatUser($db);
  
// set ID property of record to read
$chat_user->uname = isset($_GET['uname']) ? $_GET['uname'] : die();
  
// read the details of chat to be edited
$chat_user->readOne();
  
if($chat_user->uname!=null){
    // create array
    $chat_user_arr = array(
        "uname" =>  $chat_user->uname,
        "date_join" => $chat_user->date_join,
        "suspended" => $chat_user->suspended,
  
    );
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($chat_user_arr);
}
  
else{
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the user chat does not exist
    echo json_encode(array("message" => "Chat user does not exist."));
}
?>