#!/usr/bin/env bash
set -e

# 1. Flutter SDK 설치
git clone --depth 1 https://github.com/flutter/flutter.git -b stable "$HOME/flutter"

# 2. PATH에 Flutter 추가
export PATH="$HOME/flutter/bin:$PATH"

# 3. Flutter Web 도구 활성화 및 precache
flutter config --enable-web
flutter precache --web

# ★★★ 중요: pub get을 제거했습니다. pubspec.lock에 의존합니다. ★★★

# 4. 웹 빌드 실행
flutter build web --release