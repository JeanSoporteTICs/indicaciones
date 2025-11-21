<?php
declare(strict_types=1);

const USERS_JS_FILE = __DIR__ . '/../assets/js/usuarios_db.js';
const USERS_JS_VAR  = 'window.UsersDB';
const ENC_METHOD    = 'AES-256-CBC';
const ENC_KEY       = 'indicaciones_medicas_super_secret_key_2024';

class UserControllerException extends RuntimeException {
    private int $status;

    public function __construct(string $message, int $status = 400) {
        parent::__construct($message, $status);
        $this->status = $status;
    }

    public function getStatusCode(): int {
        return $this->status;
    }
}

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function encryptPayload(string $plain): string {
    $ivLength = openssl_cipher_iv_length(ENC_METHOD);
    $iv = random_bytes($ivLength);
    $cipher = openssl_encrypt($plain, ENC_METHOD, ENC_KEY, OPENSSL_RAW_DATA, $iv);
    if ($cipher === false) {
        throw new RuntimeException('No se pudo cifrar la información');
    }
    return base64_encode($iv . $cipher);
}

function decryptPayload(string $encoded): string {
    $raw = base64_decode($encoded, true);
    if ($raw === false) {
        return '[]';
    }
    $ivLength = openssl_cipher_iv_length(ENC_METHOD);
    if (strlen($raw) <= $ivLength) {
        return '[]';
    }
    $iv = substr($raw, 0, $ivLength);
    $cipherText = substr($raw, $ivLength);
    $plain = openssl_decrypt($cipherText, ENC_METHOD, ENC_KEY, OPENSSL_RAW_DATA, $iv);
    return $plain === false ? '[]' : $plain;
}

function buildUsersJsContent(array $entries): string {
    $json = json_encode($entries, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    return USERS_JS_VAR . ' = ' . ($json ?: '[]') . ';' . PHP_EOL;
}

function extractUsersLiteral(string $jsContent): string {
    $pattern = '/' . preg_quote(USERS_JS_VAR, '/') . '\s*=\s*(.+);/s';
    if (preg_match($pattern, $jsContent, $matches)) {
        return trim($matches[1]);
    }
    return '';
}

function sanitizeUser(array $user): array {
    return [
        'id'        => $user['id'],
        'username'  => $user['username'],
        'nombre'    => $user['nombre'] ?? '',
        'rol'       => $user['rol'] ?? 'usuario',
        'activo'    => (bool)($user['activo'] ?? true),
        'createdAt' => $user['createdAt'] ?? null,
    ];
}

function decodeUsersFromEntries(array $entries): array {
    $users = [];
    foreach ($entries as $entry) {
        if (!is_string($entry) || $entry === '') continue;
        $decoded = decryptPayload($entry);
        $user = json_decode($decoded, true);
        if (is_array($user)) {
            $users[] = $user;
        }
    }
    return $users;
}

function loadUsers(): array {
    if (!file_exists(USERS_JS_FILE)) {
        $users = createDefaultUsers();
        saveUsers($users);
        return $users;
    }
    $contents = file_get_contents(USERS_JS_FILE);
    if ($contents === false) {
        $users = createDefaultUsers();
        saveUsers($users);
        return $users;
    }
    $literal = extractUsersLiteral($contents);
    if ($literal === '') {
        $users = createDefaultUsers();
        saveUsers($users);
        return $users;
    }
    $literal = trim($literal);
    $firstChar = $literal[0] ?? '';
    $users = [];
    if ($firstChar === '[') {
        $entries = json_decode($literal, true);
        if (is_array($entries)) {
            $users = decodeUsersFromEntries($entries);
        }
    } elseif ($firstChar === '"') {
        $encrypted = json_decode($literal, true);
        if (is_string($encrypted) && $encrypted !== '') {
            $decoded = decryptPayload($encrypted);
            $data = json_decode($decoded, true);
            if (is_array($data)) {
                $users = $data;
            }
        }
    }
    if (empty($users)) {
        $users = createDefaultUsers();
        saveUsers($users);
    }
    return $users;
}

function saveUsers(array $users): void {
    $entries = [];
    foreach ($users as $user) {
        $json = json_encode($user, JSON_UNESCAPED_UNICODE);
        if ($json === false) continue;
        $entries[] = encryptPayload($json);
    }
    $content = buildUsersJsContent($entries);
    if (file_put_contents(USERS_JS_FILE, $content, LOCK_EX) === false) {
        throw new RuntimeException('No se pudo guardar el archivo de usuarios');
    }
}

function createDefaultUsers(): array {
    return [[
        'id'           => bin2hex(random_bytes(8)),
        'username'     => 'admin',
        'nombre'       => 'Administrador',
        'rol'          => 'admin',
        'activo'       => true,
        'passwordHash' => password_hash('1234', PASSWORD_DEFAULT),
        'createdAt'    => date('c'),
    ]];
}

function findUserIndexById(array $users, string $id): int {
    foreach ($users as $index => $user) {
        if ($user['id'] === $id) {
            return $index;
        }
    }
    return -1;
}

function assertUniqueUsername(array $users, string $username, ?string $ignoreId = null): void {
    foreach ($users as $user) {
        if ($ignoreId && $user['id'] === $ignoreId) {
            continue;
        }
        if (strcasecmp($user['username'], $username) === 0) {
            throw new UserControllerException('El usuario ya existe', 422);
        }
    }
}

function ensureAdminRemaining(array $users, string $targetId): void {
    $adminCount = 0;
    foreach ($users as $user) {
        if (($user['rol'] ?? '') === 'admin' && ($user['activo'] ?? true)) {
            $adminCount++;
        }
    }
    foreach ($users as $user) {
        if ($user['id'] === $targetId && ($user['rol'] ?? '') === 'admin') {
            if ($adminCount <= 1) {
                throw new UserControllerException('Debe existir al menos un administrador activo', 422);
            }
            break;
        }
    }
}

function ensureAdminAfterUpdate(array $users, string $userId, string $newRole, bool $newActive): void {
    $adminCount = 0;
    foreach ($users as $user) {
        if (($user['rol'] ?? '') === 'admin' && ($user['activo'] ?? true)) {
            $adminCount++;
        }
    }
    foreach ($users as $user) {
        if ($user['id'] === $userId && ($user['rol'] ?? '') === 'admin') {
            if ($adminCount <= 1 && ($newRole !== 'admin' || !$newActive)) {
                throw new UserControllerException('Debe existir al menos un administrador activo', 422);
            }
            break;
        }
    }
}

function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function createUserEntry(array $payload): array {
    $username = trim((string)($payload['username'] ?? ''));
    $password = (string)($payload['password'] ?? '');
    $nombre   = trim((string)($payload['nombre'] ?? ''));
    $rol      = $payload['rol'] ?? 'usuario';
    $activo   = isset($payload['activo']) ? (bool)$payload['activo'] : true;

    if (strlen($username) < 3) {
        throw new UserControllerException('El usuario debe tener al menos 3 caracteres', 422);
    }
    if (strlen($password) < 4) {
        throw new UserControllerException('La contraseña debe tener al menos 4 caracteres', 422);
    }

    $users = loadUsers();
    assertUniqueUsername($users, $username, null);

    $newUser = [
        'id'           => bin2hex(random_bytes(8)),
        'username'     => $username,
        'nombre'       => $nombre,
        'rol'          => $rol ?: 'usuario',
        'activo'       => $activo,
        'passwordHash' => password_hash($password, PASSWORD_DEFAULT),
        'createdAt'    => date('c'),
    ];
    $users[] = $newUser;
    saveUsers($users);

    return sanitizeUser($newUser);
}

function updateUserEntry(array $payload): array {
    $id       = (string)($payload['id'] ?? '');
    $username = trim((string)($payload['username'] ?? ''));
    $password = (string)($payload['password'] ?? '');
    $nombre   = trim((string)($payload['nombre'] ?? ''));
    $rol      = $payload['rol'] ?? 'usuario';
    $activo   = isset($payload['activo']) ? (bool)$payload['activo'] : true;

    if ($id === '') {
        throw new UserControllerException('Falta el identificador del usuario', 422);
    }
    if (strlen($username) < 3) {
        throw new UserControllerException('El usuario debe tener al menos 3 caracteres', 422);
    }

    $users = loadUsers();
    $index = findUserIndexById($users, $id);
    if ($index < 0) {
        throw new UserControllerException('Usuario no encontrado', 404);
    }
    assertUniqueUsername($users, $username, $id);
    ensureAdminAfterUpdate($users, $id, $rol ?: 'usuario', $activo);

    $users[$index]['username'] = $username;
    $users[$index]['nombre']   = $nombre;
    $users[$index]['rol']      = $rol ?: 'usuario';
    $users[$index]['activo']   = $activo;
    if ($password !== '') {
        if (strlen($password) < 4) {
            throw new UserControllerException('La contraseña debe tener al menos 4 caracteres', 422);
        }
        $users[$index]['passwordHash'] = password_hash($password, PASSWORD_DEFAULT);
    }
    saveUsers($users);
    return sanitizeUser($users[$index]);
}

function deleteUserEntry(string $id): void {
    if ($id === '') {
        throw new UserControllerException('Falta el identificador del usuario', 422);
    }
    $users = loadUsers();
    $index = findUserIndexById($users, $id);
    if ($index < 0) {
        throw new UserControllerException('Usuario no encontrado', 404);
    }
    ensureAdminRemaining($users, $id);
    array_splice($users, $index, 1);
    saveUsers($users);
}

function loginUser(array $payload): array {
    $username = trim((string)($payload['username'] ?? ''));
    $password = (string)($payload['password'] ?? '');
    if ($username === '' || $password === '') {
        throw new UserControllerException('Ingrese usuario y contraseña', 422);
    }
    $users = loadUsers();
    foreach ($users as $user) {
        if (strcasecmp($user['username'], $username) === 0) {
            if (!$user['activo']) {
                throw new UserControllerException('Usuario inactivo', 403);
            }
            if (password_verify($password, $user['passwordHash'] ?? '')) {
                return sanitizeUser($user);
            }
            break;
        }
    }
    throw new UserControllerException('Credenciales incorrectas', 401);
}

function handleList(): void {
    respond(200, [
        'success' => true,
        'users'   => array_map('sanitizeUser', loadUsers()),
    ]);
}

function handleCreate(array $payload): void {
    $user = createUserEntry($payload);
    respond(201, [
        'success' => true,
        'message' => 'Usuario creado',
        'user'    => $user,
    ]);
}

function handleUpdate(array $payload): void {
    $user = updateUserEntry($payload);
    respond(200, [
        'success' => true,
        'message' => 'Usuario actualizado',
        'user'    => $user,
    ]);
}

function handleDelete(array $payload): void {
    deleteUserEntry((string)($payload['id'] ?? ''));
    respond(200, ['success' => true, 'message' => 'Usuario eliminado']);
}

function handleLogin(array $payload): void {
    $user = loginUser($payload);
    respond(200, [
        'success' => true,
        'message' => 'Acceso concedido',
        'user'    => $user,
    ]);
}

$isDirectCall = realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__;

if ($isDirectCall) {
    header('Content-Type: application/json; charset=utf-8');
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    try {
        if ($method === 'GET') {
            handleList();
        }
        if ($method === 'POST') {
            $input = getJsonInput();
            $action = $input['action'] ?? '';
            switch ($action) {
                case 'login':
                    handleLogin($input);
                    break;
                case 'create':
                    handleCreate($input);
                    break;
                case 'update':
                    handleUpdate($input);
                    break;
                case 'delete':
                    handleDelete($input);
                    break;
                default:
                    respond(400, ['success' => false, 'error' => 'Acción no soportada']);
            }
        }
        respond(405, ['success' => false, 'error' => 'Método no permitido']);
    } catch (UserControllerException $e) {
        respond($e->getStatusCode(), ['success' => false, 'error' => $e->getMessage()]);
    } catch (Throwable $e) {
        respond(500, ['success' => false, 'error' => $e->getMessage()]);
    }
}
