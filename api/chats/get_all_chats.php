<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/chat.php';
  
// instantiate database and chat object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$chat = new Chat($db);

// set ID property of record to read
$chat->uname = isset($_GET['uname']) ? $_GET['uname'] : die();
  
// query chats
$stmt = $chat->readAll();
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // chats array
    $chats_arr=array();
  
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
  
        $chat_item=array(
            "chat_id" => $chat_id,
            "uname" => $uname,
            "chat_title" => $chat_title,
            "chat_body" => $chat_body,
            "base64_image" => $base64_image,
            "chat_time" => $chat_time,
            "thread_parent" => $thread_parent,
            "thread_root" => $thread_root
        );
  
        array_push($chats_arr, $chat_item);
        

     
            
    }
  
    // set response code - 200 OK
    http_response_code(200);

   
  
    // show chats data in json format
    echo json_encode($chats_arr);
}

else 
{
      
    // set response code - 200 OK
    http_response_code(404);

   
  
      // tell the user no chats found
      echo json_encode(
        array("message" => "No chats found.")
    );
}

?>