<?php
declare(strict_types=1);

namespace App\Models;

use RuntimeException;

final class CatalogFileRepository
{
    public function saveConfig(array $data): string
    {
        $content = 'window.SelectConfig = ' . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . ";\n";
        $this->write(BASE_PATH . '/assets/js/config.js', $content);

        return 'Listas almacenadas en config.js';
    }

    public function saveArsenal(array $data): string
    {
        $wrapped = ['medicamentos' => array_values($data)];
        $content = 'window.ArsenalCatalog = ' . json_encode($wrapped, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . ";\n";
        $this->write(BASE_PATH . '/assets/js/arsenal.js', $content);

        return 'Catálogo de arsenal almacenado en arsenal.js';
    }

    private function write(string $path, string $content): void
    {
        if (file_put_contents($path, $content, LOCK_EX) === false) {
            throw new RuntimeException('No se pudo escribir en el archivo destino.');
        }
    }
}
