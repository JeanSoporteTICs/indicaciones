<?php
declare(strict_types=1);

namespace App\Core;

final class View
{
    public static function render(string $view, array $data = []): void
    {
        $path = APP_ROOT . '/Views/' . ltrim($view, '/');
        if (!str_ends_with($path, '.php')) {
            $path .= '.php';
        }

        if (!is_file($path)) {
            http_response_code(500);
            echo 'Vista no encontrada.';
            return;
        }

        extract($data, EXTR_SKIP);
        require $path;
    }
}
