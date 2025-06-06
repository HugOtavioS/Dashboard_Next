<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Api {
    private static $pdo;
    private static $start_time;
    public static $insert_count = 0;

    public static function construct() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");
        header("Access-Control-Allow-Methods: *");
        header("Content-Type: application/json");

        self::$start_time = time();
        try {
            self::$pdo = new PDO("mysql:host=localhost;dbname=db_prod", "appuser", "appus3rMysql");
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
            exit;
        }
    }

    public static function handleRequest() {
        $url = $_SERVER["REQUEST_URI"];
        $uri = explode("/", $url)[1];
        $uri = explode("?", $uri)[0];

        switch ($uri) {
            case "addpeca":
                self::addpeca();
                break;
            case "getpecas":
                self::getpecas();
                break;
            default:
                self::notFound();
                break;
        }
    }

    private static function addpeca() {
        $data = json_decode(file_get_contents("php://input"), true);

        $cor = intval($data["id_Cor"] ?? null);
        $tamanho = intval($data["id_Tamanho"] ?? null);
        $material = intval($data["id_Material"] ?? null);
        $data_hora = $data["Data_hora"] ?? null;

        $stmt = self::$pdo->prepare("INSERT INTO tb_prod (cor, tamanho, material, data_hora) VALUES (:cor, :tamanho, :material, :data_hora)");
        $stmt->bindParam(':cor', $cor);
        $stmt->bindParam(':tamanho', $tamanho);
        $stmt->bindParam(':material', $material);
        $stmt->bindParam(':data_hora', $data_hora);

        self::$insert_count++;
        if ($stmt->execute()) {
            echo json_encode(["message" => "Record inserted successfully"]);
        } else {
            echo json_encode(["message" => "Failed to insert record"]);
        }
    }

    private static function getpecas() {
        try {
            $filters = explode("?", $_SERVER["REQUEST_URI"])[1];
            $filters = explode("&", $filters);
            $values = [];

            foreach ($filters as $key => $value) {
                $valores = explode("=", $value);
                $values[$valores[0]] = $valores[1];
            }

            $query = "SELECT tb_prod.id_prod, tb_cor.cor, tb_tamanho.tamanho, tb_material.material, data_hora FROM tb_prod INNER JOIN tb_cor ON tb_prod.cor = tb_cor.id_cor INNER JOIN tb_tamanho ON tb_prod.tamanho = tb_tamanho.id_tamanho INNER JOIN tb_material ON tb_prod.material = tb_material.id_material";

            if (count($values) > 1) {
                $query .= " WHERE ";
                $conditions = [];
                
                foreach ($values as $key => $value) {
                    $conditions[] = "tb_$key.$key = '$value'";
                }

                $query .= implode(" AND ", $conditions);
            }

            $stmt = self::$pdo->prepare($query);

            $stmt->execute();
            $pecas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($pecas);
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    private static function notFound() {
        echo json_encode(["error" => "Not Found"]);
    }
}

Api::construct();
Api::handleRequest();