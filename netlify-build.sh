#!/usr/bin/env bash
set -e

# 1. Flutter SDK를 $HOME/flutter 폴더에 설치 (이미 있으면 건너뜀)
if [ ! -d "$HOME/flutter" ]; then
  echo "Installing Flutter SDK..."
  git clone https://github.com/flutter/flutter.git -b stable "$HOME/flutter"
fi
export PATH="$HOME/flutter/bin:$PATH"

# 2. 웹 지원 활성화 및 필수 아티팩트 다운로드
echo "Enabling Flutter Web Support and Precaching..."
flutter config --enable-web
flutter precache --web

# 3. pubspec.yaml 파일의 의존성을 가져옵니다.
flutter pub get

# 4. 앱을 웹용으로 릴리즈 빌드합니다. (최종 단순화: --target 옵션 제거)
# Flutter가 lib/main.dart를 자동으로 찾게 합니다.
flutter build web --release