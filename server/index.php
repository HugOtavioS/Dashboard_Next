<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");
// echo json_encode(["message" => "Hello, World!"]);
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
            self::$pdo = new PDO("mysql:host=localhost;dbname=db_integrador", "appuser", "appus3rMysql");
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
            exit;
        }
    }

    public static function handleRequest() {
        $url = $_SERVER["REQUEST_URI"];
        $uri = explode("?", $url)[1];

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

        $id_cor = intval($data["id_Cor"] ?? null);
        $id_tamanho = intval($data["id_Tamanho"] ?? null);
        $id_material = intval($data["id_Material"] ?? null);
        $data_hora = $data["Data_hora"] ?? null;

        // try {
            $stmt = self::$pdo->prepare("INSERT INTO tb_pecas (id_cor, id_tamanho, id_material, data_hora) VALUES (:id_cor, :id_tamanho, :id_material, :data_hora)");
            $stmt->bindParam(':id_cor', $id_cor);
            $stmt->bindParam(':id_tamanho', $id_tamanho);
            $stmt->bindParam(':id_material', $id_material);
            $stmt->bindParam(':data_hora', $data_hora);

            self::$insert_count++;
            if ($stmt->execute()) {
                echo json_encode(["message" => "Record inserted successfully"]);
            } else {
                echo json_encode(["message" => "Failed to insert record"]);
            }
        // } catch (PDOException $e) {
        //     echo json_encode(["error" => $e->getMessage()]);
        // }
    }

    private static function getpecas() {
        try {
            $stmt = self::$pdo->prepare("SELECT tb_pecas.id_peca, tb_cor.Cor, tb_tamanho.Tamanho, tb_material.Material FROM tb_pecas INNER JOIN tb_cor ON tb_pecas.id_Cor = tb_cor.id_Cor INNER JOIN tb_tamanho ON tb_pecas.id_Tamanho = tb_tamanho.id_Tamanho INNER JOIN tb_material ON tb_pecas.id_Material = tb_material.id_Material");
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