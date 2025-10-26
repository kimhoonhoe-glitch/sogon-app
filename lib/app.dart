import 'package:flutter/material.dart';

// 1. main.dart 파일이 실행을 요청하는 main() 함수입니다.
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 2. 앱의 가장 큰 틀과 기본 설정을 담당합니다.
    return MaterialApp(
      title: 'Sogon App', // 브라우저 탭에 표시될 앱 이름을 넣어주세요.
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      // 3. 앱이 시작될 때 가장 먼저 보여줄 화면을 지정합니다.
      home: const MyOriginalAppScreen(), // ⬅️ 여기에 당신의 원래 앱 시작 위젯 이름을 넣어주세요.
    );
  }
} // <--- 빠졌던 첫 번째 닫는 괄호 (Line 28)

// 4. 당신의 원래 앱 코드가 들어갈 자리입니다. (임시 블록)
// ⚠️ 이 클래스 전체를 지우고, 당신의 원래 앱 코드를 넣어주세요!

// class MyOriginalAppScreen은 여전히 정의되지 않았기 때문에,
// 이 코드가 전체적으로 유효한 문법이 되도록 MyOriginalAppScreen 클래스를 임시로 다시 추가해야 합니다.

class MyOriginalAppScreen extends StatelessWidget {
  const MyOriginalAppScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('SUCCESS! 여기에 당신의 원래 앱 위젯을 넣으세요.'),
      ),
    );
  }
}
