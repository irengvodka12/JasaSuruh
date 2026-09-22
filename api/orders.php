<?php
require __DIR__ . '/config.php';
$userId = requireLogin();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->prepare('SELECT id, order_code, service_type, schedule, pickup_address, destination_address, estimated_price, contact_phone, details, status, created_at FROM orders WHERE customer_id=? ORDER BY created_at DESC');
    $stmt->execute([$userId]);
    jsonResponse(['success'=>true,'orders'=>$stmt->fetchAll()]);
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $serviceType = trim((string)($data['service_type'] ?? ''));
    $schedule = trim((string)($data['schedule'] ?? 'Secepatnya'));
    $pickup = trim((string)($data['pickup_address'] ?? ''));
    $destination = trim((string)($data['destination_address'] ?? ''));
    $estimated = (float)($data['estimated_price'] ?? 0);
    $phone = trim((string)($data['contact_phone'] ?? ''));
    $details = trim((string)($data['details'] ?? ''));

    if ($serviceType === '' || $pickup === '' || $phone === '' || $details === '') jsonResponse(['success'=>false,'message'=>'Mohon lengkapi data wajib.'],422);

    $orderCode = 'JS' . date('ymdHis') . strtoupper(substr(bin2hex(random_bytes(3)),0,3));
    $stmt = $pdo->prepare('INSERT INTO orders (order_code, customer_id, service_type, schedule, pickup_address, destination_address, estimated_price, contact_phone, details, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "Menunggu")');
    $stmt->execute([$orderCode,$userId,$serviceType,$schedule,$pickup,$destination,$estimated,$phone,$details]);
    jsonResponse(['success'=>true,'message'=>'Pesanan berhasil dibuat.','order_id'=>(int)$pdo->lastInsertId(),'order_code'=>$orderCode]);
}

jsonResponse(['success'=>false,'message'=>'Method tidak diizinkan.'],405);
