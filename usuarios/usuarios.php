<?php
declare(strict_types=1);
require_once __DIR__ . '/usuarios_control.php';

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    try {
        switch ($action) {
            case 'create':
                createUserEntry($_POST);
                $message = 'Usuario creado correctamente.';
                break;
            case 'update':
                updateUserEntry($_POST);
                $message = 'Usuario actualizado correctamente.';
                break;
            case 'delete':
                deleteUserEntry((string)($_POST['id'] ?? ''));
                $message = 'Usuario eliminado.';
                break;
            default:
                $error = 'Acción no soportada.';
        }
    } catch (UserControllerException $e) {
        $error = $e->getMessage();
    } catch (Throwable $e) {
        $error = 'Error inesperado: ' . $e->getMessage();
    }
}

$users = loadUsers();
$editId = $_GET['edit'] ?? '';
$editingUser = null;
if ($editId) {
    foreach ($users as $user) {
        if ($user['id'] === $editId) {
            $editingUser = $user;
            break;
        }
    }
}

function h(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de usuarios</title>
    <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
    <link rel="shortcut icon" href="../assets/favicon.svg">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-light">
<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0"><i class="fas fa-users me-2"></i>Gestión de usuarios</h1>
        <a href="../index.php" class="btn btn-outline-secondary"><i class="fas fa-home me-1"></i>Volver</a>
    </div>

    <?php if ($message): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <?= h($message) ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    <?php endif; ?>
    <?php if ($error): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <?= h($error) ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    <?php endif; ?>

    <div class="row g-4">
        <div class="col-lg-5">
            <div class="card shadow-sm">
                <div class="card-header">
                    <strong><?= $editingUser ? 'Editar usuario' : 'Nuevo usuario' ?></strong>
                </div>
                <div class="card-body">
                    <form method="post">
                        <input type="hidden" name="action" value="<?= $editingUser ? 'update' : 'create' ?>">
                        <?php if ($editingUser): ?>
                            <input type="hidden" name="id" value="<?= h($editingUser['id']) ?>">
                        <?php endif; ?>
                        <div class="mb-3">
                            <label class="form-label">Usuario</label>
                            <input type="text" class="form-control" name="username" required minlength="3"
                                   value="<?= h($editingUser['username'] ?? '') ?>">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control" name="nombre"
                                   value="<?= h($editingUser['nombre'] ?? '') ?>">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Rol</label>
                            <select class="form-select" name="rol">
                                <?php
                                $roles = [
                                    'admin' => 'Administrador',
                                    'editor' => 'Editor',
                                    'usuario' => 'Usuario'
                                ];
                                $currentRole = $editingUser['rol'] ?? 'usuario';
                                foreach ($roles as $value => $label):
                                ?>
                                    <option value="<?= $value ?>" <?= $currentRole === $value ? 'selected' : '' ?>>
                                        <?= $label ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Contraseña</label>
                            <input type="password" class="form-control" name="password" <?= $editingUser ? '' : 'required minlength="4"' ?>>
                            <div class="form-text">
                                <?= $editingUser ? 'Déjela en blanco para mantener la contraseña actual.' : 'Debe tener al menos 4 caracteres.' ?>
                            </div>
                        </div>
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" name="activo" value="1"
                                <?= !isset($editingUser) || ($editingUser['activo'] ?? true) ? 'checked' : '' ?>>
                            <label class="form-check-label">Usuario activo</label>
                        </div>
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary flex-fill">
                                <i class="fas fa-save me-1"></i> Guardar
                            </button>
                            <?php if ($editingUser): ?>
                                <a href="usuarios.php" class="btn btn-secondary flex-fill">
                                    <i class="fas fa-ban me-1"></i> Cancelar edición
                                </a>
                            <?php else: ?>
                                <button type="reset" class="btn btn-outline-secondary flex-fill">
                                    <i class="fas fa-eraser me-1"></i> Limpiar
                                </button>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-lg-7">
            <div class="card shadow-sm">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <strong>Usuarios registrados</strong>
                    <span class="badge text-bg-secondary"><?= count($users) ?></span>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover mb-0 align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Usuario</th>
                                    <th>Nombre</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th class="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php if (!$users): ?>
                                <tr>
                                    <td colspan="5" class="text-center text-muted py-4">No hay usuarios registrados.</td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($users as $user): ?>
                                    <tr>
                                        <td class="fw-semibold"><?= h($user['username']) ?></td>
                                        <td><?= h($user['nombre'] ?? '') ?></td>
                                        <td>
                                            <span class="badge text-bg-primary text-capitalize"><?= h($user['rol'] ?? 'usuario') ?></span>
                                        </td>
                                        <td>
                                            <span class="badge <?= ($user['activo'] ?? true) ? 'bg-success' : 'bg-secondary' ?>">
                                                <?= ($user['activo'] ?? true) ? 'Activo' : 'Inactivo' ?>
                                            </span>
                                        </td>
                                        <td class="text-end">
                                            <div class="btn-group btn-group-sm">
                                                <a href="usuarios.php?edit=<?= h($user['id']) ?>" class="btn btn-outline-secondary">
                                                    <i class="fas fa-pen"></i>
                                                </a>
                                                <form method="post" onsubmit="return confirm('¿Eliminar al usuario <?= h($user['username']) ?>?');">
                                                    <input type="hidden" name="action" value="delete">
                                                    <input type="hidden" name="id" value="<?= h($user['id']) ?>">
                                                    <button type="submit" class="btn btn-outline-danger">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
