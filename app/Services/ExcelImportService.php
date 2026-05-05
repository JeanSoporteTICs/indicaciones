<?php
declare(strict_types=1);

namespace App\Services;

use PhpOffice\PhpSpreadsheet\IOFactory;
use RuntimeException;
use Throwable;

final class ExcelImportService
{
    public function extractEmbeddedData(string $tmpPath): array
    {
        try {
            $spreadsheet = IOFactory::load($tmpPath);
        } catch (Throwable $e) {
            throw new RuntimeException('No se pudo leer el archivo proporcionado: ' . $e->getMessage(), 400);
        }

        $sheetJson = $spreadsheet->getSheetByName('__DATA_JSON');
        if (!$sheetJson) {
            throw new RuntimeException('El archivo no contiene datos embebidos compatibles', 400);
        }

        $json = (string)$sheetJson->getCell('A1')->getValue();
        $data = json_decode($json, true);
        if (!is_array($data)) {
            throw new RuntimeException('Los datos embebidos están corruptos o vacíos', 400);
        }

        return $data;
    }
}
