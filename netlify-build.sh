#!/bin/bash

# =========================================================================
# Netlify Flutter Build Script
# lib/main.ts 파일이 실제 앱의 시작점(Entrypoint)임을 명확히 지정합니다.
# =========================================================================

# 1. Flutter 경로 설정 및 환경 확인
echo "--- 1. Setting up Flutter Environment ---"
export PATH="$HOME/flutter/bin:$PATH"

# 2. 패키지 설치
echo "--- 2. Installing Flutter Packages ---"
flutter pub get

# 3. Flutter Web 빌드 실행 (오류 해결 핵심)
# 'lib/main.ts' 파일을 앱의 시작점으로 지정합니다.
echo "--- 3. Running Flutter Web Build with target lib/main.ts ---"

# 이 줄이 핵심입니다. Netlify에게 진짜 시작 파일이 'lib/main.ts'라고 알려줍니다.
flutter build web --release --target=lib/main.ts

# 4. 빌드 결과 확인
if [ $? -eq 0 ]; then
    echo "--- 4. Flutter Web Build Succeeded ---"
else
    echo "--- 4. Flutter Web Build Failed ---"
    exit 1
fi
