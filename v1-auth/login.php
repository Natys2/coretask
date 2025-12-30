<?php
session_start();
include 'conexao.php';

$email = $_POST['email'];
$senha = hash('sha256', $_POST['senha']);

$sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $senha);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $_SESSION['usuario'] = $email;
    header("Location: dashboard.php");
} else {
    echo "<script>alert('Usuário ou senha incorretos!'); window.location.href='index.html';</script>";
}
?>
