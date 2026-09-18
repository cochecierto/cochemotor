import os
import subprocess
import sys

def main():
    ssh_host = os.environ.get("SSH_HOST")
    ssh_user = os.environ.get("SSH_USER")
    key_path = os.environ.get("KEY_PATH")
    known_hosts = os.environ.get("KNOWN_HOSTS")
    client_id = os.environ.get("GOOGLE_CLIENT_ID")
    client_secret = os.environ.get("GOOGLE_CLIENT_SECRET")

    if not all([ssh_host, ssh_user, key_path, known_hosts, client_id, client_secret]):
        sys.exit("Faltan variables de entorno requeridas.")

    remote_bash = (
        "set -euo pipefail\n"
        "TARGET=''\n"
        "for candidate in ~/cochemotor-private/config.php ~/domains/*/cochemotor-private/config.php /home/*/cochemotor-private/config.php /home/*/domains/*/cochemotor-private/config.php; do\n"
        "  if [ -f \"$candidate\" ]; then TARGET=\"$candidate\"; break; fi\n"
        "done\n"
        "if [ -z \"$TARGET\" ]; then\n"
        "  mkdir -p ~/cochemotor-private\n"
        "  TARGET=~/cochemotor-private/config.php\n"
        "  touch \"$TARGET\"\n"
        "fi\n"
        "echo \"Encontrado: $TARGET\"\n"
        "sed -i '/GOOGLE_CLIENT_ID/d' \"$TARGET\"\n"
        "sed -i '/GOOGLE_CLIENT_SECRET/d' \"$TARGET\"\n"
        f"printf \"\\nputenv('GOOGLE_CLIENT_ID={client_id}');\\nputenv('GOOGLE_CLIENT_SECRET={client_secret}');\\n\" >> \"$TARGET\"\n"
        "echo 'OK: Credenciales inyectadas correctamente.'\n"
        "php -l \"$TARGET\"\n"
    )

    ssh_cmd = [
        "ssh", "-p", "65002",
        "-i", key_path,
        "-o", "IdentitiesOnly=yes",
        "-o", "BatchMode=yes",
        "-o", "StrictHostKeyChecking=yes",
        f"-oUserKnownHostsFile={known_hosts}",
        f"{ssh_user}@{ssh_host}",
        remote_bash
    ]
    print("Ejecutando actualización vía SSH...")
    p = subprocess.run(ssh_cmd, capture_output=True, text=True)
    print("STDOUT:", p.stdout)
    if p.stderr:
        print("STDERR:", p.stderr)

    if p.returncode == 0 and "OK:" in p.stdout:
        print("Configuración completada con éxito.")
        return

    print("SSH falló o shell no interactiva. Intentando vía SFTP...")
    # SFTP Fallback
    local_cfg = "/tmp/cochemotor_config.php"
    batch_get = "/tmp/sftp_get.txt"
    with open(batch_get, "w") as f:
        f.write(f"-get cochemotor-private/config.php {local_cfg}\n")
        f.write(f"-get domains/cochemotor.es/cochemotor-private/config.php {local_cfg}\n")

    sftp_get_cmd = [
        "sftp", "-P", "65002",
        "-i", key_path,
        "-o", "IdentitiesOnly=yes",
        "-o", "BatchMode=yes",
        "-o", "StrictHostKeyChecking=yes",
        f"-oUserKnownHostsFile={known_hosts}",
        "-b", batch_get,
        f"{ssh_user}@{ssh_host}"
    ]
    subprocess.run(sftp_get_cmd)

    if not os.path.exists(local_cfg):
        with open(local_cfg, "w") as f:
            f.write("<?php\n")

    with open(local_cfg, "r") as f:
        lines = f.readlines()
    clean_lines = [l for l in lines if "GOOGLE_CLIENT_ID" not in l and "GOOGLE_CLIENT_SECRET" not in l]
    clean_lines.append(f"\nputenv('GOOGLE_CLIENT_ID={client_id}');\n")
    clean_lines.append(f"putenv('GOOGLE_CLIENT_SECRET={client_secret}');\n")

    with open(local_cfg, "w") as f:
        f.writelines(clean_lines)

    batch_put = "/tmp/sftp_put.txt"
    with open(batch_put, "w") as f:
        f.write("-mkdir cochemotor-private\n")
        f.write(f"put {local_cfg} cochemotor-private/config.php\n")

    sftp_put_cmd = [
        "sftp", "-P", "65002",
        "-i", key_path,
        "-o", "IdentitiesOnly=yes",
        "-o", "BatchMode=yes",
        "-o", "StrictHostKeyChecking=yes",
        f"-oUserKnownHostsFile={known_hosts}",
        "-b", batch_put,
        f"{ssh_user}@{ssh_host}"
    ]
    p_put = subprocess.run(sftp_put_cmd, capture_output=True, text=True)
    print("SFTP STDOUT:", p_put.stdout)
    if p_put.stderr:
        print("SFTP STDERR:", p_put.stderr)
    if p_put.returncode != 0:
        sys.exit("Fallo al subir configuración privada vía SFTP.")

if __name__ == "__main__":
    main()
