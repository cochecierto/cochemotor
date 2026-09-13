<?php
declare(strict_types=1);

// La configuración real se guarda fuera de public_html y nunca se versiona.
require_once dirname(__DIR__, 2) . '/cochemotor-private/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: https://cochemotor.es');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

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
function token(): string { $header=$_SERVER['HTTP_AUTHORIZATION'] ?? ''; return str_starts_with($header,'Bearer ') ? trim(substr($header,7)) : ''; }
function user(): ?array { $t=token(); if (!$t) return null; $q=db()->prepare('SELECT u.user_id,u.name,u.email,u.email_verified,u.phone,u.professional_type,s.expires_at FROM professional_sessions s JOIN professional_users u ON u.user_id=s.user_id WHERE s.token=? AND s.expires_at>UTC_TIMESTAMP()'); $q->execute([$t]); $u=$q->fetch(); return $u ?: null; }
function requireUser(): array { $u=user(); if (!$u) fail(401,'Sesión no válida'); return $u; }

$path=parse_url($_SERVER['REQUEST_URI'] ?? '/',PHP_URL_PATH); $route=preg_replace('#^.*/api#','/api',$path); $method=$_SERVER['REQUEST_METHOD']; $data=body();
try {
    if ($route==='/api/health' && $method==='GET') { db()->query('SELECT 1'); jsonResponse(['ok'=>true,'service'=>'cochemotor']); }
    if ($route==='/api/auth/verify' && $method==='GET') { $q=db()->prepare("UPDATE professional_users SET email_verified=1,verification_token='' WHERE verification_token=?"); $q->execute([$_GET['token']??'']); jsonResponse(['ok'=>$q->rowCount()===1]); }
    if ($route==='/api/auth' && $method==='POST') {
        $action=$data['action'] ?? ''; $pdo=db();
        if ($action==='register') {
            $name=trim((string)($data['name']??'')); $email=strtolower(trim((string)($data['email']??''))); $password=(string)($data['password']??'');
            $nameLength = preg_match_all('/./us', $name);
            if ($nameLength === false || $nameLength < 2 || !filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($password)<10) fail(400,'Nombre, correo o contraseña no válidos');
            $id='usr-'.bin2hex(random_bytes(8)); $verify=bin2hex(random_bytes(32));
            try { $q=$pdo->prepare('INSERT INTO professional_users(user_id,name,email,password_hash,verification_token) VALUES(?,?,?,?,?)'); $q->execute([$id,$name,password_hash($password,PASSWORD_DEFAULT),$verify]); }
            catch (PDOException $e) { if ($e->getCode()==='23000') fail(409,'Ya existe una cuenta con ese correo'); throw $e; }
            jsonResponse(['ok'=>true,'user'=>['user_id'=>$id,'name'=>$name,'email'=>$email,'verified'=>false],'verification_url'=>rtrim(getenv('COCHEMOTOR_PUBLIC_BASE_URL')?:'https://cochemotor.es','/').'/api/auth/verify?token='.$verify],201);
        }
        if ($action==='verify') { $q=$pdo->prepare("UPDATE professional_users SET email_verified=1,verification_token='' WHERE verification_token=?"); $q->execute([(string)($data['token']??'')]); jsonResponse(['ok'=>$q->rowCount()===1]); }
        if ($action==='login') { $q=$pdo->prepare('SELECT * FROM professional_users WHERE email=?'); $q->execute([strtolower(trim((string)($data['email']??'')))]); $row=$q->fetch(); if (!$row || !password_verify((string)($data['password']??''),$row['password_hash'])) fail(401,'Correo o contraseña incorrectos'); $t=bin2hex(random_bytes(32)); $q=$pdo->prepare('INSERT INTO professional_sessions(token,user_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 8 HOUR))'); $q->execute([$t,$row['user_id']]); jsonResponse(['ok'=>true,'user'=>['user_id'=>$row['user_id'],'name'=>$row['name'],'email'=>$row['email'],'verified'=>(bool)$row['email_verified'],'phone'=>$row['phone'],'professional_type'=>$row['professional_type']],'session_token'=>$t]); }
        if ($action==='session') { $u=user(); jsonResponse(['ok'=>(bool)$u,'user'=>$u],$u?200:401); }
        if ($action==='logout') { $q=$pdo->prepare('DELETE FROM professional_sessions WHERE token=?'); $q->execute([(string)($data['session_token']??'')]); jsonResponse(['ok'=>true]); }
        if ($action==='profile') { $u=requireUser(); if (($data['user_id']??'')!==$u['user_id']) fail(403,'Sesión no autorizada'); $q=$pdo->prepare('UPDATE professional_users SET phone=?,professional_type=? WHERE user_id=?'); $q->execute([trim((string)($data['phone']??'')),trim((string)($data['professional_type']??'')),$u['user_id']]); jsonResponse(['ok'=>true]); }
        fail(400,'Acción de acceso no válida');
    }
    if ($route==='/api/vehicles' && $method==='POST') { $u=requireUser(); if (!(bool)$u['email_verified']) fail(403,'Debes verificar tu correo'); $v=$data['vehicle']??[]; $images=$v['images']??[]; if (!is_array($images)||count($images)>10) fail(400,'Un anuncio puede tener como máximo 10 imágenes.'); $id=(string)($v['id']??''); if (!$id||!$v['brand']||!$v['model']) fail(400,'Datos del vehículo no válidos'); $pdo=db(); $pdo->beginTransaction(); $q=$pdo->prepare('INSERT INTO dealerships(tenant_id,display_name,dealer_slug,phone_whatsapp) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE display_name=VALUES(display_name),phone_whatsapp=VALUES(phone_whatsapp)'); $q->execute([$u['user_id'],$u['name'],$u['user_id'],$u['phone']??'']); $q=$pdo->prepare('INSERT INTO vehicles(vehicle_id,tenant_id,brand,model,version,year,mileage_km,cash_price,dgt_badge,metadata_json) VALUES(?,?,?,?,?,?,?,?,?,?)'); $q->execute([$id,$u['user_id'],$v['brand'],$v['model'],$v['version']??'',(int)$v['year'],(int)($v['km']??0),(float)$v['price'],$v['badge']??'',json_encode($v,JSON_UNESCAPED_UNICODE)]); foreach($images as $i=>$url){$q=$pdo->prepare('INSERT INTO vehicle_images(image_id,vehicle_id,image_url,sort_order) VALUES(?,?,?,?)');$q->execute([$id.'-img-'.$i,$id,(string)$url,$i]);} $pdo->commit(); jsonResponse(['ok'=>true,'id'=>$id],201); }
    if ($route==='/api/report' && $method==='POST') { if (empty($data['listing_reference'])||empty($data['reason'])||empty($data['description'])||$data['privacy_consent']!==true) fail(400,'Faltan datos obligatorios'); $id='rep-'.bin2hex(random_bytes(6)); $q=db()->prepare('INSERT INTO ad_reports(report_id,listing_reference,reason,description,reporter_email,privacy_consent) VALUES(?,?,?,?,?,1)'); $q->execute([$id,$data['listing_reference'],$data['reason'],$data['description'],$data['email']??null]); jsonResponse(['ok'=>true,'id'=>$id],201); }
    if ($route==='/api/leads' && $method==='POST') { $data['tenant_id']=(string)(db()->query("SELECT tenant_id FROM vehicles WHERE vehicle_id=".db()->quote((string)($data['vehicle_id']??'')))->fetchColumn()?:''); if (!$data['tenant_id']) fail(404,'Vehículo no encontrado'); $id='lead-'.bin2hex(random_bytes(6)); $q=db()->prepare('INSERT INTO leads(lead_id,tenant_id,vehicle_id,buyer_name,phone,payment_method,score) VALUES(?,?,?,?,?,?,?)'); $q->execute([$id,$data['tenant_id'],$data['vehicle_id'],$data['buyer_name'],$data['phone'],$data['payment_method']??'',(int)($data['score']??0)]); jsonResponse(['ok'=>true,'id'=>$id],201); }
    fail(404,'Ruta no encontrada');
} catch (Throwable $e) { if (db()->inTransaction()) db()->rollBack(); fail(500,'No se pudo completar la operación'); }
