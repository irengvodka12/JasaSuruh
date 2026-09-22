<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['success'=>false,'message'=>'Method tidak diizinkan.'],405);

$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$password = (string)($data['password'] ?? '');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $phone === '' || strlen($password) < 6) {
    jsonResponse(['success'=>false,'message'=>'Data pendaftaran belum lengkap atau tidak valid.'],422);
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) jsonResponse(['success'=>false,'message'=>'Email sudah terdaftar.'],409);

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, "customer")');
$stmt->execute([$name, $email, $phone, $hash]);

$_SESSION['user_id'] = (int)$pdo->lastInsertId();
$_SESSION['user_name'] = $name;
$_SESSION['user_role'] = 'customer';

jsonResponse(['success'=>true,'message'=>'Akun berhasil dibuat.','user'=>['id'=>$_SESSION['user_id'],'name'=>$name,'email'=>$email,'role'=>'customer']]);
