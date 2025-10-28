import 'package:flutter/material.dart';

// main 함수: Flutter 앱의 시작점
void main() {
  // 앱 실행 시 Flutter 웹을 위한 설정이 자동으로 이루어집니다.
  runApp(const SogonApp());
}

// 최상위 위젯: 앱의 구조 정의
class SogonApp extends StatelessWidget {
  const SogonApp({super.key});

  @override
  Widget build(BuildContext context) {
    // MaterialApp을 사용하여 기본적인 디자인 시스템을 적용합니다.
    return MaterialApp(
      title: '소곤 AI 상담 앱 (Clean Template)',
      theme: ThemeData(
        primarySwatch: Colors.deepPurple, // 앱의 주 색상 설정
        useMaterial3: true,
      ),
      home: const HomeScreen(), // 앱이 시작될 때 표시할 화면
    );
  }
}

// 메인 화면 위젯: 앱의 내용을 담는 공간
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('소곤 앱 - 전문가 시스템 복구 완료'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              // 성공적인 복구를 알리는 메시지
              Icon(
                Icons.check_circle_outline,
                color: Colors.green,
                size: 60,
              ),
              SizedBox(height: 20),
              Text(
                '시스템 복구 완료 및 클린 템플릿 준비됨',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.deepPurple,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 10),
              Text(
                '이제 Netlify 빌드 및 Git 정리 작업을 진행하세요. 이 코드는 에러 없이 실행될 것입니다.',
                style: TextStyle(fontSize: 16, color: Colors.black54),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
