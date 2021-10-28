import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage';

// Import sreen
import Login from './src/screen/Auth/Login';
import AddNotification from './src/screen/Notification/AddNotification'
import StudentManagement from './src/screen/Student/StudentManagement';
import LecturerManagement from './src/screen/Lecture/LecturerManagement';
import ExamManagement from './src/screen/Exam/ExamManagement';
import ClassManagement from './src/screen/Class/ClassManagement';
import SubjectManagement from './src/screen/Subject/SubjectManagement'
import Home from './src/screen/Home'
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen'
// Create drawer tabNav
const Stack = createStackNavigator();

// import Context
import { TokenProvider } from './src/Context/TokenContext'
import AdminDetail from './src/screen/Admin/AdminDetail';

import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const App = () => {

  useEffect(() => {
    SplashScreen.hide()
  })

  const [token, setToken] = useState('');
  if (!token) return <Login token={token} setToken={setToken} />
  return (
    <NavigationContainer>
      <TokenProvider value={token} >
        <Stack.Navigator
          headerMode='none'
        >
          <Stack.Screen name='Home' component={Home} initialParams={{ setToken, token }} />
          <Stack.Screen name="Quản lý thông báo" component={AddNotification} />
          <Stack.Screen name="Quản lý sinh viên" component={StudentManagement} />
          <Stack.Screen name="Quản lý giảng viên" component={LecturerManagement} />
          <Stack.Screen name="Quản lý lớp học" component={ClassManagement} />
          <Stack.Screen name="Quản lý đề thi" component={ExamManagement} />
          <Stack.Screen name="Quản lý môn học" component={SubjectManagement} />
          <Stack.Screen name="Thông tin tài khoản" component={AdminDetail} />
        </Stack.Navigator>
      </TokenProvider >
    </NavigationContainer >


  )
};


export default App;