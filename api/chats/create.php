<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// get database connection
include_once '../config/database.php';
  
// instantiate chat object
include_once '../objects/chat.php';
  
$database = new Database();
$db = $database->getConnection();
  
$chat = new Chat($db);
  
// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if(
    true
){
  
    // set chat property values
    $chat->uname = $data->uname;
    $chat->chat_title = $data->chat_title;
    $chat->chat_body = $data->chat_body;
    $chat->base64_image = $data->base64_image;
    $chat->thread_parent = $data->thread_parent;
    $chat->send2user = $data->send2user;
    $chat->send2group = $data->send2group;
   
    // create the chat
    if($chat->create()){
  
        // set response code - 201 created
        http_response_code(201);
  
        // tell the user
        echo json_encode(array("message" => "Chat was created."));
    }
  
    // if unable to create the chat, tell the user
    else{
  
        // set response code - 503 service unavailable
        http_response_code(503);
  
        // tell the user
        echo json_encode(array("message" => "Unable to create chat."));
    }
}
  
// tell the user data is incomplete
else{
  
    // set response code - 400 bad request
    http_response_code(400);
  
    // tell the user
    echo json_encode(array("message" => "Unable to create chat. Data is incomplete. "));
}
?>