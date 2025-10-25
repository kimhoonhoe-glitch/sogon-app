#!/usr/bin/env bash
set -euo pipefail

# 이것은 앱을 만드는 명령어입니다.
flutter --version
flutter pub get
flutter build web