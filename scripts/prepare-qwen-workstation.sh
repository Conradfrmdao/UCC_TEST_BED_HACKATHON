#!/usr/bin/env bash
# Run locally in Ubuntu on the assigned Surface. No sudo or package installs.
set -euo pipefail

project_dir="$HOME/group_6_ucc_hackathon/ai-service"
model_dir="$project_dir/models/qwen3-vl-2b-instruct"
for command in curl sha256sum df; do
  command -v "$command" >/dev/null || { printf 'Missing required command: %s\n' "$command" >&2; exit 1; }
done

printf 'Host: '; hostname
printf '\nGPU availability:\n'
if command -v nvidia-smi >/dev/null; then nvidia-smi --query-gpu=name,memory.total,memory.free --format=csv || true; else printf 'nvidia-smi unavailable; GPU support has not been verified.\n'; fi
if [ -x /opt/hackathon/venv/bin/python ]; then
  /opt/hackathon/venv/bin/python -c 'import sys; print("Python:", sys.version); import torch; print("PyTorch:", torch.__version__, "CUDA available:", torch.cuda.is_available())' || printf 'Python/PyTorch check failed.\n'
else printf 'Shared Python environment not found.\n'; fi

mkdir -p "$model_dir"
printf '\nAvailable disk space:\n'
df -h "$model_dir"
available_kb=$(df -Pk "$model_dir" | awk 'NR==2 {print $4}')
if [ "${available_kb:-0}" -lt 3000000 ]; then printf 'At least 3 GB free disk space is required.\n' >&2; exit 1; fi
cd "$model_dir"
base='https://huggingface.co/Qwen/Qwen3-VL-2B-Instruct-GGUF/resolve/d38d39f'
download_checked() {
  local file="$1" expected="$2"
  if [ -e "$file" ]; then
    printf 'Checking existing %s\n' "$file"
    printf '%s  %s\n' "$expected" "$file" | sha256sum --check || { printf 'Existing file differs; leaving it untouched.\n' >&2; exit 1; }
    return
  fi
  curl --fail --location --retry 3 --continue-at - --output "$file.part" "$base/$file"
  printf '%s  %s\n' "$expected" "$file.part" | sha256sum --check
  mv -n -- "$file.part" "$file"
}
download_checked 'Qwen3VL-2B-Instruct-Q4_K_M.gguf' '089d75c52f4b7ffc56ba998ffc50aae89fcafc755f9e7208aacca281dca6c2ae'
download_checked 'mmproj-Qwen3VL-2B-Instruct-Q8_0.gguf' 'f9a68fabba69c3b81e153367b2c7521030b0fa8bb0de400c9599c8e6725f9c82'
printf '\nModel files saved in %s\n' "$model_dir"
printf 'Download complete; runtime installation, GPU compatibility and performance still need testing.\n'
