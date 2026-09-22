<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['success'=>false,'message'=>'Method tidak diizinkan.'],405);
$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$email = trim((string)($data['email'] ?? ''));
$password = (string)($data['password'] ?? '');

$stmt = $pdo->prepare('SELECT id, name, email, phone, password, role FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) jsonResponse(['success'=>false,'message'=>'Email atau password salah.'],401);

$_SESSION['user_id'] = (int)$user['id'];
$_SESSION['user_name'] = $user['name'];
$_SESSION['user_role'] = $user['role'];
unset($user['password']);
jsonResponse(['success'=>true,'message'=>'Login berhasil.','user'=>$user]);
