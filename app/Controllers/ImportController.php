<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\JsonResponse;
use App\Services\ExcelImportService;
use RuntimeException;
use Throwable;

final class ImportController
{
    private ExcelImportService $service;

    public function __construct(?ExcelImportService $service = null)
    {
        $this->service = $service ?? new ExcelImportService();
    }

    public function excel(): void
    {
        error_reporting(E_ALL);
        ini_set('display_errors', '0');
        ini_set('log_errors', '1');

        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
            JsonResponse::error('Método no permitido', 405);
            return;
        }

        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            JsonResponse::error('Archivo no enviado o con errores', 400);
            return;
        }

        try {
            $data = $this->service->extractEmbeddedData((string)$_FILES['file']['tmp_name']);
            JsonResponse::send($data);
        } catch (RuntimeException $e) {
            JsonResponse::error($e->getMessage(), $e->getCode() > 0 ? $e->getCode() : 400);
        } catch (Throwable $e) {
            JsonResponse::error('Error inesperado al importar el archivo: ' . $e->getMessage(), 500);
        }
    }
}
