#!/usr/bin/env bash
set -e

# 1. Flutter SDK 설치
git clone --depth 1 https://github.com/flutter/flutter.git -b stable "$HOME/flutter"

# 2. PATH에 Flutter 추가
export PATH="$HOME/flutter/bin:$PATH"

# 3. Flutter Web 도구 활성화 및 precache
flutter config --enable-web
flutter precache --web

# 4. 의존성 설치 및 웹 빌드 실행
# 이 명령이 pubspec.yaml을 찾을 것입니다.
flutter pub get
flutter build web --release