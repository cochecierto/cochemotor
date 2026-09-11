<?php
/**
 * CocheMotor — Gateway & Production Entrypoint
 * Sirve dinamicamente el contenido de index.html con cabeceras anti-cache en Hostinger (hcdn).
 */
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('Content-Type: text/html; charset=UTF-8');

 = __DIR__ . '/index.html';
if (file_exists()) {
    readfile();
} else {
    echo 'Error: index.html no encontrado.';
}
