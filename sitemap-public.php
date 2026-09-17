<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/cochemotor-private/config.php';
header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=900, s-maxage=900');
$origin='https://cochemotor.es';
$urls=['/','/profesionales','/marketplace','/demanda','/guias/comprar-coche-usado.html','/aviso-legal','/privacidad','/terminos'];
$dynamic=[];
try {
    $env=static function(string $key): ?string {$value=getenv($key);return $value!==false&&$value!==''?$value:(defined($key)?(string)constant($key):null);};
    $name=$env('COCHEMOTOR_DB_NAME');$user=$env('COCHEMOTOR_DB_USER');$pass=$env('COCHEMOTOR_DB_PASSWORD');
    if(!$name||!$user||!$pass) throw new RuntimeException('database not configured');
    {$host=$env('COCHEMOTOR_DB_HOST')?:'localhost';$port=$env('COCHEMOTOR_DB_PORT')?:'3306';$pdo=new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4",$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
        $q=$pdo->query("SELECT v.public_slug,v.updated_at FROM vehicles v JOIN professional_users u ON u.user_id=v.tenant_id WHERE v.status='disponible' AND v.stage='publicado' AND u.email_verified=1 AND EXISTS (SELECT 1 FROM publication_contacts pc WHERE pc.vehicle_id=v.vehicle_id AND pc.contact_verified=1) AND EXISTS (SELECT 1 FROM vehicle_images vi WHERE vi.vehicle_id=v.vehicle_id AND vi.image_url REGEXP '^uploads/vehicles/[a-f0-9]{40}[.]webp$') LIMIT 24990");
        foreach($q as $row) if(preg_match('/^[a-z0-9][a-z0-9-]{2,179}$/',(string)$row['public_slug'])) $dynamic[]=['/vehiculos/'.$row['public_slug'],substr((string)$row['updated_at'],0,10)];
        $q=$pdo->query("SELECT d.dealer_slug FROM dealerships d JOIN professional_users u ON u.user_id=d.tenant_id WHERE d.public_profile=1 AND d.public_profile_consent_version='public-profile-v1' AND u.email_verified=1 AND CHAR_LENGTH(TRIM(COALESCE(d.public_description,'')))>=80 AND EXISTS (SELECT 1 FROM vehicles v JOIN professional_users u2 ON u2.user_id=v.tenant_id WHERE v.tenant_id=d.tenant_id AND v.status='disponible' AND v.stage='publicado' AND u2.email_verified=1 AND EXISTS (SELECT 1 FROM publication_contacts pc WHERE pc.vehicle_id=v.vehicle_id AND pc.contact_verified=1) AND EXISTS (SELECT 1 FROM vehicle_images vi WHERE vi.vehicle_id=v.vehicle_id AND vi.image_url REGEXP '^uploads/vehicles/[a-f0-9]{40}[.]webp$')) LIMIT 24990");
        foreach($q as $row) if(preg_match('/^[a-z0-9][a-z0-9-]{2,179}$/',(string)$row['dealer_slug'])) $dynamic[]=['/profesionales/'.$row['dealer_slug'],''];
    }
} catch(Throwable $error) {
    error_log('CocheMotor public sitemap: database unavailable');
    http_response_code(503);
    header('Cache-Control: no-store');
    header('Retry-After: 300');
    exit;
}
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach($urls as $path) echo '  <url><loc>'.htmlspecialchars($origin.$path,ENT_XML1|ENT_QUOTES,'UTF-8')."</loc></url>\n";
foreach($dynamic as [$path,$date]) echo '  <url><loc>'.htmlspecialchars($origin.$path,ENT_XML1|ENT_QUOTES,'UTF-8').'</loc>'.($date!==''?'<lastmod>'.htmlspecialchars($date,ENT_XML1|ENT_QUOTES,'UTF-8').'</lastmod>':'')."</url>\n";
echo "</urlset>\n";
