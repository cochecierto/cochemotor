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
function token(): string { $header=$_SERVER['HTTP_AUTHORIZATION'] ?? ''; return str_starts_with($header,'Bearer ') ? trim(substr($header,7)) : ''; }
function user(): ?array { $t=token(); if (!$t) return null; $q=db()->prepare('SELECT u.user_id,u.name,u.email,u.email_verified,u.phone,u.professional_type,s.expires_at FROM professional_sessions s JOIN professional_users u ON u.user_id=s.user_id WHERE s.token=? AND s.expires_at>UTC_TIMESTAMP()'); $q->execute([$t]); $u=$q->fetch(); return $u ?: null; }
function requireUser(): array { $u=user(); if (!$u) fail(401,'Sesión no válida'); return $u; }
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
    if ($route==='/api/vehicles' && $method==='POST' && str_starts_with(strtolower($_SERVER['CONTENT_TYPE']??''),'multipart/form-data')) {
        $u=requireUser(); if (!(bool)$u['email_verified']) fail(403,'Debes verificar tu correo antes de publicar.');
        $v=json_decode((string)($_POST['vehicle']??''),true); if(!is_array($v)) fail(400,'No se pudieron leer los datos del anuncio.');
        $contact=is_array($v['contact']??null)?$v['contact']:[];
        foreach(['brand','model','year','km','price','location','id'] as $field)if(!isset($v[$field])||!is_scalar($v[$field]))fail(400,'Revisa los datos obligatorios del vehículo.');
        foreach(['name','email','phone'] as $field)if(!isset($contact[$field])||!is_scalar($contact[$field]))fail(400,'Revisa los datos de contacto.');
        $brand=trim((string)$v['brand']); $model=trim((string)$v['model']); $yearValue=$v['year']; $kmValue=$v['km']; $priceValue=$v['price']; $year=(int)$yearValue; $km=(int)$kmValue; $price=(float)$priceValue; $contactName=trim((string)$contact['name']); $contactEmail=strtolower(trim((string)$contact['email'])); $contactPhone=trim((string)$contact['phone']); $location=trim((string)$v['location']);
        if($brand===''||textLength($brand)>80||$model===''||textLength($model)>120||!is_numeric($yearValue)||$year<1950||$year>(int)gmdate('Y')+1||!is_numeric($kmValue)||$km<0||!is_numeric($priceValue)||$price<0||$location===''||textLength($location)>160||$contactName===''||textLength($contactName)>120||!filter_var($contactEmail,FILTER_VALIDATE_EMAIL)||$contactPhone===''||textLength($contactPhone)>32||($contact['consent']??null)!==true) fail(400,'Revisa los datos obligatorios y acepta el uso de datos para gestionar la publicación.');
        $id=(string)($v['id']??''); if(!preg_match('/^pub-[a-f0-9]{32}$/',$id))fail(400,'El borrador de publicación no es válido. Recarga la página e inténtalo de nuevo.');
        $pdo=db(); $existing=$pdo->prepare('SELECT vehicle_id FROM vehicles WHERE vehicle_id=? AND tenant_id=?');$existing->execute([$id,$u['user_id']]);if($existing->fetchColumn())jsonResponse(['ok'=>true,'id'=>$id,'status'=>'pendiente_validacion_contacto','already_saved'=>true],200);
        $files=$_FILES['images']??null;if($files!==null&&(!is_array($files)||!is_array($files['name']??null)||!is_array($files['tmp_name']??null)||!is_array($files['error']??null)||!is_array($files['size']??null)))fail(400,'El formato de las fotos no es válido.');$names=$files['name']??[];if(count($names)>10) fail(400,'Un anuncio puede tener como máximo 10 imágenes.');
        $slotRows=$_POST['slots']??[]; if(!is_array($slotRows)||count($slotRows)!==count($names)) fail(400,'No se pudieron asociar las fotos a la guía. Vuelve a intentarlo.');
        $allowedSlots=['front-right','rear','left-side','right-side','front-interior','rear-interior','dashboard-km','engine','trunk','tire-or-detail']; $slots=[];
        foreach($slotRows as $i=>$rawSlot){$slot=json_decode((string)$rawSlot,true);$key=(string)($slot['key']??'');$order=(int)($slot['sort_order']??-1);if(!in_array($key,$allowedSlots,true)||$order<0||$order>9||in_array($key,array_column($slots,'key'),true)||in_array($order,array_column($slots,'sort_order'),true))fail(400,'Una de las fotos no corresponde a una toma válida.');$slots[]=['key'=>$key,'sort_order'=>$order];}
        if($files){foreach($names as $i=>$name){$file=['name'=>$name,'type'=>$files['type'][$i]??'','tmp_name'=>$files['tmp_name'][$i]??'','error'=>$files['error'][$i]??UPLOAD_ERR_NO_FILE,'size'=>$files['size'][$i]??0];if(($file['error']??0)!==UPLOAD_ERR_OK)fail(400,'Una foto no llegó completa. Prueba con imágenes más pequeñas y vuelve a intentarlo.');if((int)$file['size']>8*1024*1024)fail(400,'Cada foto debe ocupar como máximo 8 MB.');}}
        $publicSlug='vehiculo-'.bin2hex(random_bytes(8)); $directory=dirname(__DIR__).'/uploads/vehicles'; $stored=[];
        try {
            foreach($names as $i=>$name){$file=['name'=>$name,'type'=>$files['type'][$i]??'','tmp_name'=>$files['tmp_name'][$i]??'','error'=>$files['error'][$i]??UPLOAD_ERR_NO_FILE,'size'=>$files['size'][$i]??0];$stored[$i]=storeVehiclePhoto($file,$directory);}
            $imageMetadata=[]; foreach($slots as $i=>$slot){$slot['image_url']='uploads/vehicles/'.$stored[$i];$imageMetadata[]=$slot;}
            $metadata=['location'=>$location,'photo_slots'=>$imageMetadata,'publication_state'=>'pending_contact_review'];
            $pdo->beginTransaction();
            $q=$pdo->prepare('INSERT INTO dealerships(tenant_id,display_name,dealer_slug,phone_whatsapp) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE display_name=VALUES(display_name),phone_whatsapp=VALUES(phone_whatsapp)');$q->execute([$u['user_id'],$u['name'],$u['user_id'],trim((string)($contact['phone']??''))]);
            $q=$pdo->prepare("INSERT INTO vehicles(vehicle_id,tenant_id,brand,model,version,year,mileage_km,cash_price,dgt_badge,stage,status,public_slug,metadata_json) VALUES(?,?,?,?,?,?,?,?,?,'pendiente_validacion_contacto','pendiente_revision',?,?)");
            $q->execute([$id,$u['user_id'],$brand,$model,'',$year,$km,$price,'',$publicSlug,json_encode($metadata,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR)]);
            foreach($slots as $i=>$slot){$q=$pdo->prepare('INSERT INTO vehicle_images(image_id,vehicle_id,image_url,sort_order) VALUES(?,?,?,?)');$q->execute([$id.'-img-'.$i,$id,'uploads/vehicles/'.$stored[$i],$slot['sort_order']]);}
            $q=$pdo->prepare('INSERT INTO publication_contacts(contact_id,vehicle_id,user_id,name,email,phone,whatsapp_opt_in,contact_verified,consent_version) VALUES(?,?,?,?,?,?,0,0,?)');$q->execute(['contact-'.bin2hex(random_bytes(8)),$id,$u['user_id'],$contactName,$contactEmail,$contactPhone,'publish-v1']);
            $pdo->commit(); jsonResponse(['ok'=>true,'id'=>$id,'status'=>'pendiente_validacion_contacto'],201);
        } catch(Throwable $e) { if($pdo->inTransaction())$pdo->rollBack();foreach($stored as $filename)@unlink($directory.'/'.$filename);if($e instanceof ApiFailure)fail($e->status,$e->getMessage());throw $e; }
    }
    if ($route==='/api/vehicles' && $method==='POST') { $u=requireUser(); if (!(bool)$u['email_verified']) fail(403,'Debes verificar tu correo'); $v=$data['vehicle']??[]; $images=$v['images']??[]; if (!is_array($images)||count($images)>10) fail(400,'Un anuncio puede tener como máximo 10 imágenes.'); $id=(string)($v['id']??''); if (!$id||!$v['brand']||!$v['model']) fail(400,'Datos del vehículo no válidos'); $pdo=db(); $pdo->beginTransaction(); $q=$pdo->prepare('INSERT INTO dealerships(tenant_id,display_name,dealer_slug,phone_whatsapp) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE display_name=VALUES(display_name),phone_whatsapp=VALUES(phone_whatsapp)'); $q->execute([$u['user_id'],$u['name'],$u['user_id'],$u['phone']??'']); $q=$pdo->prepare('INSERT INTO vehicles(vehicle_id,tenant_id,brand,model,version,year,mileage_km,cash_price,dgt_badge,public_slug,metadata_json) VALUES(?,?,?,?,?,?,?,?,?,?,?)'); $slug=(string)($v['public_slug']??('vehiculo-'.bin2hex(random_bytes(8)))); $q->execute([$id,$u['user_id'],$v['brand'],$v['model'],$v['version']??'',(int)$v['year'],(int)($v['km']??0),(float)$v['price'],$v['badge']??'',$slug,json_encode($v,JSON_UNESCAPED_UNICODE)]); foreach($images as $i=>$url){$q=$pdo->prepare('INSERT INTO vehicle_images(image_id,vehicle_id,image_url,sort_order) VALUES(?,?,?,?)');$q->execute([$id.'-img-'.$i,$id,(string)$url,$i]);} $pdo->commit(); jsonResponse(['ok'=>true,'id'=>$id],201); }
    if ($route==='/api/report' && $method==='POST') { if (empty($data['listing_reference'])||empty($data['reason'])||empty($data['description'])||$data['privacy_consent']!==true) fail(400,'Faltan datos obligatorios'); $id='rep-'.bin2hex(random_bytes(6)); $q=db()->prepare('INSERT INTO ad_reports(report_id,listing_reference,reason,description,reporter_email,privacy_consent) VALUES(?,?,?,?,?,1)'); $q->execute([$id,$data['listing_reference'],$data['reason'],$data['description'],$data['email']??null]); jsonResponse(['ok'=>true,'id'=>$id],201); }
    if ($route==='/api/leads' && $method==='GET') { $u=requireUser(); $q=db()->prepare('SELECT lead_id,tenant_id,vehicle_id,buyer_name,phone,payment_method,score,created_at FROM leads WHERE tenant_id=? ORDER BY created_at DESC LIMIT 100'); $q->execute([$u['user_id']]); jsonResponse(['leads'=>$q->fetchAll()]); }
    if ($route==='/api/leads' && $method==='POST') { $data['tenant_id']=(string)(db()->query("SELECT tenant_id FROM vehicles WHERE vehicle_id=".db()->quote((string)($data['vehicle_id']??'')))->fetchColumn()?:''); if (!$data['tenant_id']) fail(404,'Vehículo no encontrado'); $id='lead-'.bin2hex(random_bytes(6)); $q=db()->prepare('INSERT INTO leads(lead_id,tenant_id,vehicle_id,buyer_name,phone,payment_method,score) VALUES(?,?,?,?,?,?,?)'); $q->execute([$id,$data['tenant_id'],$data['vehicle_id'],$data['buyer_name'],$data['phone'],$data['payment_method']??'',(int)($data['score']??0)]); jsonResponse(['ok'=>true,'id'=>$id],201); }
    fail(404,'Ruta no encontrada');
} catch (Throwable $e) { if (db()->inTransaction()) db()->rollBack(); fail(500,'No se pudo completar la operación'); }
