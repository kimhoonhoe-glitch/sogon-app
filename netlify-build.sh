#!/bin/bash
set -euo pipefail

# =========================================================================
# Netlify Flutter Build Script - (V4: 최종 안정화 및 Precache 추가)
# 권한 오류 해결 및 Web 빌드 환경을 미리 준비하여 실패율을 낮춥니다.
# =========================================================================

# Flutter를 설치할 안전한 경로를 설정합니다. Netlify에서는 $HOME이 안전합니다.
FLUTTER_INSTALL_DIR="${HOME}/flutter"

echo "--- 1. Checking and Installing Flutter SDK ---"

# 1. Netlify 환경에 Flutter가 없으면 자동으로 설치합니다.
if ! command -v flutter >/dev/null 2>&1; then
  echo "Flutter CLI not found. Installing Flutter SDK (stable branch) into: ${FLUTTER_INSTALL_DIR}"
  
  mkdir -p "${FLUTTER_INSTALL_DIR}"
  git clone --depth 1 https://github.com/flutter/flutter.git -b stable "${FLUTTER_INSTALL_DIR}"
fi

# 환경 변수(PATH)를 설정하여 'flutter' 명령어를 사용할 수 있게 만듭니다.
export PATH="${FLUTTER_INSTALL_DIR}/bin:${FLUTTER_INSTALL_DIR}/bin/cache/dart-sdk/bin:$PATH"

# 설치 확인 및 Web 툴체인 준비 (성공률을 높이는 핵심!)
echo "--- 1.5. Configuring Flutter for Web ---"
flutter --version
flutter precache --web # 웹 빌드에 필요한 도구를 미리 다운로드합니다.

# 2. 패키지 설치
echo "--- 2. Installing Flutter Packages (flutter pub get) ---"
# 이제 pubspec.yaml에 SDK 제약 조건이 있어서 성공합니다!
flutter pub get

# 3. Flutter Web 빌드 실행 (경로를 lib/main.dart로 지정)
echo "--- 3. Running Flutter Web Build with target lib/main.dart ---"

flutter build web --release --target=lib/main.dart

# 4. 빌드 결과 확인
if [ $? -eq 0 ]; then
    echo "--- 4. Flutter Web Build Succeeded ---"
else
    echo "--- 4. Flutter Web Build Failed ---"
    exit 1
fi
