// lib/app.dart

import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // 이 Widget은 당신의 실제 앱의 최상위 Widget이어야 합니다.
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Sogon App',
      home: Scaffold(
        body: Center(
          child: Text('App is running!'),
        ),
      ),
    );
  }
}