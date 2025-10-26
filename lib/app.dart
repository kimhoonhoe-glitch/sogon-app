import 'package:flutter/material.dart';

// 앱 시작 함수
void main() {
  runApp(const MyApp());
}

// MyApp 위젯 (super-parameters 오류가 수정된 버전입니다.)
class MyApp extends StatelessWidget {
  // 이전 오류 코드: const MyApp({super.key});
  // 수정 코드: 명시적으로 Key를 받아서 super로 전달합니다. (오래된 Dart 버전 호환)
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 실제 앱의 최상위 위젯으로 교체해야 합니다. 
    // 임시로 실행되는지 확인하기 위한 코드입니다.
    return const MaterialApp(
      title: 'Sogon App',
      home: Scaffold(
        appBar: AppBar(
          title: Text('App Deployment Successful!'),
          backgroundColor: Colors.blueGrey,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '5일간의 무한 루프가 끝났습니다.',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              Text('이제 빌드가 성공할 것입니다!', style: TextStyle(fontSize: 16)),
            ],
          ),
        ),
      ),
    );
  }
}