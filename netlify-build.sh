#!/usr/bin/env bash
set -e

# 1. Flutter SDK를 $HOME/flutter 폴더에 설치 (이미 있으면 건너뛰고 캐시 사용)
if [ ! -d "$HOME/flutter" ]; then
  echo "Installing Flutter SDK..."
  git clone https://github.com/flutter/flutter.git -b stable "$HOME/flutter"
fi
export PATH="$HOME/flutter/bin:$PATH"

# 2. 웹 지원 활성화 및 필수 아티팩트 다운로드 (안드로이드/iOS 관련 도구는 건드리지 않음)
echo "Ensuring Flutter Web Support is active..."
flutter config --enable-web

# 3. pubspec.yaml 파일의 의존성을 가져옵니다.
flutter pub get

# 4. 앱을 웹용으로만 빌드합니다. (가장 중요)
flutter build web --release
