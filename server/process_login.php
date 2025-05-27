<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    header("Content-Type: application/json");

    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data['Username'] ?? '';
    $password = $data['password'] ?? '';
    try {
        $pdo = new PDO("mysql:host=localhost;dbname=db_integrador", "root", "030119983");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        die("Erro na conexão: " . $e->getMessage());
    }
    try {
        $stmt = $pdo->prepare("SELECT * FROM tb_admin WHERE login = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['senha'])) {
            json_encode($user['login']);
            exit();
        } else {
            $error = "Username ou senha incorretos!";
            json_encode(['error' => $error]);
            exit();
        }
    } catch (PDOException $e) {
        $error = "Erro: " . $e->getMessage();
        json_encode(['error' => $error]);
        exit();
    }
    json_encode("ok");
?>