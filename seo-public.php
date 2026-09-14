<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/cochemotor-private/config.php';

const CM_ORIGIN = 'https://cochemotor.es';
function cmDb(): PDO {
    static $pdo;
    if ($pdo instanceof PDO) return $pdo;
    $env=static function(string $key): ?string { $value=getenv($key); return $value!==false&&$value!==''?$value:(defined($key)?(string)constant($key):null); };
    $host=$env('COCHEMOTOR_DB_HOST')?:'localhost'; $port=$env('COCHEMOTOR_DB_PORT')?:'3306';
    $name=$env('COCHEMOTOR_DB_NAME'); $user=$env('COCHEMOTOR_DB_USER'); $pass=$env('COCHEMOTOR_DB_PASSWORD');
    if(!$name||!$user||!$pass) throw new RuntimeException('database unavailable');
    return $pdo=new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4",$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
}
function cmE(mixed $value): string { return htmlspecialchars((string)$value,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8'); }
function cmJson(array $value): string { return json_encode($value,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_AMP|JSON_HEX_QUOT|JSON_THROW_ON_ERROR); }
function cmLength(string $value): int { $length=preg_match_all('/./us',$value); return $length===false?PHP_INT_MAX:$length; }
function cmShort(string $value,int $length): string { return function_exists('mb_substr')?mb_substr($value,0,$length,'UTF-8'):substr($value,0,$length); }
function cmNotFound(): never {
    http_response_code(404); header('X-Robots-Tag: noindex, nofollow'); header('Cache-Control: no-store');
    echo '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>No encontramos esta página | CocheMotor</title><body style="font:16px system-ui;max-width:680px;margin:12vh auto;padding:24px;color:#102d50"><h1>No encontramos esta página</h1><p>Puede que el anuncio ya no esté disponible o que el enlace no sea correcto.</p><p><a href="/marketplace.html">Volver a los coches disponibles</a></p></body></html>';
    exit;
}
function cmLayout(string $title,string $description,string $canonical,array $schema,string $body,string $image='',bool $indexable=true): never {
    header('Content-Type: text/html; charset=UTF-8'); header('X-Content-Type-Options: nosniff'); header('Cache-Control: public, max-age=300, s-maxage=300');
    if(!$indexable)header('X-Robots-Tag: noindex, follow');
    $og=$image!==''?'<meta property="og:image" content="'.cmE($image).'">':'';
    $json=cmJson(['@context'=>'https://schema.org','@graph'=>$schema]);
    echo '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'.cmE($title).'</title><meta name="description" content="'.cmE($description).'"><link rel="canonical" href="'.cmE($canonical).'"><meta property="og:type" content="website"><meta property="og:site_name" content="CocheMotor"><meta property="og:title" content="'.cmE($title).'"><meta property="og:description" content="'.cmE($description).'">'.$og.'<meta name="twitter:card" content="'.($image!==''?'summary_large_image':'summary').'"> <meta name="twitter:title" content="'.cmE($title).'"><meta name="twitter:description" content="'.cmE($description).'"><link rel="stylesheet" href="/styles.css?v=4.0"><script type="application/ld+json">'.$json.'</script><style>body{background:#f4f7fb;color:#102d50}.seo-wrap{max-width:1080px;margin:40px auto;padding:0 20px}.seo-card{background:#fff;border:1px solid #d6e0ec;border-radius:20px;padding:clamp(22px,5vw,48px);box-shadow:0 14px 38px #0b2c5010}.seo-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(250px,.8fr);gap:32px;align-items:start}.seo-photo{width:100%;max-height:420px;object-fit:cover;border-radius:14px;background:#edf2f7}.seo-price{font-size:2rem;font-weight:800;color:#0b315e}.seo-facts{display:flex;gap:8px;flex-wrap:wrap;margin:20px 0}.seo-fact{background:#eef3f9;padding:9px 12px;border-radius:9px}.seo-action{display:inline-flex;background:#d5222a;color:#fff!important;font-weight:700;text-decoration:none;padding:13px 18px;border-radius:10px}.seo-note{font-size:.88rem;color:#586b81;line-height:1.6}.seo-list{display:grid;gap:12px;padding:0;list-style:none}.seo-list li{padding:16px;border:1px solid #d6e0ec;border-radius:12px}.seo-car-item{display:flex;gap:14px;align-items:center}.seo-car-photo{width:128px;height:88px;flex:0 0 128px;object-fit:cover;border-radius:9px;background:#edf2f7}.seo-top{margin:0 0 24px}.seo-brand{font-weight:800;color:#0b315e;text-decoration:none}:focus-visible{outline:3px solid #216bd6;outline-offset:3px}.seo-action:hover{background:#b91c24}@media(max-width:700px){.seo-grid{grid-template-columns:1fr}.seo-wrap{margin:20px auto}.seo-car-photo{width:92px;height:72px;flex-basis:92px}header.seo-header{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}header.seo-header nav{display:flex;gap:14px;flex-wrap:wrap}}</style></head><body><header class="seo-header" style="background:#fff;border-bottom:1px solid #dce4ef;padding:16px 20px"><a class="seo-brand" href="/">CocheMotor</a><nav><a href="/marketplace.html">Buscar coches</a><a href="/profesionales.html">Soy profesional</a></nav></header>'.$body.'</body></html>';
}

try {
    $kind=(string)($_GET['kind']??''); $slug=trim((string)($_GET['slug']??''));
    if(!in_array($kind,['vehicle','dealer'],true)||!preg_match('/^[a-z0-9][a-z0-9-]{2,179}$/',$slug)) cmNotFound();
    $pdo=cmDb();
    $eligibleVehicle="v.status='disponible' AND v.stage='publicado' AND u.email_verified=1 AND EXISTS (SELECT 1 FROM publication_contacts pc WHERE pc.vehicle_id=v.vehicle_id AND pc.contact_verified=1)";
    if($kind==='vehicle') {
        $q=$pdo->prepare("SELECT v.vehicle_id,v.brand,v.model,v.version,v.year,v.mileage_km,v.cash_price,v.dgt_badge,v.public_slug,v.metadata_json,d.display_name,d.dealer_slug,d.public_profile,d.public_profile_consent_version,d.public_description FROM vehicles v JOIN dealerships d ON d.tenant_id=v.tenant_id JOIN professional_users u ON u.user_id=v.tenant_id WHERE v.public_slug=? AND $eligibleVehicle LIMIT 1");
        $q->execute([$slug]); $car=$q->fetch(); if(!$car) cmNotFound();
        $img=$pdo->prepare('SELECT image_url FROM vehicle_images WHERE vehicle_id=? ORDER BY sort_order LIMIT 10'); $img->execute([$car['vehicle_id']]); $images=array_values(array_filter(array_map(static function($path){$path=(string)$path;return preg_match('#^uploads/vehicles/[a-f0-9]{40}\.webp$#',$path)?CM_ORIGIN.'/'.$path:null;},$img->fetchAll(PDO::FETCH_COLUMN))));
        $indexable=count($images)>0;
        $meta=json_decode((string)$car['metadata_json'],true); if(!is_array($meta))$meta=[];
        $location=trim((string)($meta['location']??'')); $year=(int)$car['year']; $price=(float)$car['cash_price']; $km=(int)$car['mileage_km'];
        $name=trim($car['brand'].' '.$car['model'].' '.$car['version']); $title=$name.' de '.$year.' | CocheMotor';
        $publicDealer=(int)$car['public_profile']===1&&$car['public_profile_consent_version']==='public-profile-v1'&&cmLength(trim((string)$car['public_description']))>=80;
        $priceText=number_format($price,abs($price-round($price,0))<0.005?0:2,',','.');
        $description=cmShort($name.' de '.$year.' con '.number_format($km,0,',','.').' km por '.$priceText.' €. '.($location!==''?'Ubicado en '.$location.'. ':'').'Información facilitada por el vendedor.',155);
        $url=CM_ORIGIN.'/vehiculos/'.$car['public_slug']; $image=$images[0]??'';
        $cta=$publicDealer?'<a class="seo-action" href="/profesionales/'.rawurlencode((string)$car['dealer_slug']).'">Ver perfil de '.cmE($car['display_name']).'</a>':'<a class="seo-action" href="/marketplace.html">Ver coches disponibles</a>';
        $body='<main class="seo-wrap"><p class="seo-top"><a href="/marketplace.html">Coches disponibles</a> / '.cmE($car['brand']).' / '.cmE($car['model']).'</p><article class="seo-card"><div class="seo-grid"><div>'.($image!==''?'<img class="seo-photo" src="'.cmE($image).'" alt="'.cmE($name).'" fetchpriority="high">':'<div class="seo-photo" role="img" aria-label="Foto no disponible" style="height:280px"></div>').'</div><div><p class="seo-note">Vehículo de ocasión · Anuncio publicado por un profesional</p><h1>'.cmE($name).'</h1><p class="seo-price">'.$priceText.' €</p><div class="seo-facts"><span class="seo-fact">Año '.(int)$year.'</span><span class="seo-fact">'.number_format($km,0,',','.').' km</span>'.($location!==''?'<span class="seo-fact">'.cmE($location).'</span>':'').'</div><p>Versión: '.cmE($car['version']?:'No indicada').'</p><p>Distintivo ambiental indicado por el vendedor: '.cmE($car['dgt_badge']?:'No indicado').'. Confirma la información con la documentación oficial antes de comprar.</p><p class="seo-note">Los datos de esta ficha los facilita el vendedor. CocheMotor no certifica el estado mecánico ni la situación administrativa del vehículo.</p>'.$cta.'</div></div></article></main>';
        $vehicleSchema=['@type'=>['Product','Car'],'name'=>$name,'description'=>$description,'brand'=>['@type'=>'Brand','name'=>$car['brand']],'model'=>$car['model'],'vehicleModelDate'=>(string)$year,'mileageFromOdometer'=>['@type'=>'QuantitativeValue','value'=>$km,'unitCode'=>'KMT'],'offers'=>['@type'=>'Offer','url'=>$url,'priceCurrency'=>'EUR','price'=>number_format($price,2,'.',''),'availability'=>'https://schema.org/InStock','itemCondition'=>'https://schema.org/UsedCondition']];
        if($images)$vehicleSchema['image']=$images;
        $schema=[['@type'=>'BreadcrumbList','itemListElement'=>[['@type'=>'ListItem','position'=>1,'name'=>'Inicio','item'=>CM_ORIGIN.'/'],['@type'=>'ListItem','position'=>2,'name'=>'Coches disponibles','item'=>CM_ORIGIN.'/marketplace.html'],['@type'=>'ListItem','position'=>3,'name'=>$name,'item'=>$url]]],$vehicleSchema];
        cmLayout($title,$description,$url,$schema,$body,$image,$indexable);
    }
    $eligible="v.status='disponible' AND v.stage='publicado' AND u2.email_verified=1 AND EXISTS (SELECT 1 FROM publication_contacts pc WHERE pc.vehicle_id=v.vehicle_id AND pc.contact_verified=1)";
    $eligibleIndexable=$eligible." AND EXISTS (SELECT 1 FROM vehicle_images vi WHERE vi.vehicle_id=v.vehicle_id AND vi.image_url REGEXP '^uploads/vehicles/[a-f0-9]{40}[.]webp$')";
    $q=$pdo->prepare("SELECT d.tenant_id,d.display_name,d.dealer_slug,d.public_description FROM dealerships d JOIN professional_users u ON u.user_id=d.tenant_id WHERE d.dealer_slug=? AND d.public_profile=1 AND d.public_profile_consent_version='public-profile-v1' AND u.email_verified=1 AND CHAR_LENGTH(TRIM(COALESCE(d.public_description,'')))>=80 AND EXISTS (SELECT 1 FROM vehicles v JOIN professional_users u2 ON u2.user_id=v.tenant_id WHERE v.tenant_id=d.tenant_id AND $eligibleIndexable) LIMIT 1");
    $q->execute([$slug]); $dealer=$q->fetch(); if(!$dealer) cmNotFound();
    $q=$pdo->prepare("SELECT v.brand,v.model,v.version,v.year,v.mileage_km,v.cash_price,v.public_slug,v.metadata_json,(SELECT vi.image_url FROM vehicle_images vi WHERE vi.vehicle_id=v.vehicle_id AND vi.image_url REGEXP '^uploads/vehicles/[a-f0-9]{40}[.]webp$' ORDER BY vi.sort_order LIMIT 1) AS image_path FROM vehicles v JOIN professional_users u2 ON u2.user_id=v.tenant_id WHERE v.tenant_id=? AND $eligibleIndexable ORDER BY v.updated_at DESC LIMIT 100");
    $q->execute([$dealer['tenant_id']]); $cars=$q->fetchAll();
    $title=$dealer['display_name'].' | Profesional de vehículos de ocasión | CocheMotor';
    $description=cmShort(trim((string)$dealer['public_description']),155); $url=CM_ORIGIN.'/profesionales/'.$dealer['dealer_slug'];
    $items=''; foreach($cars as $car){$label=trim($car['brand'].' '.$car['model'].' '.$car['version']);$imagePath=(string)($car['image_path']??'');$carImage=preg_match('#^uploads/vehicles/[a-f0-9]{40}\.webp$#',$imagePath)?CM_ORIGIN.'/'.$imagePath:'';$items.='<li class="seo-car-item">'.($carImage!==''?'<img class="seo-car-photo" src="'.cmE($carImage).'" alt="'.cmE($label).'" loading="lazy">':'').'<div><a href="/vehiculos/'.rawurlencode($car['public_slug']).'"><strong>'.cmE($label).'</strong></a><br>'.number_format((float)$car['cash_price'],0,',','.').' € · '.(int)$car['year'].' · '.number_format((int)$car['mileage_km'],0,',','.').' km</div></li>';}
    $body='<main class="seo-wrap"><p class="seo-top"><a href="/">Inicio</a> / Profesionales</p><article class="seo-card"><p class="seo-note">Perfil profesional público</p><h1>'.cmE($dealer['display_name']).'</h1><p>'.nl2br(cmE($dealer['public_description'])).'</p><h2>Vehículos disponibles</h2>'.($items!==''?'<ul class="seo-list">'.$items.'</ul>':'<p class="seo-note">No hay vehículos disponibles publicados en este momento.</p>').'<p class="seo-note">La información del perfil ha sido facilitada por el profesional. CocheMotor no verifica las afirmaciones comerciales del perfil.</p></article></main>';
    $schema=[['@type'=>'BreadcrumbList','itemListElement'=>[['@type'=>'ListItem','position'=>1,'name'=>'Inicio','item'=>CM_ORIGIN.'/'],['@type'=>'ListItem','position'=>2,'name'=>'Profesionales','item'=>CM_ORIGIN.'/profesionales.html'],['@type'=>'ListItem','position'=>3,'name'=>$dealer['display_name'],'item'=>$url]]],['@type'=>'Organization','name'=>$dealer['display_name'],'url'=>$url,'description'=>$description]];
    cmLayout($title,$description,$url,$schema,$body);
} catch(Throwable $error) {
    http_response_code(503); header('X-Robots-Tag: noindex, nofollow'); header('Retry-After: 300'); header('Content-Type: text/plain; charset=UTF-8'); echo 'El servicio de páginas públicas no está disponible temporalmente.';
}
