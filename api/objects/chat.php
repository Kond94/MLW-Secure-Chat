<?php
class Chat{
  
    // database connection and table name
    private $conn;
    private $table_name = "chat";
  
    // object properties
    public $chat_id;
    public $uname;
    public $chat_title;
    public $chat_body;
    public $base64_image;
    public $chat_time;
    public $thread_parent;
    public $send2user;
    public $send2group;
  
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // read chats
function read(){
  
    // select all query
    $query = "CALL uspUserChat_GetUnread(?);";

    // prepare query statement
    $stmt = $this->conn->prepare($query);
  
       // bind id of chat to be updated
    $stmt->bindParam(1, $this->uname);
    // execute query
    $stmt->execute();
  
    return $stmt;
}

function readAll(){
  
    // select all query
    $query = "CALL uspUserChat_GetAll(?);";

    // prepare query statement
    $stmt = $this->conn->prepare($query);
  
       // bind id of chat to be updated
    $stmt->bindParam(1, $this->uname);
    // execute query
    $stmt->execute();
  
    return $stmt;
}
    
// create chat
function create(){
      // select all query
      $query = "CALL uspChat_Add(?,?,?,?,?,?,?);";

      // prepare query statement
      $stmt = $this->conn->prepare($query);
    
         // bind id of chat to be updated
      $stmt->bindParam(1, $this->uname);
      $stmt->bindParam(2, $this->chat_title);
      $stmt->bindParam(3, $this->chat_body);
      $stmt->bindParam(4, $this->base64_image);
      $stmt->bindParam(5, $this->thread_parent);
      $stmt->bindParam(6, $this->send2user);
      $stmt->bindParam(7, $this->send2group);
      // execute query
      $stmt->execute();
    
      return $stmt;
      
}


}
?>