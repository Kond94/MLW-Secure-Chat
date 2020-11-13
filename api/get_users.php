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
  
// read the details of chat to be edited
// query chats
$stmt = $chat_user->read();
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // chats array
    $user_arr=array();
  
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
  
        $entity=array(
            "entity_id" => $uname,
            "suspended" => $suspended,
        );
  
        array_push($user_arr, $entity);
        

     
            
    }
  
    // set response code - 200 OK
    http_response_code(200);

   
  
    // show chats data in json format
    echo json_encode($user_arr);
}

else 
{
      
    // set response code - 200 OK
    http_response_code(404);

   
  
      // tell the user no chats found
      echo json_encode(
        array("message" => "No users found.")
    );
}

?>