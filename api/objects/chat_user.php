<?php
class ChatUser{
  
    // database connection and table name
    private $conn;
    private $table_name = "chat_user";
  
    // object properties
    public $uname;
    public $suspended;
  
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // read products
    function read(){
  
        // query to read single record
        $query = "SELECT * FROM chat_user";
      
        // prepare query statement
        $stmt = $this->conn->prepare( $query );
      
        // execute query
        $stmt->execute();
      
        return $stmt;
    }

function readOne(){
  
    // query to read single record
    $query = "SELECT * FROM chat_user WHERE uname = ?";
  
    // prepare query statement
    $stmt = $this->conn->prepare( $query );
  
    // bind id of chat to be updated
    $stmt->bindParam(1, $this->uname);
  
    // execute query
    $stmt->execute();
  
    // get retrieved row
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
  
    // set values to object properties
    $this->uname = $row['uname'];
    $this->suspended = $row['suspended'];
}

}
?>