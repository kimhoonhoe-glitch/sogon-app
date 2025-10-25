#!/bin/bash
set -euo pipefail

# =========================================================================
# Netlify Flutter Build Script - (V3: 안전한 설치 경로 및 빌드)
# Netlify에서 쓰기 권한이 있는 $HOME 폴더를 사용하여 권한 오류를 해결합니다.
# =========================================================================

# Flutter를 설치할 안전한 경로를 설정합니다. Netlify에서는 $HOME이 안전합니다.
FLUTTER_INSTALL_DIR="${HOME}/flutter"

echo "--- 1. Checking and Installing Flutter SDK ---"

# 1. Netlify 환경에 Flutter가 없으면 자동으로 설치합니다. (권한 오류 해결 핵심!)
if ! command -v flutter >/dev/null 2>&1; then
  echo "Flutter CLI not found. Installing Flutter SDK (stable branch) into: ${FLUTTER_INSTALL_DIR}"

  # 설치 폴더가 없으면 만듭니다.
  mkdir -p "${FLUTTER_INSTALL_DIR}"

  # Flutter SDK를 안전한 폴더에 다운로드합니다.
  git clone --depth 1 https://github.com/flutter/flutter.git -b stable "${FLUTTER_INSTALL_DIR}"
fi

# 환경 변수(PATH)를 설정하여 'flutter' 명령어를 사용할 수 있게 만듭니다.
export PATH="${FLUTTER_INSTALL_DIR}/bin:${FLUTTER_INSTALL_DIR}/bin/cache/dart-sdk/bin:$PATH"

# 설치 확인
flutter --version

# 2. 패키지 설치
echo "--- 2. Installing Flutter Packages (flutter pub get) ---"
flutter pub get

# 3. Flutter Web 빌드 실행 (경로를 lib/main.dart로 지정)
echo "--- 3. Running Flutter Web Build with target lib/main.dart ---"

# 이제 Netlify가 Flutter를 설치하고 정확한 경로를 찾아 빌드합니다!
flutter build web --release --target=lib/main.dart

# 4. 빌드 결과 확인
if [ $? -eq 0 ]; then
    echo "--- 4. Flutter Web Build Succeeded ---"
else
    echo "--- 4. Flutter Web Build Failed ---"
    exit 1
fi