import React, {useState} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import ListClass from '../screens/ClassManagement/listClass';
import ListNoti from '../screens/createNotification/listNoti';
import detail from '../screens/accountDetail/index';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import classDetail from '../screens/ClassManagement/listStudent';
import createNoti from '../screens/createNotification/createNotification';
import exam from '../screens/exam/listExam';
import createExam from '../screens/exam/createExam';

import examDetail from '../screens/exam/examDetail';

const Tab = createMaterialBottomTabNavigator();
const LCStack = createStackNavigator();
const LNStack = createStackNavigator();
const ADStack = createStackNavigator();
const EXStack = createStackNavigator();
const MainTabScreen = ({}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Xem lớp học"
        component={LCStacks}
        options={{
          tabBarLabel: 'Xem lớp học',
          tabBarColor: '#3891E9',
          tabBarIcon: ({color}) => (
            <Icon name="calendar-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Thông báo"
        component={LNStacks}
        options={{
          tabBarLabel: 'Thông báo',
          tabBarColor: '#3891E9',
          tabBarIcon: ({color}) => (
            <Icon name="notifications-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Thi Online"
        component={EXStacks}
        options={{
          tabBarLabel: 'Thi Online',
          tabBarColor: '#3891E9',
          tabBarIcon: ({color}) => (
            <Icons name="add-task" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Thông tin"
        component={ADStacks}
        options={{
          tabBarLabel: 'Thông tin',
          tabBarColor: '#3891E9',
          tabBarIcon: ({color}) => (
            <Icon name="person-circle-outline" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const LCStacks = () => {
  return (
    <LCStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3891E9',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}>
      <LCStack.Screen name="Xem lớp học" component={ListClass} />
      <LCStack.Screen name="Xem chi tiết" component={classDetail} />
    </LCStack.Navigator>
  );
};
const LNStacks = () => {
  return (
    <LNStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3891E9',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}>
      <LNStack.Screen name="Thông báo" component={ListNoti} />
      <LNStack.Screen name="Tạo thông báo" component={createNoti} />
    </LNStack.Navigator>
  );
};
const EXStacks = () => {
  return (
    <EXStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3891E9',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}>
      <EXStack.Screen name="Danh sách bài thi" component={exam} />
      <EXStack.Screen name="Tạo bài thi" component={createExam} />
      <EXStack.Screen name="Xem bài kiểm tra" component={examDetail} />
    </EXStack.Navigator>
  );
};
const ADStacks = () => {
  return (
    <ADStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3891E9',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}>
      <ADStack.Screen name="Thông tin" component={detail} />
    </ADStack.Navigator>
  );
};

export default MainTabScreen;
