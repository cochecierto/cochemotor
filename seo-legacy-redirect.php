<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/cochemotor-private/config.php';

try {
    $id=(string)($_GET['id']??''); $kind=(string)($_GET['kind']??'');
    if(!in_array($kind,['vehicle','dealer'],true)||!preg_match($kind==='dealer'?'/^[A-Za-z0-9_-]{1,180}$/':'/^[A-Za-z0-9_-]{1,80}$/',$id)) throw new RuntimeException('invalid legacy route');
    $env=static function(string $key): ?string {$value=getenv($key);return $value!==false&&$value!==''?$value:(defined($key)?(string)constant($key):null);};
    $name=$env('COCHEMOTOR_DB_NAME');$user=$env('COCHEMOTOR_DB_USER');$pass=$env('COCHEMOTOR_DB_PASSWORD');
    if(!$name||!$user||!$pass) throw new RuntimeException('database unavailable');
    $host=$env('COCHEMOTOR_DB_HOST')?:'localhost';$port=$env('COCHEMOTOR_DB_PORT')?:'3306';
    $pdo=new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4",$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
    if($kind==='vehicle') {
        $q=$pdo->prepare("SELECT v.public_slug FROM vehicles v JOIN professional_users u ON u.user_id=v.tenant_id WHERE v.vehicle_id=? AND v.status='disponible' AND v.stage='publicado' AND u.email_verified=1 AND EXISTS (SELECT 1 FROM publication_contacts pc WHERE pc.vehicle_id=v.vehicle_id AND pc.contact_verified=1) LIMIT 1");
        $q->execute([$id]);$slug=$q->fetchColumn();if($slug&&preg_match('/^[a-z0-9][a-z0-9-]{2,179}$/',(string)$slug)){header('Location: /vehiculos/'.$slug,true,301);exit;}
        header('X-Robots-Tag: noindex, follow');header('Content-Type: text/html; charset=UTF-8');readfile(__DIR__.'/ficha.html');exit;
    }
    $q=$pdo->prepare("SELECT d.dealer_slug FROM dealerships d JOIN professional_users u ON u.user_id=d.tenant_id WHERE (d.tenant_id=? OR d.dealer_slug=?) AND d.public_profile=1 AND d.public_profile_consent_version='public-profile-v1' AND u.email_verified=1 AND CHAR_LENGTH(TRIM(COALESCE(d.public_description,'')))>=80 AND EXISTS (SELECT 1 FROM vehicles v JOIN professional_users u2 ON u2.user_id=v.tenant_id WHERE v.tenant_id=d.tenant_id AND v.status='disponible' AND v.stage='publicado' AND u2.email_verified=1 AND EXISTS (SELECT 1 FROM publication_contacts pc WHERE pc.vehicle_id=v.vehicle_id AND pc.contact_verified=1)) LIMIT 1");
    $q->execute([$id,$id]);$slug=$q->fetchColumn();if($slug&&preg_match('/^[a-z0-9][a-z0-9-]{2,179}$/',(string)$slug)){header('Location: /profesionales/'.$slug,true,301);exit;}
    header('X-Robots-Tag: noindex, follow');header('Content-Type: text/html; charset=UTF-8');readfile(__DIR__.'/dealer.html');exit;
} catch(Throwable $error) {
    http_response_code(503);header('X-Robots-Tag: noindex, nofollow');header('Retry-After: 300');header('Content-Type: text/plain; charset=UTF-8');echo 'El servicio de páginas públicas no está disponible temporalmente.';
}
