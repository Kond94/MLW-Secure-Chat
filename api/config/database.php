<?php
class Database{
  
    public $conn;
  
    // get the database connection
    public function getConnection(){
  
        $servername = "localhost";
        $username = "root";
        $password = "";
        
        try {
          $this->conn = new PDO("mysql:host=localhost;port=3306;dbname=dmis_chat", $username, $password);
          // set the PDO error mode to exception
          $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
          echo "Connection failed: " . $e->getMessage();
        }

        return $this->conn;
    }
}
?>