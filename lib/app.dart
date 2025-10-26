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
      title: 'Sogon App', // 앱 이름을 넣어주세요.
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      // 3. 5일 전 코드로 추정되는 'HomeView'를 시작 화면으로 지정합니다.
      home: const HomeView(), 
    );
  }
}

// 4. ⚠️ 5일 전 코드로 추정되는 당신의 원래 앱 클래스입니다.
// 이 클래스 안에 당신의 모든 화면 코드가 들어있습니다.
class HomeView extends StatelessWidget {
  const HomeView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 이 부분에 당신의 원래 앱 화면 로직이 들어있습니다.
    return const Scaffold(
      appBar: AppBar(
        title: Text('5일 전, 당신의 원래 앱 제목'), 
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '당신의 원래 앱 화면입니다.',
              style: TextStyle(fontSize: 20),
            ),
            SizedBox(height: 20),
            // 이곳에 당신의 버튼이나 다른 위젯이 있을 것입니다.
            ElevatedButton(
              onPressed: () {
                // 버튼 기능
              },
              child: Text('앱 시작'),
            ),
          ],
        ),
      ),
    );
  }
}
