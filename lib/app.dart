import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 앱의 가장 큰 틀과 기본 설정을 담당합니다.
    return MaterialApp(
      title: 'Sogon App', 
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      // 앱이 시작될 때 가장 먼저 보여줄 화면을 지정합니다.
      home: const MyOriginalAppScreen(), 
    );
  }
}

// 당신의 앱 코드가 들어갈 최종 템플릿입니다.
// 이 클래스 전체를 지우고, 당신의 원래 앱 화면 클래스를 넣어주세요!
class MyOriginalAppScreen extends StatelessWidget {
  const MyOriginalAppScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Scaffold 안의 body에 당신의 앱 UI 코드를 넣어주세요.
    return const Scaffold(
      body: Center(
        child: Text(
          'SUCCESS! 여기에 당신의 원래 앱 위젯을 넣으세요.',
          style: TextStyle(fontSize: 20, color: Colors.green),
        ),
      ),
    );
  }
}