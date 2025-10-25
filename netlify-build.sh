#!/bin/bash
set -euo pipefail

# =========================================================================
# Netlify Flutter Build Script - (V5: netlify.toml 연동용 간소화)
# Flutter 설치 및 환경 설정만 담당하며, 실제 빌드 명령은 netlify.toml이 담당합니다.
# =========================================================================

# Flutter를 설치할 안전한 경로를 설정합니다. ($HOME은 권한 문제가 없습니다)
FLUTTER_INSTALL_DIR="${HOME}/flutter"

echo "--- 1. Checking and Installing Flutter SDK ---"

# 1. Netlify 환경에 Flutter가 없으면 안전한 경로에 자동으로 설치합니다.
if ! command -v flutter >/dev/null 2>&1; then
  echo "Flutter CLI not found. Installing Flutter SDK (stable branch) into: ${FLUTTER_INSTALL_DIR}"

  mkdir -p "${FLUTTER_INSTALL_DIR}"
  git clone --depth 1 https://github.com/flutter/flutter.git -b stable "${FLUTTER_INSTALL_DIR}"
fi

# 환경 변수(PATH)를 설정하여 'flutter' 명령어를 사용할 수 있게 만듭니다.
export PATH="${FLUTTER_INSTALL_DIR}/bin:${FLUTTER_INSTALL_DIR}/bin/cache/dart-sdk/bin:$PATH"

# 설치 확인 및 Web 툴체인 준비 (필수 안정화 단계)
echo "--- 1.5. Configuring Flutter for Web ---"
flutter --version
flutter precache --web

echo "--- 2. Build environment setup complete. Netlify will now run the build command defined in netlify.toml ---"

# 스크립트 종료. netlify.toml의 command가 이어서 실행됩니다.
