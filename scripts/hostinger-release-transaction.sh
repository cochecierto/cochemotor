#!/usr/bin/env bash
set -Eeuo pipefail

mode=${1:-}
web_root_name=${2:-}
stage_name=${3:-}
backup_name=${4:-}
release=${5:-}

[[ "$web_root_name" =~ ^[A-Za-z0-9_-]+$ ]] || { echo "invalid web root" >&2; exit 64; }
[[ "$stage_name" =~ ^\.cochemotor-stage-[A-Za-z0-9-]+$ ]] || { echo "invalid stage path" >&2; exit 64; }
[[ "$backup_name" =~ ^\.cochemotor-backup-[A-Za-z0-9-]+$ ]] || { echo "invalid backup path" >&2; exit 64; }
[[ "$release" =~ ^[0-9a-f]{40}$ ]] || { echo "invalid release SHA" >&2; exit 64; }

parent=$(pwd -P)
root="$parent/$web_root_name"
stage="$parent/$stage_name"
backup="$parent/$backup_name"
[[ -d "$root" ]] || { echo "web root not found" >&2; exit 66; }

# Serialize promotion and client-initiated recovery. flock releases the lock
# even if SSH drops and the remote process is terminated without running traps.
command -v flock >/dev/null 2>&1 || { echo "flock is required for safe promotion and rollback" >&2; exit 69; }
umask 077
exec 9>"$parent/.cochemotor-production.lock"
chmod 600 "$parent/.cochemotor-production.lock"
flock --exclusive --wait 180 9 || { echo "timed out waiting for release lock" >&2; exit 75; }

assets=(
  .htaccess robots.txt sitemap.xml sitemap-public.php seo-public.php seo-legacy-redirect.php
  index.html app.js demo-profesional.html demo-profesional.css demo-profesional.js styles.css
  cookie-consent.js cookie-consent.css site-config.js hub.js acceso.html marketplace.html demanda.html
  profesionales.html profesionales.css aviso-legal.html privacidad.html terminos.html ficha.html
  dealer.html perfil.html publicar.html hub.html vehiculo-nuevo.html asesor.html asesor-leads.html
  api/index.php assets/js/home_catalog.js assets/js/public-lead-form.js assets/data/vehicles_catalog.js
  assets/js/inventory_selectors.js assets/brand/category-02-compacto-proxima-entrada-cochemotor-branded-v2.png
  guias/comprar-coche-usado.html assets/images/inspeccion-taller-cochemotor.png
)

restore_release() {
  local i asset temp failed=0
  for ((i=${#assets[@]}-1; i>=0; i--)); do
    asset=${assets[$i]}
    if [[ -f "$backup/$asset" ]]; then
      mkdir -p "$root/$(dirname "$asset")"
      temp="$root/$asset.rollback-$release"
      if cp -p "$backup/$asset" "$temp" && mv -f "$temp" "$root/$asset"; then :; else failed=1; fi
    elif [[ -f "$backup/.absent/$asset" ]]; then
      rm -f "$root/$asset" || failed=1
    fi
  done
  if (( failed )); then echo "rollback incomplete; preserve $backup for manual recovery" >&2; return 1; fi
  printf '%s\n' "$release" > "$backup/.rollback-complete"
}

on_error() {
  local status=$?
  trap - ERR INT TERM
  if [[ -f "$backup/.promotion-started" ]]; then
    restore_release || echo "::error::Automatic rollback failed; recovery files are in $backup" >&2
  fi
  exit "$status"
}

case "$mode" in
  promote)
    [[ -d "$stage" && -f "$stage/release.sha256" ]] || { echo "staged package not found" >&2; exit 66; }
    (cd "$stage" && sha256sum --check --status release.sha256)
    [[ ! -e "$backup" ]] || { echo "backup path already exists" >&2; exit 73; }
    mkdir -p "$backup/.absent"
    trap on_error ERR INT TERM
    for asset in "${assets[@]}"; do
      [[ -f "$stage/$asset" ]] || { echo "missing staged asset: $asset" >&2; exit 66; }
      if [[ -f "$root/$asset" ]]; then
        mkdir -p "$backup/$(dirname "$asset")"
        cp -p "$root/$asset" "$backup/$asset"
      else
        mkdir -p "$backup/.absent/$(dirname "$asset")"
        : > "$backup/.absent/$asset"
      fi
    done
    printf '%s\n' "$release" > "$backup/.release"
    : > "$backup/.promotion-started"
    for asset in "${assets[@]}"; do
      mkdir -p "$root/$(dirname "$asset")"
      mv -f "$stage/$asset" "$root/$asset"
    done
    trap - ERR INT TERM
    echo "Promoted $release; rollback snapshot preserved at $backup"
    ;;
  rollback)
    [[ -f "$backup/.promotion-started" ]] || { echo "no promoted release to roll back" >&2; exit 66; }
    restore_release
    echo "Restored the previous release from $backup"
    ;;
  *)
    echo "usage: $0 {promote|rollback} WEB_ROOT STAGE BACKUP COMMIT_SHA" >&2
    exit 64
    ;;
esac
