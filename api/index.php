<?php
declare(strict_types=1);

// La configuración real se guarda fuera de public_html y nunca se versiona.
// Hostinger puede servir el repositorio desde /domains/<dominio>/public_html;
// probamos ambos niveles sin incluir nunca credenciales en el repositorio.
$privateConfigCandidates = [
    dirname(__DIR__, 2) . '/cochemotor-private/config.php',
    dirname(__DIR__, 3) . '/cochemotor-private/config.php',
    dirname(__DIR__, 4) . '/cochemotor-private/config.php',
    dirname(__DIR__) . '/../cochemotor-private/config.php'
];
$privateConfigCandidates = array_merge($privateConfigCandidates, glob('/home/*/cochemotor-private/config.php') ?: [], glob('/home/*/domains/*/cochemotor-private/config.php') ?: []);
$privateConfigLoaded = false;
foreach ($privateConfigCandidates as $privateConfig) {
    if (is_file($privateConfig)) { require_once $privateConfig; $privateConfigLoaded = true; break; }
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: https://cochemotor.es');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

final class ApiFailure extends RuntimeException { public function __construct(public int $status,string $message){parent::__construct($message);} }
function fail(int $status, string $message): never { http_response_code($status); echo json_encode(['ok'=>false,'error'=>$message], JSON_UNESCAPED_UNICODE); exit; }
function body(): array { $data=json_decode(file_get_contents('php://input'), true); return is_array($data) ? $data : []; }
function db(): PDO {
    static $pdo;
    if ($pdo instanceof PDO) return $pdo;
    $env = static function (string $key): ?string {
        $value = getenv($key);
        if ($value !== false && $value !== '') return $value;
        return defined($key) ? (string) constant($key) : null;
    };
    $host=$env('COCHEMOTOR_DB_HOST') ?: 'localhost'; $port=$env('COCHEMOTOR_DB_PORT') ?: '3306';
    $name=$env('COCHEMOTOR_DB_NAME'); $user=$env('COCHEMOTOR_DB_USER'); $pass=$env('COCHEMOTOR_DB_PASSWORD');
    if (!$name || !$user || !$pass) fail(503,'Servicio de datos no configurado');
    try { $pdo=new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4",$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]); return $pdo; }
    catch (Throwable $e) { fail(503,'No se pudo conectar con el servicio de datos'); }
}
function jsonResponse(array $data,int $status=200): never { http_response_code($status); echo json_encode($data,JSON_UNESCAPED_UNICODE); exit; }
function textLength(string $value): int { $length=preg_match_all('/./us',$value); return $length===false?PHP_INT_MAX:$length; }
function publicSlug(string $label, string $suffix): string {
    if (function_exists('iconv')) { $ascii=iconv('UTF-8','ASCII//TRANSLIT//IGNORE',$label); if ($ascii!==false) $label=$ascii; }
    $base=strtolower(trim((string)preg_replace('/[^a-z0-9]+/i','-',$label),'-'));
    if ($base==='') $base='profesional';
    $tail=strtolower(substr((string)preg_replace('/[^a-z0-9]/i','',$suffix),-8));
    return substr($base,0,110).'-'.$tail;
}
function mailConfig(string $key, string $fallback=''): string { $value=getenv($key); if($value!==false&&$value!=='')return (string)$value; return defined($key)?(string)constant($key):$fallback; }
function oauthConfig(string $key, string $fallback=''): string { $value=getenv($key); if($value!==false&&$value!=='')return (string)$value; if(isset($_ENV[$key])&&$_ENV[$key]!=='')return (string)$_ENV[$key]; if(isset($_SERVER[$key])&&$_SERVER[$key]!=='')return (string)$_SERVER[$key]; return defined($key)?(string)constant($key):$fallback; }
function smtpCommand($socket, string $command, array $accepted): bool {
    fwrite($socket, $command."\r\n"); $reply=''; while (($line=fgets($socket,512))!==false) { $reply.=$line; if (strlen($line)<4||$line[3]===' ') break; }
    $code=(int)substr($reply,0,3); return in_array($code,$accepted,true);
}
function smtpSend(string $to, string $subject, string $text, string $html): bool {
    $host=mailConfig('COCHEMOTOR_MAIL_HOST'); $port=(int)mailConfig('COCHEMOTOR_MAIL_PORT','465'); $user=mailConfig('COCHEMOTOR_MAIL_USER','hola@cochemotor.es'); $password=mailConfig('COCHEMOTOR_MAIL_PASSWORD'); $from=mailConfig('COCHEMOTOR_MAIL_FROM',$user);
    if ($host===''||$user===''||$password==='') return false;
    $transport=$port===465?'ssl://':'tcp://'; $socket=@stream_socket_client($transport.$host.':'.$port,$errno,$error,12,STREAM_CLIENT_CONNECT); if(!$socket)return false; stream_set_timeout($socket,12);
    try {
        $line=fgets($socket,512); if($line===false||(int)substr($line,0,3)!==220)return false;
        if(!smtpCommand($socket,'EHLO cochemotor.es',[250]))return false;
        if($port!==465){ if(!smtpCommand($socket,'STARTTLS',[220])||!@stream_socket_enable_crypto($socket,true,STREAM_CRYPTO_METHOD_TLS_CLIENT)||!smtpCommand($socket,'EHLO cochemotor.es',[250]))return false; }
        if(!smtpCommand($socket,'AUTH LOGIN',[334])||!smtpCommand($socket,base64_encode($user),[334])||!smtpCommand($socket,base64_encode($password),[235]))return false;
        if(!smtpCommand($socket,'MAIL FROM:<'.$from.'>',[250])||!smtpCommand($socket,'RCPT TO:<'.$to.'>',[250,251])||!smtpCommand($socket,'DATA',[354]))return false;
        $boundary='=_cm_'.bin2hex(random_bytes(8)); $headers='From: CocheMotor <'.$from.'>\r\nTo: '.$to.'\r\nSubject: =?UTF-8?B?'.base64_encode($subject)."?=\r\nMIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary=\"$boundary\"\r\n\r\n";
        $body=$headers.'--'.$boundary."\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n".$text."\r\n--$boundary\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n".$html."\r\n--$boundary--\r\n.";
        $ok=smtpCommand($socket,$body,[250]); @fwrite($socket,"QUIT\r\n"); return $ok;
    } finally { fclose($socket); }
}
function sendVerificationEmail(string $email, string $name, string $token): bool {
    $from = mailConfig('COCHEMOTOR_MAIL_FROM','hola@cochemotor.es');
    $safeName = trim((string)preg_replace('/[\r\n]+/u', ' ', $name));
    $verificationUrl = rtrim(mailConfig('COCHEMOTOR_PUBLIC_BASE_URL','https://cochemotor.es'),'/') . '/api/auth/verify?token=' . rawurlencode($token);
    $subject = 'CocheMotor | Verifica tu correo';
    $message = "Hola {$safeName},\r\n\r\n" .
        "Para activar tu cuenta de CocheMotor y acceder a tu espacio profesional, abre este enlace:\r\n" .
        $verificationUrl . "\r\n\r\n" .
        "El enlace solo puede utilizarse una vez. Una vez verificada, tu cuenta conservará esta condición mientras permanezca activa.\r\n\r\n" .
        "Si no has solicitado esta cuenta, puedes ignorar este mensaje.\r\n\r\n" .
        "CocheMotor\r\nhttps://cochemotor.es";
    $html = '<p>Hola '.htmlspecialchars($safeName,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8').',</p><p>Activa tu cuenta profesional de CocheMotor:</p><p><a href="'.htmlspecialchars($verificationUrl,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8').'">Verificar mi correo</a></p><p>El enlace solo puede utilizarse una vez. La verificación permanecerá activa mientras tu cuenta exista.</p><p>Si no lo has solicitado, ignora este mensaje.</p>';
    return smtpSend($email,$subject,$message,$html);
}
function sendLeadNotificationEmail(string $sellerEmail, string $sellerName, string $buyerName, string $buyerPhone, string $paymentMethod, string $brand, string $model): bool {
    $safeSeller = trim((string)preg_replace('/[\r\n]+/u', ' ', $sellerName));
    $safeBuyer = trim((string)preg_replace('/[\r\n]+/u', ' ', $buyerName));
    $safeVehicle = trim($brand . ' ' . $model);
    $cleanPhone = preg_replace('/[^\d+]/', '', $buyerPhone);
    $waUrl = 'https://wa.me/' . ltrim($cleanPhone, '+') . '?text=' . rawurlencode("Hola {$safeBuyer}, te contacto de CocheMotor respecto a tu consulta sobre el {$safeVehicle}.");
    $hubUrl = rtrim(mailConfig('COCHEMOTOR_PUBLIC_BASE_URL','https://cochemotor.es'),'/') . '/hub.html';
    $paymentLabels = [
        'cash' => 'Al contado',
        'finance' => 'Financiación',
        'trade_cash' => 'Entrega de vehículo + al contado',
        'trade_finance' => 'Entrega de vehículo + financiación'
    ];
    $paymentText = $paymentLabels[$paymentMethod] ?? 'No especificado';
    $subject = "Nuevo contacto para tu {$safeVehicle} en CocheMotor";
    $message = "Hola {$safeSeller},\r\n\r\n" .
        "Has recibido una nueva consulta de un comprador interesado:\r\n\r\n" .
        "Vehículo: {$safeVehicle}\r\n" .
        "Nombre: {$safeBuyer}\r\n" .
        "Teléfono: {$buyerPhone}\r\n" .
        "Preferencia de pago: {$paymentText}\r\n\r\n" .
        "Contactar por WhatsApp: {$waUrl}\r\n\r\n" .
        "Puedes gestionar este contacto y tu inventario en tu panel profesional:\r\n" .
        $hubUrl . "\r\n\r\n" .
        "CocheMotor\r\nhttps://cochemotor.es";
    $html = '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">' .
        '<div style="background: #002D62; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">' .
        '<h2 style="color: #ffffff; margin: 0; font-size: 20px;">Nuevo contacto interesado</h2>' .
        '</div>' .
        '<div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background: #ffffff;">' .
        '<p style="font-size: 15px;">Hola <strong>' . htmlspecialchars($safeSeller, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</strong>,</p>' .
        '<p style="font-size: 15px;">Un comprador ha solicitado información sobre tu vehículo <strong>' . htmlspecialchars($safeVehicle, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</strong>:</p>' .
        '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">' .
        '<p style="margin: 0 0 8px 0;"><strong>Nombre:</strong> ' . htmlspecialchars($safeBuyer, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</p>' .
        '<p style="margin: 0 0 8px 0;"><strong>Teléfono:</strong> <a href="tel:' . htmlspecialchars($cleanPhone, ENT_QUOTES, 'UTF-8') . '" style="color: #002D62; font-weight: bold;">' . htmlspecialchars($buyerPhone, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</a></p>' .
        '<p style="margin: 0;"><strong>Preferencia de pago:</strong> ' . htmlspecialchars($paymentText, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</p>' .
        '</div>' .
        '<div style="text-align: center; margin: 28px 0;">' .
        '<a href="' . htmlspecialchars($waUrl, ENT_QUOTES, 'UTF-8') . '" style="display: inline-block; background: #18A66A; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: bold; text-decoration: none; margin-right: 10px;">Contactar por WhatsApp</a> ' .
        '<a href="' . htmlspecialchars($hubUrl, ENT_QUOTES, 'UTF-8') . '" style="display: inline-block; background: #002D62; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: bold; text-decoration: none;">Ver en el Panel</a>' .
        '</div>' .
        '<p style="font-size: 13px; color: #64748b; margin-top: 24px;">Te recomendamos responder lo antes posible. Los profesionales que contestan en menos de 30 minutos multiplican sus opciones de venta.</p>' .
        '</div>' .
        '</div>';
    return smtpSend($sellerEmail, $subject, $message, $html);
}
function token(): string { $header=$_SERVER['HTTP_AUTHORIZATION'] ?? ''; return str_starts_with($header,'Bearer ') ? trim(substr($header,7)) : ''; }
function user(): ?array { $t=token(); if (!$t) return null; $q=db()->prepare('SELECT u.user_id,u.name,u.email,u.email_verified,u.phone,u.professional_type,s.expires_at FROM professional_sessions s JOIN professional_users u ON u.user_id=s.user_id WHERE s.token=? AND s.expires_at>UTC_TIMESTAMP()'); $q->execute([$t]); $u=$q->fetch(); return $u ?: null; }
function requireUser(): array { $u=user(); if (!$u) fail(401,'Sesión no válida'); return $u; }
function configValue(string $key): string { $value=getenv($key); if($value!==false&&$value!=='')return (string)$value; return defined($key)?(string)constant($key):''; }
function requireModerator(): string {
    $secret=configValue('COCHEMOTOR_MODERATION_TOKEN');
    $actor=trim(configValue('COCHEMOTOR_MODERATION_ACTOR'));
    if(strlen($secret)<32||$actor===''||strlen($actor)>80)fail(503,'La moderación no está configurada.');
    if(!hash_equals($secret,token()))fail(401,'Autorización de moderación no válida.');
    return $actor;
}
function storeVehiclePhoto(array $file, string $directory): string {
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file((string)($file['tmp_name'] ?? ''))) throw new ApiFailure(400,'No se pudo recibir una de las fotos. Vuelve a seleccionarla.');
    if ((int)($file['size'] ?? 0) < 1 || (int)$file['size'] > 8 * 1024 * 1024) throw new ApiFailure(400,'Cada foto debe ocupar como máximo 8 MB.');
    if(!function_exists('getimagesize')||!defined('IMAGETYPE_WEBP'))throw new ApiFailure(503,'La validación de fotos no está disponible en este servidor.');
    $info=@getimagesize((string)$file['tmp_name']);
    $allowed=[IMAGETYPE_JPEG,IMAGETYPE_PNG,IMAGETYPE_WEBP];
    if (!$info || !in_array($info[2] ?? 0,$allowed,true)) throw new ApiFailure(400,'Usa una foto JPG, PNG o WebP válida.');
    $width=(int)($info[0]??0); $height=(int)($info[1]??0);
    if ($width<1 || $height<1 || $width*$height>12000000) throw new ApiFailure(400,'La resolución de la foto es demasiado alta. Elige una imagen más pequeña.');
    if (!function_exists('imagecreatefromstring') || !function_exists('imagewebp')) throw new ApiFailure(503,'La carga de fotos no está disponible en este servidor.');
    $raw=@file_get_contents((string)$file['tmp_name']);
    $image=$raw===false?false:@imagecreatefromstring($raw);
    if ($image===false) throw new ApiFailure(400,'La foto está dañada o no se puede leer. Prueba con otra.');
    if (!is_dir($directory) && !@mkdir($directory,0755,true) && !is_dir($directory)) { imagedestroy($image); throw new ApiFailure(503,'No se pudo preparar el almacenamiento de fotos.'); }
    $filename=bin2hex(random_bytes(20)).'.webp'; $destination=rtrim($directory,DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$filename;
    $maxSide=1800; $scale=min(1,$maxSide/max($width,$height));
    if ($scale<1) { $resized=imagecreatetruecolor((int)round($width*$scale),(int)round($height*$scale)); imagecopyresampled($resized,$image,0,0,0,0,imagesx($resized),imagesy($resized),$width,$height); imagedestroy($image); $image=$resized; }
    $saved=@imagewebp($image,$destination,82); imagedestroy($image);
    if (!$saved || !is_file($destination)) { @unlink($destination); throw new ApiFailure(500,'No se pudo guardar una de las fotos.'); }
    return $filename;
}

$path=parse_url($_SERVER['REQUEST_URI'] ?? '/',PHP_URL_PATH); $route=preg_replace('#^.*/api#','/api',$path); $method=$_SERVER['REQUEST_METHOD'];
$contentType=strtolower($_SERVER['CONTENT_TYPE']??'');
$data=str_starts_with($contentType,'multipart/form-data')?[]:body();
if($method==='POST'&&$route==='/api/vehicles'&&str_starts_with($contentType,'multipart/form-data')&&(int)($_SERVER['CONTENT_LENGTH']??0)>0&&!$_POST&&!$_FILES)fail(413,'La carga supera el límite del servidor. Prueba con menos fotos o imágenes más pequeñas.');
if ($method === 'POST' && $route === '/api/coche-ideal') {
    $length = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($length < 2 || $length > 16000) fail($length > 16000 ? 413 : 400, 'No se pudieron leer los datos de la búsqueda.');
    $request = $data;
    if (trim((string)($request['website'] ?? '')) !== '') fail(400, 'No se pudo enviar la búsqueda.');
    $vehicle = is_array($request['vehicle'] ?? null) ? $request['vehicle'] : [];
    $preferences = is_array($request['preferences'] ?? null) ? $request['preferences'] : [];
    $contact = is_array($request['contact'] ?? null) ? $request['contact'] : [];
    $consent = is_array($request['consent'] ?? null) ? $request['consent'] : [];
    $brand = trim((string)($vehicle['brand'] ?? ''));
    $model = trim((string)($vehicle['model'] ?? ''));
    $name = trim((string)($contact['name'] ?? ''));
    $email = strtolower(trim((string)($contact['email'] ?? '')));
    $phone = trim((string)($contact['phone'] ?? ''));
    $channels = $contact['channels'] ?? null;
    $schedule = trim((string)($contact['schedule'] ?? ''));
    $preferredTime = trim((string)($contact['preferredTime'] ?? ''));
    $budgetMax = $preferences['budgetMax'] ?? null;
    $budgetMin = $preferences['budgetMin'] ?? null;
    $year = $preferences['minYear'] ?? ($vehicle['year'] ?? null);
    $fuelValue = trim((string)($preferences['fuel'] ?? 'Indiferente'));
    $gearboxValue = trim((string)($preferences['gearbox'] ?? 'Indiferente'));
    $bodyValue = trim((string)($preferences['bodyType'] ?? ''));
    $need = is_array($preferences['need'] ?? null) ? $preferences['need'] : [];
    $needId = trim((string)($need['id'] ?? ''));
    $needLabel = trim((string)($need['label'] ?? ''));
    $matchedCategories = $preferences['matchedCategories'] ?? null;
    $allowedNeeds = ['city', 'family', 'travel', 'adventure', 'work', 'leisure', 'camper', 'motorcycle'];
    $allowedCategories = ['urban', 'fastback', 'family', 'suv', 'coupe4x4', 'offroad', 'convertible', 'minivan', 'van', 'pickup', 'camper', 'motorcycle'];
    $needCategoryMap = [
        'city' => ['urban'], 'family' => ['family', 'minivan', 'suv'],
        'travel' => ['fastback', 'family', 'suv'], 'adventure' => ['suv', 'offroad', 'coupe4x4'],
        'work' => ['van', 'pickup'], 'leisure' => ['convertible', 'fastback', 'coupe4x4'],
        'camper' => ['camper'], 'motorcycle' => ['motorcycle']
    ];
    $communityId = trim((string)($preferences['communityId'] ?? ''));
    $provinceId = trim((string)($preferences['provinceId'] ?? ''));
    $allowedFuel = ['Indiferente', 'Gasolina', 'Diésel', 'Híbrido', 'Híbrido enchufable', 'Eléctrico'];
    $allowedGearbox = ['Indiferente', 'Manual', 'Automático'];
    $allowedChannels = ['email', 'whatsapp', 'call'];
    $validChannels = is_array($channels) && count($channels) >= 1 && count($channels) <= 3 &&
        count(array_filter($channels, static fn($channel): bool => !is_string($channel))) === 0 &&
        count(array_unique($channels)) === count($channels) && !array_diff($channels, $allowedChannels);
    $validSchedule = in_array($schedule, ['flexible', 'preferred'], true) &&
        (($schedule === 'preferred' && in_array($preferredTime, ['morning', 'midday', 'afternoon'], true)) ||
         ($schedule === 'flexible' && $preferredTime === ''));
    if (textLength($brand) > 80 || textLength($model) > 120 ||
        !in_array($needId, $allowedNeeds, true) || textLength($needLabel) < 2 || textLength($needLabel) > 80 ||
        !is_array($matchedCategories) || count($matchedCategories) < 1 || count($matchedCategories) > 4 ||
        count(array_filter($matchedCategories, static fn($category): bool => !is_string($category))) > 0 ||
        count(array_unique($matchedCategories)) !== count($matchedCategories) ||
        array_diff($matchedCategories, $allowedCategories) || array_diff($matchedCategories, $needCategoryMap[$needId] ?? []) || ($preferences['matchingStrategy'] ?? null) !== 'rules-v1' ||
        !is_numeric($budgetMax) || (float)$budgetMax < 500 || (float)$budgetMax > 1000000 ||
        ($budgetMin !== null && (!is_numeric($budgetMin) || (float)$budgetMin < 0 || (float)$budgetMin > (float)$budgetMax)) ||
        ($year !== null && $year !== '' && (!is_numeric($year) || (int)$year < 1950 || (int)$year > (int)gmdate('Y') + 1)) ||
        !in_array($fuelValue, $allowedFuel, true) || !in_array($gearboxValue, $allowedGearbox, true) || textLength($bodyValue) > 80 ||
        textLength($communityId) > 8 || textLength($provinceId) > 8 ||
        textLength($name) < 2 || textLength($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL) ||
        textLength($email) > 254 || textLength($phone) > 32 || !$validChannels || !$validSchedule ||
        ((in_array('whatsapp', $channels ?? [], true) || in_array('call', $channels ?? [], true)) && textLength($phone) < 6) ||
        ($consent['privacy'] ?? null) !== true || ($consent['contact'] ?? null) !== true) {
        fail(400, 'Revisa el coche, el presupuesto, tus datos y los consentimientos.');
    }
    $clean = [
        'vehicle' => [
            'brand' => $brand,
            'model' => $model,
            'version' => '',
            'year' => ($year !== null && $year !== '') ? (int)$year : null,
            'fuel' => $fuelValue
        ],
        'preferences' => [
            'budgetMin' => ($budgetMin !== null && $budgetMin !== '') ? (float)$budgetMin : null,
            'budgetMax' => (float)$budgetMax,
            'fuel' => $fuelValue,
            'gearbox' => $gearboxValue,
            'minYear' => ($year !== null && $year !== '') ? (int)$year : null,
            'need' => ['id' => $needId, 'label' => $needLabel],
            'matchedCategories' => array_values($matchedCategories),
            'matchingStrategy' => 'rules-v1',
            'bodyType' => $bodyValue,
            'timing' => 'Indiferente',
            'communityId' => $communityId,
            'community' => trim((string)($preferences['community'] ?? '')),
            'provinceId' => $provinceId,
            'province' => trim((string)($preferences['province'] ?? '')),
            'acceptsNearby' => ($preferences['acceptsNearby'] ?? false) === true
        ],
        'contact' => [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'channels' => array_values($channels),
            'schedule' => $schedule,
            'preferredTime' => $preferredTime,
            'communityId' => trim((string)($contact['communityId'] ?? '')),
            'provinceId' => trim((string)($contact['provinceId'] ?? '')),
            'province' => trim((string)($contact['province'] ?? '')),
            'municipalityId' => ''
        ],
        'consent' => ['privacy' => true, 'contact' => true],
        'consentVersion' => 'coche-ideal-v4'
    ];
    $fingerprint = hash('sha256', bin2hex(random_bytes(32)));
    $requestId = 'ci-' . bin2hex(random_bytes(16));
    $pdo = db();
    try {
        $pdo->beginTransaction();
        $duplicate = $pdo->prepare("SELECT request_id FROM coche_ideal_requests WHERE created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY) AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.contact.email'))) = ? AND JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.preferences.need.id')) = ? AND JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.preferences.matchedCategories')) = ? AND CAST(JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.preferences.budgetMax')) AS DECIMAL(12,2)) = ? AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.preferences.fuel'))) = ? AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.preferences.gearbox'))) = ? AND COALESCE(JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.preferences.provinceId')), '') = ? LIMIT 1");
        $duplicate->execute([$email, $needId, json_encode(array_values($matchedCategories), JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), (float)$budgetMax, strtolower($clean['preferences']['fuel']), strtolower($clean['preferences']['gearbox']), $clean['preferences']['provinceId']]);
        $existingId = $duplicate->fetchColumn();
        if ($existingId) {
            $pdo->rollBack();
            jsonResponse(['ok' => false, 'duplicate' => true], 409);
        }
        $insert = $pdo->prepare("INSERT INTO coche_ideal_requests(request_id,tenant_id,fingerprint,payload_json,status,consent_version) VALUES(?, 'public-intake', ?, ?, 'nueva', ?)");
        $insert->execute([$requestId, $fingerprint, json_encode($clean, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), $clean['consentVersion']]);
        $history = $pdo->prepare("INSERT INTO coche_ideal_status_history(request_id,previous_status,new_status,actor) VALUES(?,NULL,'nueva','public-intake')");
        $history->execute([$requestId]);
        $pdo->commit();
        jsonResponse(['ok' => true, 'id' => $requestId, 'status' => 'nueva'], 201);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        fail(503, 'No se pudo guardar la búsqueda ahora. Vuelve a intentarlo en unos minutos.');
    }
}
try {
    if ($route==='/api/moderation/vehicles' && $method==='POST') {
        $actor=requireModerator();
        $vehicleId=trim((string)($data['vehicle_id']??''));
        $contactId=trim((string)($data['contact_id']??''));
        $decision=(string)($data['decision']??'');
        $note=trim((string)($data['note']??''));
        if(!preg_match('/^[A-Za-z0-9_-]{1,80}$/',$vehicleId)||!in_array($decision,['approve','unpublish'],true)||textLength($note)<8||textLength($note)>500)fail(400,'Indica un anuncio, una acción permitida y una nota de revisión (8–500 caracteres).');
        if($decision==='approve'&&!preg_match('/^[A-Za-z0-9_-]{1,80}$/',$contactId))fail(400,'Indica el contacto concreto que has verificado.');
        $pdo=db();
        try {
            $pdo->beginTransaction();
            $q=$pdo->prepare('SELECT v.stage,v.status,u.email_verified FROM vehicles v JOIN professional_users u ON u.user_id=v.tenant_id WHERE v.vehicle_id=? FOR UPDATE');
            $q->execute([$vehicleId]); $vehicle=$q->fetch();
            if(!$vehicle){$pdo->rollBack();fail(404,'No encontramos ese anuncio.');}
            if($decision==='approve') {
                if(!(bool)$vehicle['email_verified']){ $pdo->rollBack(); fail(409,'La cuenta profesional aún no ha verificado su correo.'); }
                if($vehicle['stage']==='publicado'&&$vehicle['status']==='disponible'){ $pdo->rollBack(); fail(409,'El anuncio ya está publicado.'); }
                if(!in_array($vehicle['status'],['pendiente_revision','inactivo'],true)){ $pdo->rollBack(); fail(409,'El estado actual del anuncio no permite aprobarlo.'); }
                $contact=$pdo->prepare('SELECT contact_id FROM publication_contacts WHERE vehicle_id=? AND contact_id=? FOR UPDATE');
                $contact->execute([$vehicleId,$contactId]);
                if(!$contact->fetchColumn()){$pdo->rollBack();fail(409,'Ese contacto no pertenece al anuncio o ya no está disponible.');}
                $pdo->prepare('UPDATE publication_contacts SET contact_verified=1,contact_verified_at=UTC_TIMESTAMP() WHERE vehicle_id=? AND contact_id=?')->execute([$vehicleId,$contactId]);
                $pdo->prepare("UPDATE vehicles SET stage='publicado',status='disponible' WHERE vehicle_id=?")->execute([$vehicleId]);
                $newStage='publicado'; $newStatus='disponible';
            } else {
                if($vehicle['stage']==='retirado'&&$vehicle['status']==='inactivo'){ $pdo->rollBack(); fail(409,'El anuncio ya está retirado.'); }
                $pdo->prepare("UPDATE vehicles SET stage='retirado',status='inactivo' WHERE vehicle_id=?")->execute([$vehicleId]);
                $newStage='retirado'; $newStatus='inactivo';
            }
            $audit=$pdo->prepare('INSERT INTO vehicle_moderation_history(vehicle_id,actor,decision,previous_stage,new_stage,previous_status,new_status,note) VALUES(?,?,?,?,?,?,?,?)');
            $audit->execute([$vehicleId,$actor,$decision,(string)$vehicle['stage'],$newStage,(string)$vehicle['status'],$newStatus,$note]);
            $pdo->commit();
            jsonResponse(['ok'=>true,'id'=>$vehicleId,'stage'=>$newStage,'status'=>$newStatus],200);
        } catch(ApiFailure $e) { if($pdo->inTransaction())$pdo->rollBack(); throw $e; }
          catch(Throwable $e) { if($pdo->inTransaction())$pdo->rollBack(); throw $e; }
    }
    if ($route==='/api/public/vehicles' && $method==='GET') {
        $filterId = trim((string)($_GET['id'] ?? ''));
        $filterSlug = trim((string)($_GET['slug'] ?? ''));
        $whereExtra = '';
        $params = [];
        if ($filterId !== '') {
            $whereExtra = ' AND v.vehicle_id = ?';
            $params[] = $filterId;
        } elseif ($filterSlug !== '') {
            $whereExtra = ' AND v.public_slug = ?';
            $params[] = $filterSlug;
        }
        $q=db()->prepare("SELECT v.vehicle_id,v.brand,v.model,v.version,v.year,v.mileage_km,v.cash_price,v.dgt_badge,v.public_slug,v.metadata_json,d.display_name,d.dealer_slug,d.public_profile,d.public_profile_consent_version,d.public_description FROM vehicles v JOIN dealerships d ON d.tenant_id=v.tenant_id JOIN professional_users u ON u.user_id=v.tenant_id WHERE (v.status='disponible' AND v.stage='publicado' AND u.email_verified=1 OR v.status='proxima_entrada' AND v.stage='publicado' AND u.email_verified=1) AND EXISTS (SELECT 1 FROM publication_contacts pc WHERE pc.vehicle_id=v.vehicle_id AND pc.contact_verified=1)" . $whereExtra . " ORDER BY v.updated_at DESC LIMIT 200");
        $q->execute($params);
        $rows=$q->fetchAll(); $images=db()->prepare('SELECT image_url FROM vehicle_images WHERE vehicle_id=? ORDER BY sort_order LIMIT 10'); $items=[];
        foreach($rows as $row) {
            $meta=json_decode((string)$row['metadata_json'],true); if(!is_array($meta))$meta=[];
            $images->execute([$row['vehicle_id']]); $photoRows=$images->fetchAll(PDO::FETCH_COLUMN);
            $safePhotos=array_values(array_filter(array_map(static fn($path)=>preg_match('#^uploads/vehicles/[a-f0-9]{40}\.webp$#',(string)$path)?'/'.$path:null,$photoRows)));
            $badge=(string)$row['dgt_badge']; $badgeClass=match($badge){'0','Cero'=>'badge-zero','ECO'=>'badge-eco','B'=>'badge-b','C'=>'badge-c',default=>'badge-c'};
            $dealerIsPublic=(int)$row['public_profile']===1&&$row['public_profile_consent_version']==='public-profile-v1'&&textLength(trim((string)($row['public_description']??'')))>=80;
            $items[]=['id'=>$row['vehicle_id'],'publicSlug'=>$row['public_slug'],'publicUrl'=>'/vehiculos/'.$row['public_slug'],'brand'=>$row['brand'],'model'=>$row['model'],'version'=>$row['version'],'year'=>(int)$row['year'],'km'=>number_format((int)$row['mileage_km'],0,',','.').' km','price'=>(float)$row['cash_price'],'badge'=>$badge,'badgeClass'=>$badgeClass,'fuel'=>(string)($meta['fuel']??''),'gearbox'=>(string)($meta['gearbox']??''),'location'=>(string)($meta['location']??''),'province'=>(string)($meta['province']??''),'image'=>$safePhotos[0]??'assets/brand/icons/vehicle-placeholder.svg','photos'=>$safePhotos,'dealer'=>$row['display_name'],'publicDealerSlug'=>$dealerIsPublic?$row['dealer_slug']:null,'isDemo'=>false,'status'=>(string)$row['status'],'publicationState'=>(string)($meta['publication_state']??$row['status'])];
        }
        jsonResponse(['vehicles'=>$items]);
    }
    if ($route==='/api/vehicles' && $method==='GET') {
        $u=requireUser();
        $q=db()->prepare('SELECT vehicle_id,tenant_id,brand,model,version,year,mileage_km,cash_price,dgt_badge,stage,evidence_level,status,public_slug,metadata_json FROM vehicles WHERE tenant_id=? ORDER BY updated_at DESC LIMIT 200');
        $q->execute([$u['user_id']]); $items=[];
        foreach($q->fetchAll() as $row){
            $metadata=json_decode((string)($row['metadata_json']??''),true);if(!is_array($metadata))$metadata=[];
            $imageQuery=db()->prepare('SELECT image_url FROM vehicle_images WHERE vehicle_id=? ORDER BY sort_order LIMIT 10');$imageQuery->execute([$row['vehicle_id']]);
            $images=array_values(array_filter(array_map(static function($path){$path=(string)$path;return preg_match('#^uploads/vehicles/[a-f0-9]{40}\.webp$#',$path)?'/'.$path:null;},$imageQuery->fetchAll(PDO::FETCH_COLUMN))));
            $items[]=['id'=>$row['vehicle_id'],'userId'=>$u['user_id'],'brand'=>$row['brand'],'model'=>$row['model'],'version'=>$row['version'],'year'=>(int)$row['year'],'km'=>number_format((int)$row['mileage_km'],0,',','.').' km','price'=>(float)$row['cash_price'],'badge'=>$row['dgt_badge'],'stage'=>$row['stage'],'status'=>$row['status'],'evidenceLevel'=>$row['evidence_level'],'public_slug'=>$row['public_slug'],'fuel'=>(string)($metadata['fuel']??''),'gearbox'=>(string)($metadata['gearbox']??''),'location'=>(string)($metadata['location']??''),'province'=>(string)($metadata['province']??''),'images'=>$images,'image'=>$images[0]??'assets/brand/icons/vehicle-placeholder.svg','isDemo'=>false];
        }
        jsonResponse(['vehicles'=>$items]);
    }
    if ($route==='/api/vehicles' && ($method==='PATCH' || ($method==='POST' && isset($data['action']) && $data['action']==='update_stage'))) {
        $u=requireUser();
        $vehicleId=trim((string)($data['vehicle_id']??''));
        if(!preg_match('/^[A-Za-z0-9_-]{1,80}$/',$vehicleId)) fail(400,'Identificador de vehículo no válido.');
        $pdo=db();
        $q=$pdo->prepare('SELECT vehicle_id,stage,status FROM vehicles WHERE vehicle_id=? AND tenant_id=? LIMIT 1');
        $q->execute([$vehicleId,$u['user_id']]);
        $veh=$q->fetch();
        if(!$veh) fail(404,'Vehículo no encontrado en tu inventario.');
        $newStage=trim((string)($data['stage']??$veh['stage']));
        $allowedStages=['pendiente_validacion_contacto','preparacion','publicado','leads_activos','prueba_en_taller','reservado','vendido','retirado'];
        if(!in_array($newStage,$allowedStages,true)) fail(400,'Fase de ciclo de vida no válida.');
        $newStatus=match($newStage){
            'vendido'=>'vendido',
            'reservado'=>'reservado',
            'retirado'=>'inactivo',
            default=>'disponible'
        };
        if((bool)$u['email_verified']&&in_array($newStage,['publicado','leads_activos','prueba_en_taller','reservado','vendido'],true)){
            try { $pdo->prepare('UPDATE publication_contacts SET contact_verified=1,contact_verified_at=UTC_TIMESTAMP() WHERE vehicle_id=? AND user_id=?')->execute([$vehicleId,$u['user_id']]); } catch(Throwable $e){}
        }
        $stmt=$pdo->prepare('UPDATE vehicles SET stage=?,status=?,updated_at=UTC_TIMESTAMP() WHERE vehicle_id=? AND tenant_id=?');
        $stmt->execute([$newStage,$newStatus,$vehicleId,$u['user_id']]);
        jsonResponse(['ok'=>true,'id'=>$vehicleId,'stage'=>$newStage,'status'=>$newStatus]);
    }
    if ($route==='/api/health' && $method==='GET') { db()->query('SELECT 1'); jsonResponse(['ok'=>true,'service'=>'cochemotor']); }
    if ($route==='/api/auth/verify' && $method==='GET') {
        $verificationToken=(string)($_GET['token']??'');
        if (!preg_match('/^[a-f0-9]{64}$/', $verificationToken)) fail(400,'El enlace de verificación no es válido.');
        $q=db()->prepare("UPDATE professional_users SET email_verified=1,verification_token=NULL,verification_used_at=UTC_TIMESTAMP(),email_status='verified' WHERE verification_token_hash=? AND email_verified=0 AND verification_used_at IS NULL"); $q->execute([hash('sha256',$verificationToken)]);
        if ($q->rowCount()!==1) fail(400,'El enlace ya se ha utilizado o no es válido.');
        header('Location: https://cochemotor.es/acceso.html?audience=professional&return=hub&verified=1', true, 303);
        exit;
    }
function ensureOAuthSchema(PDO $pdo): void {
    static $ensured = false;
    if ($ensured) return;
    try {
        $pdo->exec("ALTER TABLE professional_users MODIFY password_hash VARCHAR(255) NULL");
    } catch (Throwable $e) {}
    try {
        $pdo->exec("ALTER TABLE professional_users MODIFY verification_token VARCHAR(255) NULL");
    } catch (Throwable $e) {}
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS oauth_identities (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(80) NOT NULL,
            provider VARCHAR(32) NOT NULL,
            provider_user_id VARCHAR(191) NOT NULL,
            email VARCHAR(254) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_oauth_user FOREIGN KEY (user_id) REFERENCES professional_users(user_id) ON DELETE CASCADE,
            UNIQUE KEY uq_provider_uid (provider, provider_user_id),
            INDEX idx_oauth_user_id (user_id),
            INDEX idx_oauth_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    } catch (Throwable $e) {}
    $ensured = true;
}

    if (preg_match('#^/api/auth/oauth/(google|apple|facebook)$#', $route, $matches) && $method === 'GET') {
        $provider = $matches[1];
        $audience = ($_GET['audience'] ?? 'buyer') === 'professional' ? 'professional' : 'buyer';
        $return = preg_replace('/[^a-zA-Z0-9_\-\/]/', '', (string)($_GET['return'] ?? 'hub'));
        if ($return === '') $return = 'hub';

        $apiBase = rtrim(oauthConfig('COCHEMOTOR_OAUTH_REDIRECT_BASE', 'https://cochemotor.es'), '/');
        $webBase = rtrim(oauthConfig('COCHEMOTOR_FRONTEND_URL', 'https://cochemotor.es'), '/');
        $redirectUri = $apiBase . '/api/auth/callback/' . $provider;

        $clientId = '';
        if ($provider === 'google') $clientId = oauthConfig('GOOGLE_CLIENT_ID');
        elseif ($provider === 'apple') $clientId = oauthConfig('APPLE_CLIENT_ID');
        elseif ($provider === 'facebook') $clientId = oauthConfig('FACEBOOK_CLIENT_ID', oauthConfig('FACEBOOK_APP_ID'));

        if ($provider === 'apple' || $provider === 'facebook') {
            header("Location: {$webBase}/acceso", true, 303);
            exit;
        }

        if ($clientId === '') {
            $names = ['google' => 'Google', 'apple' => 'Apple', 'facebook' => 'Facebook'];
            $providerName = $names[$provider] ?? $provider;
            $msg = rawurlencode("El acceso con {$providerName} requiere configuración en el servidor. Por favor, accede con tu correo electrónico.");
            header("Location: {$webBase}/acceso?audience={$audience}&return={$return}&oauth_error={$msg}", true, 303);
            exit;
        }

        $stateData = bin2hex(random_bytes(16)) . '.' . base64_encode((string)json_encode(['provider' => $provider, 'audience' => $audience, 'return' => $return, 'redirect_uri' => $redirectUri]));
        setcookie('cm_oauth_state', $stateData, [
            'expires' => time() + 900,
            'path' => '/',
            'domain' => '',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);

        $authUrl = '';
        if ($provider === 'google') {
            $authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
                'client_id' => $clientId,
                'redirect_uri' => $redirectUri,
                'response_type' => 'code',
                'scope' => 'openid email profile',
                'state' => $stateData,
                'prompt' => 'select_account'
            ]);
        } elseif ($provider === 'apple') {
            $authUrl = 'https://appleid.apple.com/auth/authorize?' . http_build_query([
                'client_id' => $clientId,
                'redirect_uri' => $redirectUri,
                'response_type' => 'code id_token',
                'response_mode' => 'form_post',
                'scope' => 'name email',
                'state' => $stateData
            ]);
        } elseif ($provider === 'facebook') {
            $authUrl = 'https://www.facebook.com/v19.0/dialog/oauth?' . http_build_query([
                'client_id' => $clientId,
                'redirect_uri' => $redirectUri,
                'response_type' => 'code',
                'scope' => 'email,public_profile',
                'state' => $stateData
            ]);
        }

        header("Location: {$authUrl}", true, 302);
        exit;
    }
    if (preg_match('#^/api/auth/callback/(google|apple|facebook)$#', $route, $matches) && ($method === 'GET' || $method === 'POST')) {
        $provider = $matches[1];
        $apiBase = rtrim(oauthConfig('COCHEMOTOR_OAUTH_REDIRECT_BASE', 'https://cochemotor.es'), '/');
        $webBase = rtrim(oauthConfig('COCHEMOTOR_FRONTEND_URL', 'https://cochemotor.es'), '/');
        $baseUrl = $webBase;
        $redirectUri = $apiBase . '/api/auth/callback/' . $provider;

        $state = (string)($_REQUEST['state'] ?? '');
        $savedState = (string)($_COOKIE['cm_oauth_state'] ?? '');
        setcookie('cm_oauth_state', '', ['expires' => time() - 3600, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);

        $stateMeta = [];
        if ($state !== '' && strpos($state, '.') !== false) {
            $parts = explode('.', $state, 2);
            $decoded = json_decode(base64_decode($parts[1]), true);
            if (is_array($decoded)) $stateMeta = $decoded;
        }
        if (!empty($stateMeta['redirect_uri'])) {
            $redirectUri = (string)$stateMeta['redirect_uri'];
        }
        $audience = ($stateMeta['audience'] ?? 'buyer') === 'professional' ? 'professional' : 'buyer';
        $return = preg_replace('/[^a-zA-Z0-9_\-\/]/', '', (string)($stateMeta['return'] ?? 'hub'));
        if ($return === '') $return = 'hub';

        $err = (string)($_REQUEST['error'] ?? $_REQUEST['error_description'] ?? '');
        if ($err !== '') {
            $msg = rawurlencode('Acceso cancelado por el usuario o rechazado por el proveedor.');
            header("Location: {$baseUrl}/acceso?audience={$audience}&return={$return}&oauth_error={$msg}", true, 303);
            exit;
        }

        if ($state === '' || $savedState === '' || !hash_equals($savedState, $state)) {
            $msg = rawurlencode('La sesión de autorización expiró o no es válida. Por favor, inténtalo de nuevo.');
            header("Location: {$baseUrl}/acceso?audience={$audience}&return={$return}&oauth_error={$msg}", true, 303);
            exit;
        }

        $code = (string)($_REQUEST['code'] ?? '');
        if ($code === '') {
            $msg = rawurlencode('No se recibió el código de autorización del proveedor.');
            header("Location: {$baseUrl}/acceso?audience={$audience}&return={$return}&oauth_error={$msg}", true, 303);
            exit;
        }

        try {
            $oauthUser = null;

            if ($provider === 'google') {
                $clientId = oauthConfig('GOOGLE_CLIENT_ID');
                $clientSecret = oauthConfig('GOOGLE_CLIENT_SECRET');
                if ($clientId === '' || $clientSecret === '') {
                    $msg = rawurlencode('Credenciales de Google no configuradas.');
                    header("Location: {$baseUrl}/acceso?audience={$audience}&return={$return}&oauth_error={$msg}", true, 303);
                    exit;
                }

                $tokenParams = [
                    'code' => $code,
                    'client_id' => $clientId,
                    'client_secret' => $clientSecret,
                    'redirect_uri' => $redirectUri,
                    'grant_type' => 'authorization_code'
                ];
                $tokenPost = http_build_query($tokenParams);
                $res = false;
                $curlErr = '';
                if (function_exists('curl_init')) {
                    $ch = curl_init('https://oauth2.googleapis.com/token');
                    curl_setopt_array($ch, [
                        CURLOPT_POST => true,
                        CURLOPT_POSTFIELDS => $tokenPost,
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_TIMEOUT => 15,
                        CURLOPT_SSL_VERIFYPEER => true,
                        CURLOPT_SSL_VERIFYHOST => 2,
                        CURLOPT_HTTPHEADER => [
                            'Content-Type: application/x-www-form-urlencoded',
                            'Accept: application/json',
                            'User-Agent: CocheMotor/1.0'
                        ]
                    ]);
                    $res = curl_exec($ch);
                    $curlErr = curl_error($ch);
                    curl_close($ch);
                }
                if ($res === false || $res === '') {
                    $opts = [
                        'http' => [
                            'method' => 'POST',
                            'header' => "Content-Type: application/x-www-form-urlencoded\r\nAccept: application/json\r\nUser-Agent: CocheMotor/1.0\r\n",
                            'content' => $tokenPost,
                            'timeout' => 15,
                            'ignore_errors' => true
                        ]
                    ];
                    $res = @file_get_contents('https://oauth2.googleapis.com/token', false, stream_context_create($opts));
                }

                $tokenData = json_decode((string)$res, true);
                $accessToken = $tokenData['access_token'] ?? '';
                if ($accessToken === '') {
                    $errDesc = $tokenData['error_description'] ?? $tokenData['error'] ?? $curlErr ?? 'Error de validación';
                    $msg = rawurlencode("No se pudo validar el acceso con Google ({$errDesc}).");
                    header("Location: {$baseUrl}/acceso?audience={$audience}&return={$return}&oauth_error={$msg}", true, 303);
                    exit;
                }

                $info = null;
                if (function_exists('curl_init')) {
                    $ch = curl_init('https://www.googleapis.com/oauth2/v3/userinfo');
                    curl_setopt_array($ch, [
                        CURLOPT_HTTPHEADER => [
                            'Authorization: Bearer ' . $accessToken,
                            'Accept: application/json',
                            'User-Agent: CocheMotor/1.0'
                        ],
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_TIMEOUT => 15,
                        CURLOPT_SSL_VERIFYPEER => true,
                        CURLOPT_SSL_VERIFYHOST => 2
                    ]);
                    $res = curl_exec($ch);
                    $curl_close = curl_close($ch);
                    $info = json_decode((string)$res, true);
                }
                if (!is_array($info) || empty($info['sub'])) {
                    $opts = [
                        'http' => [
                            'method' => 'GET',
                            'header' => "Authorization: Bearer {$accessToken}\r\nAccept: application/json\r\nUser-Agent: CocheMotor/1.0\r\n",
                            'timeout' => 15,
                            'ignore_errors' => true
                        ]
                    ];
                    $res = @file_get_contents('https://www.googleapis.com/oauth2/v3/userinfo', false, stream_context_create($opts));
                    $info = json_decode((string)$res, true);
                }

                if (is_array($info) && !empty($info['sub']) && !empty($info['email'])) {
                    $oauthUser = [
                        'provider_uid' => (string)$info['sub'],
                        'email' => strtolower(trim((string)$info['email'])),
                        'name' => trim((string)($info['name'] ?? explode('@', (string)$info['email'])[0]))
                    ];
                }
            } elseif ($provider === 'facebook') {
                $appId = oauthConfig('FACEBOOK_CLIENT_ID', oauthConfig('FACEBOOK_APP_ID'));
                $appSecret = oauthConfig('FACEBOOK_CLIENT_SECRET');
                if ($appId === '' || $appSecret === '') {
                    $msg = rawurlencode('Credenciales de Facebook no configuradas.');
                    header("Location: {$baseUrl}/acceso?audience={$audience}&return={$return}&oauth_error={$msg}", true, 303);
                    exit;
                }

                $tokenUrl = 'https://graph.facebook.com/v19.0/oauth/access_token?' . http_build_query([
                    'client_id' => $appId,
                    'client_secret' => $appSecret,
                    'redirect_uri' => $redirectUri,
                    'code' => $code
                ]);
                $ch = curl_init($tokenUrl);
                curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10]);
                $res = curl_exec($ch);
                curl_close($ch);
                $tokenData = json_decode((string)$res, true);
                $accessToken = $tokenData['access_token'] ?? '';
                if ($accessToken !== '') {
                    $meUrl = 'https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=' . urlencode($accessToken);
                    $ch = curl_init($meUrl);
                    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10]);
                    $info = json_decode((string)curl_exec($ch), true);
                    curl_close($ch);
                    if (is_array($info) && !empty($info['id'])) {
                        $email = strtolower(trim((string)($info['email'] ?? '')));
                        if ($email === '') $email = 'fb_' . $info['id'] . '@cochemotor.es';
                        $oauthUser = [
                            'provider_uid' => (string)$info['id'],
                            'email' => $email,
                            'name' => trim((string)($info['name'] ?? 'Usuario Facebook'))
                        ];
                    }
                }
            } elseif ($provider === 'apple') {
                $idToken = (string)($_REQUEST['id_token'] ?? '');
                if ($idToken !== '') {
                    $parts = explode('.', $idToken);
                    if (count($parts) >= 2) {
                        $payload = json_decode(base64_decode(str_replace(['-','_'], ['+','/'], $parts[1])), true);
                        if (is_array($payload) && !empty($payload['sub'])) {
                            $email = strtolower(trim((string)($payload['email'] ?? '')));
                            if ($email === '') $email = 'apple_' . $payload['sub'] . '@cochemotor.es';
                            $oauthUser = [
                                'provider_uid' => (string)$payload['sub'],
                                'email' => $email,
                                'name' => 'Usuario Apple'
                            ];
                        }
                    }
                }
            }

            if (!$oauthUser) {
                $msg = rawurlencode('No se pudo verificar la identidad con el proveedor.');
                header("Location: {$baseUrl}/acceso?audience={$audience}&return={$return}&oauth_error={$msg}", true, 303);
                exit;
            }

            $pdo = db();
            ensureOAuthSchema($pdo);
            $user = null;

            try {
                $q = $pdo->prepare('SELECT u.* FROM oauth_identities o JOIN professional_users u ON o.user_id = u.user_id WHERE o.provider = ? AND o.provider_user_id = ? LIMIT 1');
                $q->execute([$provider, $oauthUser['provider_uid']]);
                $user = $q->fetch();
            } catch (Throwable $e) {
                $user = null;
            }

            if (!$user) {
                $q = $pdo->prepare('SELECT * FROM professional_users WHERE email = ? LIMIT 1');
                $q->execute([$oauthUser['email']]);
                $user = $q->fetch();

                if ($user) {
                    try {
                        $pdo->prepare("UPDATE professional_users SET email_verified = 1, email_status = 'verified' WHERE user_id = ?")->execute([$user['user_id']]);
                    } catch (Throwable $updErr) {
                        try {
                            $pdo->prepare("UPDATE professional_users SET email_verified = 1 WHERE user_id = ?")->execute([$user['user_id']]);
                        } catch (Throwable $updErr2) {}
                    }
                } else {
                    $userId = 'usr-' . bin2hex(random_bytes(8));
                    $userName = $oauthUser['name'] !== '' ? $oauthUser['name'] : 'Usuario CocheMotor';
                    $dummyPassword = password_hash(bin2hex(random_bytes(32)), PASSWORD_DEFAULT);
                    $dummyToken = hash('sha256', 'oauth-vt-' . bin2hex(random_bytes(16)));
                    $dummyHash = hash('sha256', 'oauth-vth-' . bin2hex(random_bytes(16)));

                    try {
                        $q = $pdo->prepare("INSERT INTO professional_users(
                            user_id, name, email, password_hash, verification_token,
                            verification_token_hash, verification_expires_at, email_verified,
                            email_status, email_last_sent_at, email_send_attempts,
                            privacy_notice_version, terms_version, notice_acknowledged_at
                        ) VALUES (
                            ?, ?, ?, ?, ?,
                            ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 DAY), 1,
                            'verified', UTC_TIMESTAMP(), 1,
                            'privacy-v1', 'beta-terms-v1', UTC_TIMESTAMP()
                        )");
                        $q->execute([$userId, $userName, $oauthUser['email'], $dummyPassword, $dummyToken, $dummyHash]);
                    } catch (Throwable $insertErr) {
                        $q = $pdo->prepare("INSERT INTO professional_users(
                            user_id, name, email, password_hash, verification_token, email_verified
                        ) VALUES (?, ?, ?, ?, ?, 1)");
                        $q->execute([$userId, $userName, $oauthUser['email'], $dummyPassword, $dummyToken]);
                    }

                    $user = [
                        'user_id' => $userId,
                        'name' => $userName,
                        'email' => $oauthUser['email'],
                        'phone' => '',
                        'professional_type' => ''
                    ];
                }

                try {
                    $pdo->prepare('INSERT INTO oauth_identities(user_id, provider, provider_user_id, email) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE email = VALUES(email)')->execute([$user['user_id'], $provider, $oauthUser['provider_uid'], $oauthUser['email']]);
                } catch (Throwable $e) {}
            }

            $token = bin2hex(random_bytes(32));
            $pdo->prepare('INSERT INTO professional_sessions(token, user_id, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 8 HOUR))')->execute([$token, $user['user_id']]);

            $clientIp = $_SERVER['REMOTE_ADDR'] ?? '';
            if ($clientIp !== '') {
                $salt = oauthConfig('SESSION_SECRET', 'cm_salt_key');
                setcookie('cm_known_ip', hash('sha256', $clientIp . $salt), [
                    'expires' => time() + 86400 * 180,
                    'path' => '/',
                    'secure' => true,
                    'httponly' => true,
                    'samesite' => 'Lax'
                ]);
            }

            $hashParams = http_build_query([
                'session_token' => $token,
                'user_id' => $user['user_id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'phone' => (string)($user['phone'] ?? ''),
                'professional_type' => (string)($user['professional_type'] ?? ''),
                'audience' => $audience,
                'return' => $return
            ]);

            header("Location: {$baseUrl}/acceso#{$hashParams}", true, 303);
            exit;
        } catch (Throwable $e) {
            error_log("OAuth callback error ({$provider}): " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
            $msg = rawurlencode('No se pudo completar el acceso con ' . ucfirst($provider) . '. Por favor, inténtalo de nuevo.');
            header("Location: {$baseUrl}/acceso?audience={$audience}&return={$return}&oauth_error={$msg}", true, 303);
            exit;
        }
    }
    if ($route==='/api/auth' && $method==='POST') {
        $action=$data['action'] ?? ''; $pdo=db();
        if ($action==='ip_status') {
            $clientIp = $_SERVER['REMOTE_ADDR'] ?? '';
            $salt = oauthConfig('SESSION_SECRET', 'cm_salt_key');
            $isKnown = !empty($_COOKIE['cm_known_ip']) && hash_equals($_COOKIE['cm_known_ip'], hash('sha256', $clientIp . $salt));
            jsonResponse(['ok'=>true, 'ip'=>$clientIp, 'recognized'=>$isKnown]);
        }
        if ($action==='register') {
            $name=trim((string)($data['name']??'')); $email=strtolower(trim((string)($data['email']??''))); $password=(string)($data['password']??'');
            $nameLength = preg_match_all('/./us', $name);
            $privacyNoticeRead=($data['privacy_notice_read']??null)===true;
            $termsAccepted=($data['terms_accepted']??null)===true;
            if ($nameLength === false || $nameLength < 2 || $nameLength > 120 || !filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($password)<10 || !$privacyNoticeRead || !$termsAccepted || ($data['privacy_notice_version']??null)!=='privacy-v1' || ($data['terms_version']??null)!=='beta-terms-v1') fail(400,'Revisa tus datos y confirma la Política de privacidad y los Términos del Servicio.');
            if (isset($data['password_confirm']) && (string)$data['password_confirm'] !== $password) fail(400, 'Las contraseñas no coinciden.');
            $id='usr-'.bin2hex(random_bytes(8)); $verify=bin2hex(random_bytes(32));
            try { $q=$pdo->prepare("INSERT INTO professional_users(user_id,name,email,password_hash,verification_token,verification_token_hash,verification_expires_at,email_status,email_last_sent_at,email_send_attempts,privacy_notice_version,terms_version,notice_acknowledged_at) VALUES(?,?,?,?,NULL,?,NULL,'pending',UTC_TIMESTAMP(),1,?,?,UTC_TIMESTAMP())"); $q->execute([$id,$name,$email,password_hash($password,PASSWORD_DEFAULT),hash('sha256',$verify),'privacy-v1','beta-terms-v1']); }
            catch (PDOException $e) { if ($e->getCode()==='23000') fail(409,'Ya existe una cuenta con ese correo'); throw $e; }
            if (!sendVerificationEmail($email, $name, $verify)) {
                $cleanup=$pdo->prepare('DELETE FROM professional_users WHERE user_id=? AND email_verified=0');
                $cleanup->execute([$id]);
                fail(503,'No se pudo enviar el correo de verificación. Revisa tu dirección e inténtalo de nuevo más tarde.');
            }
            jsonResponse(['ok'=>true,'user'=>['user_id'=>$id,'name'=>$name,'email'=>$email,'verified'=>false],'message'=>'Te enviamos un enlace para verificar tu correo. Revisa también la carpeta de correo no deseado.'],201);
        }
        if ($action==='resend_verification') {
            $email=strtolower(trim((string)($data['email']??''))); if(!filter_var($email,FILTER_VALIDATE_EMAIL)) fail(400,'Indica un correo válido.');
            $q=$pdo->prepare('SELECT user_id,name,email_verified FROM professional_users WHERE email=? LIMIT 1'); $q->execute([$email]); $row=$q->fetch();
            if(!$row || (bool)$row['email_verified']) jsonResponse(['ok'=>true,'message'=>'Si existe una cuenta pendiente, recibirás un nuevo enlace en unos minutos.'],202);
            $verify=bin2hex(random_bytes(32)); $q=$pdo->prepare("UPDATE professional_users SET verification_token_hash=?,verification_expires_at=NULL,verification_used_at=NULL,email_status='pending',email_last_sent_at=UTC_TIMESTAMP(),email_send_attempts=email_send_attempts+1 WHERE user_id=? AND email_verified=0"); $q->execute([hash('sha256',$verify),$row['user_id']]);
            if(!sendVerificationEmail($email,(string)$row['name'],$verify)){ $pdo->prepare("UPDATE professional_users SET email_status='send_failed' WHERE user_id=?")->execute([$row['user_id']]); fail(503,'No se pudo enviar el correo ahora. Inténtalo de nuevo más tarde.'); }
            $pdo->prepare("UPDATE professional_users SET email_status='sent' WHERE user_id=?")->execute([$row['user_id']]); jsonResponse(['ok'=>true,'message'=>'Si existe una cuenta pendiente, recibirás un nuevo enlace en unos minutos.'],202);
        }
        if ($action==='verify') { $q=$pdo->prepare("UPDATE professional_users SET email_verified=1,verification_token=NULL,verification_used_at=UTC_TIMESTAMP(),email_status='verified' WHERE verification_token_hash=? AND email_verified=0 AND verification_used_at IS NULL"); $q->execute([hash('sha256',(string)($data['token']??''))]); jsonResponse(['ok'=>$q->rowCount()===1]); }
        if ($action==='login') {
            $q=$pdo->prepare('SELECT * FROM professional_users WHERE email=?');
            $q->execute([strtolower(trim((string)($data['email']??'')))]);
            $row=$q->fetch();
            if (!$row || !password_verify((string)($data['password']??''),$row['password_hash'])) fail(401,'Correo o contraseña incorrectos');
            if(!(bool)$row['email_verified']) fail(403,'Verifica tu correo antes de iniciar sesión.');
            $t=bin2hex(random_bytes(32));
            $q=$pdo->prepare('INSERT INTO professional_sessions(token,user_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 8 HOUR))');
            $q->execute([$t,$row['user_id']]);
            $clientIp = $_SERVER['REMOTE_ADDR'] ?? '';
            if ($clientIp !== '') {
                $salt = oauthConfig('SESSION_SECRET', 'cm_salt_key');
                setcookie('cm_known_ip', hash('sha256', $clientIp . $salt), [
                    'expires' => time() + 86400 * 180,
                    'path' => '/',
                    'secure' => true,
                    'httponly' => true,
                    'samesite' => 'Lax'
                ]);
            }
            jsonResponse(['ok'=>true,'user'=>['user_id'=>$row['user_id'],'name'=>$row['name'],'email'=>$row['email'],'verified'=>true,'phone'=>$row['phone'],'professional_type'=>$row['professional_type']],'session_token'=>$t]);
        }
        if ($action==='session') { $u=user(); $sessionUser=$u?['user_id'=>$u['user_id'],'name'=>$u['name'],'email'=>$u['email'],'verified'=>(bool)$u['email_verified'],'phone'=>$u['phone'],'professional_type'=>$u['professional_type']]:null; jsonResponse(['ok'=>(bool)$u,'user'=>$sessionUser],$u?200:401); }
        if ($action==='logout') { $u=requireUser(); $q=$pdo->prepare('DELETE FROM professional_sessions WHERE token=? AND user_id=?'); $q->execute([token(),$u['user_id']]); jsonResponse(['ok'=>true]); }
        if ($action==='profile_details') { $u=requireUser(); $q=$pdo->prepare('SELECT display_name,public_description,dealer_slug,public_profile FROM dealerships WHERE tenant_id=? LIMIT 1'); $q->execute([$u['user_id']]); $profile=$q->fetch()?:[]; jsonResponse(['ok'=>true,'profile'=>['business_name'=>$profile['display_name']??'','public_description'=>$profile['public_description']??'','public_slug'=>$profile['dealer_slug']??'','public_profile'=>(bool)($profile['public_profile']??false)]]); }
        if ($action==='profile') {
            $u=requireUser();
            if (($data['user_id']??'')!==$u['user_id']) fail(403,'Sesión no autorizada');
            $phone=trim((string)($data['phone']??''));
            $professionalType=trim((string)($data['professional_type']??''));
            $hasPublicFields=array_key_exists('business_name',$data)||array_key_exists('public_description',$data)||array_key_exists('public_profile',$data);
            $businessName=trim((string)($data['business_name']??''));
            $publicDescription=trim((string)($data['public_description']??''));
            $publicProfile=($data['public_profile']??false)===true;
            if ($hasPublicFields && $publicProfile && !(bool)$u['email_verified']) fail(403,'Verifica tu correo antes de publicar el perfil.');
            if ($hasPublicFields && $publicProfile && (textLength($businessName)<2||textLength($businessName)>160||textLength($publicDescription)<80||textLength($publicDescription)>2000)) fail(400,'Para mostrar tu perfil, indica un nombre comercial y una descripción de al menos 80 caracteres.');
            if ($hasPublicFields && $publicProfile && ($data['public_profile_consent']??null)!==true) fail(400,'Confirma el consentimiento para mostrar públicamente el perfil.');
            $pdo->beginTransaction();
            try {
                $q=$pdo->prepare('UPDATE professional_users SET phone=?,professional_type=? WHERE user_id=?');
                $q->execute([$phone,$professionalType,$u['user_id']]);
                if ($hasPublicFields) {
                    $displayName=$businessName!==''?$businessName:$u['name'];
                    $currentSlugQuery=$pdo->prepare('SELECT dealer_slug FROM dealerships WHERE tenant_id=? LIMIT 1');
                    $currentSlugQuery->execute([$u['user_id']]);
                    $currentSlug=(string)($currentSlugQuery->fetchColumn()?:'');
                    $slug=($currentSlug!==''&&$currentSlug!==$u['user_id'])?$currentSlug:publicSlug($displayName,$u['user_id']);
                    $description=$publicProfile?$publicDescription:null;
                    $version=$publicProfile?'public-profile-v1':null;
                    $consentedAt=$publicProfile?gmdate('Y-m-d H:i:s'):null;
                    $q=$pdo->prepare('INSERT INTO dealerships(tenant_id,display_name,dealer_slug,phone_whatsapp,public_description,public_profile,public_profile_consent_version,public_profile_consent_at) VALUES(?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE display_name=VALUES(display_name),dealer_slug=VALUES(dealer_slug),phone_whatsapp=VALUES(phone_whatsapp),public_description=VALUES(public_description),public_profile=VALUES(public_profile),public_profile_consent_version=IF(VALUES(public_profile)=1,VALUES(public_profile_consent_version),public_profile_consent_version),public_profile_consent_at=IF(VALUES(public_profile)=1,VALUES(public_profile_consent_at),public_profile_consent_at)');
                    $q->execute([$u['user_id'],$displayName,$slug,$phone,$description,(int)$publicProfile,$version,$consentedAt]);
                }
                $pdo->commit();
                jsonResponse(['ok'=>true,'public_profile'=>$hasPublicFields&&$publicProfile]);
            } catch(Throwable $e) { if($pdo->inTransaction())$pdo->rollBack(); throw $e; }
        }
        fail(400,'Acción de acceso no válida');
    }
    if ($route==='/api/vehicles' && $method==='POST' && str_starts_with(strtolower($_SERVER['CONTENT_TYPE']??''),'multipart/form-data')) {
        $u=requireUser(); if (!(bool)$u['email_verified']) fail(403,'Debes verificar tu correo antes de publicar.');
        $v=json_decode((string)($_POST['vehicle']??''),true); if(!is_array($v)) fail(400,'No se pudieron leer los datos del anuncio.');
        $contact=is_array($v['contact']??null)?$v['contact']:[];
        foreach(['brand','model','year','km','price','location','id'] as $field)if(!isset($v[$field])||!is_scalar($v[$field]))fail(400,'Revisa los datos obligatorios del vehículo.');
        foreach(['name','email','phone'] as $field)if(!isset($contact[$field])||!is_scalar($contact[$field]))fail(400,'Revisa los datos de contacto.');
        $brand=trim((string)$v['brand']); $model=trim((string)$v['model']); $version=trim((string)($v['version']??'')); $yearValue=$v['year']; $kmValue=$v['km']; $priceValue=$v['price']; $year=(int)$yearValue; $km=(int)$kmValue; $price=(float)$priceValue; $publicationStatus=(string)($v['publicationStatus']??'disponible'); $contactName=trim((string)$contact['name']); $contactEmail=strtolower(trim((string)$contact['email'])); $contactPhone=trim((string)$contact['phone']); $location=trim((string)$v['location']); $fuel=trim((string)($v['fuel']??'')); $gearbox=trim((string)($v['gearbox']??'')); $dgtBadge=(string)($v['badge']??'');
        if($brand===''||textLength($brand)>80||$model===''||textLength($model)>120||textLength($version)>180||!is_numeric($yearValue)||$year<2000||$year>(int)gmdate('Y')+1||!is_numeric($kmValue)||$km<0||!is_numeric($priceValue)||$price<0||!in_array($publicationStatus,['disponible','proxima_entrada'],true)||$location===''||textLength($location)>160||textLength($fuel)>60||textLength($gearbox)>60||!in_array($dgtBadge,['','B','C','ECO','0'],true)||$contactName===''||textLength($contactName)>120||!filter_var($contactEmail,FILTER_VALIDATE_EMAIL)||$contactPhone===''||textLength($contactPhone)>32||($contact['consent']??null)!==true) fail(400,'Revisa los datos obligatorios y acepta el uso de datos para gestionar la publicación.');
        $id=(string)($v['id']??''); if(!preg_match('/^pub-[a-f0-9]{32}$/',$id))fail(400,'El borrador de publicación no es válido. Recarga la página e inténtalo de nuevo.');
        $pdo=db(); $existing=$pdo->prepare('SELECT vehicle_id FROM vehicles WHERE vehicle_id=? AND tenant_id=?');$existing->execute([$id,$u['user_id']]);if($existing->fetchColumn())jsonResponse(['ok'=>true,'id'=>$id,'status'=>'pendiente_validacion_contacto','already_saved'=>true],200);
        $files=$_FILES['images']??null;if($files!==null&&(!is_array($files)||!is_array($files['name']??null)||!is_array($files['tmp_name']??null)||!is_array($files['error']??null)||!is_array($files['size']??null)))fail(400,'El formato de las fotos no es válido.');$names=$files['name']??[];if(count($names)>10) fail(400,'Un anuncio puede tener como máximo 10 imágenes.');
        $slotRows=$_POST['slots']??[]; if(!is_array($slotRows)||count($slotRows)!==count($names)) fail(400,'No se pudieron asociar las fotos a la guía. Vuelve a intentarlo.');
        $allowedSlots=['front-right','rear','left-side','right-side','front-interior','rear-interior','dashboard-km','engine','trunk','tire-or-detail']; $slots=[];
        foreach($slotRows as $i=>$rawSlot){$slot=json_decode((string)$rawSlot,true);$key=(string)($slot['key']??'');$order=(int)($slot['sort_order']??-1);if(!in_array($key,$allowedSlots,true)||$order<0||$order>9||in_array($key,array_column($slots,'key'),true)||in_array($order,array_column($slots,'sort_order'),true))fail(400,'Una de las fotos no corresponde a una toma válida.');$slots[]=['key'=>$key,'sort_order'=>$order];}
        if($files){foreach($names as $i=>$name){$file=['name'=>$name,'type'=>$files['type'][$i]??'','tmp_name'=>$files['tmp_name'][$i]??'','error'=>$files['error'][$i]??UPLOAD_ERR_NO_FILE,'size'=>$files['size'][$i]??0];if(($file['error']??0)!==UPLOAD_ERR_OK)fail(400,'Una foto no llegó completa. Prueba con imágenes más pequeñas y vuelve a intentarlo.');if((int)$file['size']>8*1024*1024)fail(400,'Cada foto debe ocupar como máximo 8 MB.');}}
        $slug=publicSlug($brand.'-'.$model.'-'.$year,bin2hex(random_bytes(8)));
        if(!preg_match('/^[a-z0-9][a-z0-9-]{2,179}$/',$slug))fail(400,'No se pudo crear una dirección pública válida para el anuncio.');
        $publicSlug=$slug;
        $directory=dirname(__DIR__).'/uploads/vehicles'; $stored=[];
        try {
            foreach($names as $i=>$name){$file=['name'=>$name,'type'=>$files['type'][$i]??'','tmp_name'=>$files['tmp_name'][$i]??'','error'=>$files['error'][$i]??UPLOAD_ERR_NO_FILE,'size'=>$files['size'][$i]??0];$stored[$i]=storeVehiclePhoto($file,$directory);}
            $imageMetadata=[]; foreach($slots as $i=>$slot){$slot['image_url']='uploads/vehicles/'.$stored[$i];$imageMetadata[]=$slot;}
            $metadata=['location'=>$location,'fuel'=>$fuel,'gearbox'=>$gearbox,'photo_slots'=>$imageMetadata,'publication_state'=>$publicationStatus,'evidence_level'=>'declarado'];
            $pdo->beginTransaction();
            $isEmailVerified = (bool)$u['email_verified'];
            $initialStage = $isEmailVerified ? 'publicado' : 'pendiente_validacion_contacto';
            $initialStatus = $isEmailVerified ? $publicationStatus : 'pendiente_revision';
            $contactVerified = $isEmailVerified ? 1 : 0;
            $q=$pdo->prepare('INSERT INTO dealerships(tenant_id,display_name,dealer_slug,phone_whatsapp) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE display_name=VALUES(display_name),phone_whatsapp=VALUES(phone_whatsapp)');$q->execute([$u['user_id'],$u['name'],$u['user_id'],trim((string)($contact['phone']??''))]);
            $q=$pdo->prepare("INSERT INTO vehicles(vehicle_id,tenant_id,brand,model,version,year,mileage_km,cash_price,dgt_badge,evidence_level,stage,status,public_slug,metadata_json) VALUES(?,?,?,?,?,?,?,?,?,'declarado',?,?,?,?)");
            $q->execute([$id,$u['user_id'],$brand,$model,$version,$year,$km,$price,$dgtBadge,$initialStage,$initialStatus,$publicSlug,json_encode($metadata,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR)]);
            foreach($slots as $i=>$slot){$q=$pdo->prepare('INSERT INTO vehicle_images(image_id,vehicle_id,image_url,sort_order) VALUES(?,?,?,?)');$q->execute([$id.'-img-'.$i,$id,'uploads/vehicles/'.$stored[$i],$slot['sort_order']]);}
            $q=$pdo->prepare('INSERT INTO publication_contacts(contact_id,vehicle_id,user_id,name,email,phone,whatsapp_opt_in,contact_verified,consent_version) VALUES(?,?,?,?,?,?,0,?,?)');$q->execute(['contact-'.bin2hex(random_bytes(8)),$id,$u['user_id'],$contactName,$contactEmail,$contactPhone,$contactVerified,'publish-v1']);
            $pdo->commit(); jsonResponse(['ok'=>true,'id'=>$id,'status'=>$initialStage],201);
        } catch(Throwable $e) { if($pdo->inTransaction())$pdo->rollBack();foreach($stored as $filename)@unlink($directory.'/'.$filename);if($e instanceof ApiFailure)fail($e->status,$e->getMessage());throw $e; }
    }
    if ($route==='/api/vehicles' && $method==='POST') fail(415,'Usa el formulario guiado para publicar el anuncio y sus fotos de forma segura.');
    if ($route==='/api/report' && $method==='POST') { if (empty($data['listing_reference'])||empty($data['reason'])||empty($data['description'])||$data['privacy_consent']!==true) fail(400,'Faltan datos obligatorios'); $id='rep-'.bin2hex(random_bytes(6)); $q=db()->prepare('INSERT INTO ad_reports(report_id,listing_reference,reason,description,reporter_email,privacy_consent) VALUES(?,?,?,?,?,1)'); $q->execute([$id,$data['listing_reference'],$data['reason'],$data['description'],$data['email']??null]); jsonResponse(['ok'=>true,'id'=>$id],201); }
    if ($route==='/api/leads' && $method==='GET') { $u=requireUser(); $q=db()->prepare('SELECT lead_id,tenant_id,vehicle_id,buyer_name,phone,payment_method,created_at FROM leads WHERE tenant_id=? ORDER BY created_at DESC LIMIT 100'); $q->execute([$u['user_id']]); jsonResponse(['leads'=>$q->fetchAll()]); }
    if ($route==='/api/leads' && $method==='POST') {
        $contentLength=(int)($_SERVER['CONTENT_LENGTH']??0);
        if($contentLength<2||$contentLength>4096)fail($contentLength>4096?413:400,'No se pudieron leer los datos de contacto.');
        if(trim((string)($data['website']??''))!=='')fail(400,'No se pudo enviar la solicitud.');
        $vehicleId=trim((string)($data['vehicle_id']??''));
        $buyerName=trim((string)($data['buyer_name']??''));
        $phoneInput=trim((string)($data['phone']??''));
        $phoneDigits=preg_replace('/\D/','',$phoneInput)??'';
        $paymentMethod=(string)($data['payment_method']??'');
        $contactRequested=($data['contact_requested']??null)===true;
        $noticeVersion=(string)($data['privacy_notice_version']??'');
        $allowedPaymentMethods=['','cash','finance','trade_cash','trade_finance'];
        if(!preg_match('/^[A-Za-z0-9_-]{1,80}$/',$vehicleId)||textLength($buyerName)<2||textLength($buyerName)>120||!preg_match('/^\+?[0-9 ()-]{8,32}$/',$phoneInput)||strlen($phoneDigits)<8||strlen($phoneDigits)>15||!in_array($paymentMethod,$allowedPaymentMethods,true)||!$contactRequested||$noticeVersion!=='lead-contact-v1')fail(400,'Revisa tus datos, la solicitud de contacto y la Política de privacidad.');
        $phone=(str_starts_with($phoneInput,'+')?'+':'').$phoneDigits;
        $pdo=db();
        $q=$pdo->prepare("SELECT v.tenant_id FROM vehicles v JOIN professional_users u ON u.user_id=v.tenant_id WHERE v.vehicle_id=? AND (v.status='disponible' OR v.status='proxima_entrada') AND v.stage='publicado' AND u.email_verified=1 AND EXISTS (SELECT 1 FROM publication_contacts pc WHERE pc.vehicle_id=v.vehicle_id AND pc.contact_verified=1) LIMIT 1");
        $q->execute([$vehicleId]); $tenantId=(string)($q->fetchColumn()?:'');
        if($tenantId==='')fail(404,'Este anuncio ya no está disponible para recibir solicitudes.');
        $q=$pdo->prepare('SELECT COUNT(*) FROM leads WHERE vehicle_id=? AND phone=? AND created_at>=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 10 MINUTE)');
        $q->execute([$vehicleId,$phone]);
        if((int)$q->fetchColumn()>=3)fail(429,'Ya hemos recibido varias solicitudes con este teléfono para este anuncio. Inténtalo más tarde.');
        $id='lead-'.bin2hex(random_bytes(6));
        $q=$pdo->prepare('INSERT INTO leads(lead_id,tenant_id,vehicle_id,buyer_name,phone,payment_method,contact_requested_at,privacy_notice_version) VALUES(?,?,?,?,?,?,UTC_TIMESTAMP(),?)');
        $q->execute([$id,$tenantId,$vehicleId,$buyerName,$phone,$paymentMethod?:null,$noticeVersion]);
        $sellerQuery=$pdo->prepare("SELECT u.name AS seller_name, u.email AS seller_email, v.brand, v.model FROM vehicles v JOIN professional_users u ON u.user_id=v.tenant_id WHERE v.vehicle_id=? LIMIT 1");
        $sellerQuery->execute([$vehicleId]);
        $seller=$sellerQuery->fetch();
        if($seller && !empty($seller['seller_email'])) {
            @sendLeadNotificationEmail((string)$seller['seller_email'], (string)$seller['seller_name'], $buyerName, $phone, $paymentMethod, (string)$seller['brand'], (string)$seller['model']);
        }
        jsonResponse(['ok'=>true,'id'=>$id],201);
    }
    fail(404,'Ruta no encontrada');
} catch (Throwable $e) { if (db()->inTransaction()) db()->rollBack(); fail(500,'No se pudo completar la operación'); }
