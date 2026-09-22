<?php
require __DIR__ . '/config.php';

if (empty($_SESSION['user_id'])) jsonResponse(['success'=>false,'message'=>'Belum login.'],401);
$stmt = $pdo->prepare('SELECT id,name,email,phone,role FROM users WHERE id=? LIMIT 1');
$stmt->execute([(int)$_SESSION['user_id']]);
$user = $stmt->fetch();
if (!$user) jsonResponse(['success'=>false,'message'=>'Pengguna tidak ditemukan.'],404);
jsonResponse(['success'=>true,'user'=>$user]);
