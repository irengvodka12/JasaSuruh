CREATE DATABASE IF NOT EXISTS jasasuruh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jasasuruh;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer','worker','admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_code VARCHAR(40) NOT NULL UNIQUE,
  customer_id INT UNSIGNED NOT NULL,
  worker_id INT UNSIGNED NULL,
  service_type VARCHAR(80) NOT NULL,
  schedule VARCHAR(50) NOT NULL DEFAULT 'Secepatnya',
  pickup_address TEXT NOT NULL,
  destination_address TEXT NULL,
  estimated_price DECIMAL(14,2) NOT NULL DEFAULT 0,
  contact_phone VARCHAR(30) NOT NULL,
  details TEXT NOT NULL,
  status ENUM('Menunggu','Diproses','Diambil','Selesai','Dibatalkan') NOT NULL DEFAULT 'Menunggu',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_orders_worker FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_orders_customer (customer_id),
  INDEX idx_orders_status (status)
) ENGINE=InnoDB;

INSERT INTO users (name,email,phone,password,role)
SELECT 'Admin JasaSuruh','admin@jasasuruh.test','080000000000', '$2y$12$3s0ur0jqMJQmrf.BlRZ1fueCXH6nq1Kd54x4hn8zo6Y4/TDRt0bwK', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='admin@jasasuruh.test');
