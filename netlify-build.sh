#!/bin/bash
set -euo pipefail

# =========================================================================
# Netlify Flutter Build Script - (V2: Flutter 설치 및 경로 수정)
# =========================================================================

echo "--- 1. Checking and Installing Flutter SDK ---"

# 1. Netlify 환경에 Flutter가 없으면 자동으로 설치합니다. (오류 해결 핵심!)
if ! command -v flutter >/dev/null 2>&1; then
  echo "Flutter CLI not found. Installing Flutter SDK (stable branch)..."
  # Flutter SDK를 다운로드합니다.
  git clone --depth 1 https://github.com/flutter/flutter.git -b stable /opt/flutter
  # 환경 변수(PATH)를 설정하여 'flutter' 명령어를 사용할 수 있게 만듭니다.
  export PATH="/opt/flutter/bin:/opt/flutter/bin/cache/dart-sdk/bin:$PATH"
  flutter --version
fi

# 2. 패키지 설치
echo "--- 2. Installing Flutter Packages (flutter pub get) ---"
flutter pub get

# 3. Flutter Web 빌드 실행 (경로를 lib/main.dart로 수정)
# Flutter는 .dart 파일을 시작점으로 사용합니다.
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
