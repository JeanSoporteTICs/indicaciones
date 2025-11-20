<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido. Use POST.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$raw = file_get_contents('php://input');
if (!$raw) {
    http_response_code(400);
    echo json_encode(['error' => 'Payload vacío.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON inválido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$target = $payload['target'] ?? '';
$data   = $payload['data']   ?? null;

switch ($target) {
    case 'config':
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Estructura de configuración inválida.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $path = __DIR__ . '/assets/js/config.js';
        $content = "window.SelectConfig = " . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . ";\n";
        $successMessage = 'Listas almacenadas en config.js';
        break;
    case 'arsenal':
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Estructura de arsenal inválida.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $path = __DIR__ . '/assets/js/arsenal.js';
        $wrapped = ['medicamentos' => array_values($data)];
        $content = "window.ArsenalCatalog = " . json_encode($wrapped, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . ";\n";
        $successMessage = 'Catálogo de arsenal almacenado en arsenal.js';
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Target desconocido.'], JSON_UNESCAPED_UNICODE);
        exit;
}

if (@file_put_contents($path, $content, LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo escribir en el archivo destino.'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['success' => true, 'message' => $successMessage], JSON_UNESCAPED_UNICODE);
