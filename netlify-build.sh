#!/usr/bin/env bash
set -euo pipefail

# 1. Flutter SDK를 다운로드할 폴더를 정합니다. 
FLUTTER_DIR="${HOME}/.cache/flutter"

# 2. Flutter가 설치되지 않았다면, 다운로드합니다.
if [ ! -x "${FLUTTER_DIR}/bin/flutter" ]; then
  echo "Installing Flutter SDK to ${FLUTTER_DIR}..."
  mkdir -p "$(dirname "${FLUTTER_DIR}")"
  # 'stable' 버전의 Flutter를 다운로드합니다.
  git clone --depth 1 https://github.com/flutter/flutter.git -b stable "${FLUTTER_DIR}"
fi

# 3. Flutter 명령어를 사용할 수 있도록 경로를 설정합니다.
export PATH="${FLUTTER_DIR}/bin:${PATH}"

# 4. 웹 빌드에 필요한 파일을 미리 준비합니다.
flutter --version
flutter precache --web

# 5. 앱 빌드 명령어를 실행합니다.
flutter pub get
# 🌟🌟🌟 가장 중요한 수정 🌟🌟🌟
# 'lib/main.dart' 대신 실제 앱 시작 파일 경로를 입력하세요.
# 만약 'lib/src/main.dart'라면 아래처럼 수정합니다. (가장 흔한 경우)
flutter build web --release --target=lib/src/main.dart