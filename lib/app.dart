import 'package:flutter/material.dart';

// 앱 시작 함수
void main() {
  runApp(const MyApp());
}

// MyApp 위젯 (super-parameters 오류가 수정된 버전입니다.)
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 🌟🌟🌟 1. MaterialApp 앞의 const 키워드를 제거했습니다.
    return MaterialApp( 
      title: 'Sogon App',
      // 🌟🌟🌟 2. Scaffold 앞의 const 키워드를 제거했습니다.
      home: Scaffold( 
        appBar: AppBar(
          title: const Text('App Deployment Successful!'), // Text는 const여도 됩니다.
          backgroundColor: Colors.blueGrey, // Colors.blueGrey는 const입니다.
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [ // Children 목록은 const여도 됩니다.
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
