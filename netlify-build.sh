#!/usr/bin/env bash
set -e

# ★★★ 중요: 폴더 이동(cd) 명령을 제거했습니다. 빌드는 루트에서 실행됩니다. ★★★

# 1. Flutter SDK 설치
git clone --depth 1 https://github.com/flutter/flutter.git -b stable "$HOME/flutter"

# 2. PATH에 Flutter 추가
export PATH="$HOME/flutter/bin:$PATH"

# 3. Flutter Web 도구 활성화 및 precache
flutter config --enable-web
flutter precache --web

# 4. 의존성 설치 및 웹 빌드 실행
flutter pub get
flutter build web --release