<?php
class Database
{
    private static $conn;

    public static function connect()
    {
        if (self::$conn == null) {
            self::$conn = new PDO("mysql:host=127.0.0.1;dbname=delivery", "root", "");
            self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        return self::$conn;
    }
}
