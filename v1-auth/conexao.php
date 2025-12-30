<?php
$host = "localhost";
$usuario = "SeuUsuario";
$senha = "SuaSenha";
$banco = "SeuBanco";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
?>
