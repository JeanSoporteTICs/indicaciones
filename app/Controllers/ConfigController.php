<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\JsonResponse;
use App\Models\CatalogFileRepository;
use Throwable;

final class ConfigController
{
    private CatalogFileRepository $repository;

    public function __construct(?CatalogFileRepository $repository = null)
    {
        $this->repository = $repository ?? new CatalogFileRepository();
    }

    public function save(): void
    {
        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
            JsonResponse::error('Método no permitido. Use POST.', 405);
            return;
        }

        $payload = $this->readJsonPayload();
        if ($payload === null) {
            return;
        }

        $target = (string)($payload['target'] ?? '');
        $data = $payload['data'] ?? null;
        if (!is_array($data)) {
            JsonResponse::error('Estructura de datos inválida.', 400);
            return;
        }

        try {
            $message = match ($target) {
                'config' => $this->repository->saveConfig($data),
                'arsenal' => $this->repository->saveArsenal($data),
                default => null,
            };

            if ($message === null) {
                JsonResponse::error('Target desconocido.', 400);
                return;
            }

            JsonResponse::send(['success' => true, 'message' => $message]);
        } catch (Throwable $e) {
            JsonResponse::error($e->getMessage(), 500);
        }
    }

    private function readJsonPayload(): ?array
    {
        $raw = file_get_contents('php://input');
        if ($raw === false || $raw === '') {
            JsonResponse::error('Payload vacío.', 400);
            return null;
        }

        $payload = json_decode($raw, true);
        if (!is_array($payload)) {
            JsonResponse::error('JSON inválido.', 400);
            return null;
        }

        return $payload;
    }
}
