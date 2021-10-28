import React, { useContext,useEffect } from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlexibleTabBarComponent, withCustomStyle } from 'react-navigation-custom-bottom-tab-component/FlexibleTabBarComponent';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { KeyboardAvoidingView, View, Text, StyleSheet, TextInput, Button, TouchableOpacity, SafeAreaView,ScrollView,Modal, Alert, Pressable, StatusBar, BackHandler } from 'react-native';

import TimeTable from './TimeTable';
import Notification from './Notification';
import OnlineExam from './OnlineExam';
import AccountDetail from './accountDetail';
import Subject from './Subject';
import mainExam from './OnlineExam/mainExam';


// const Stack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const TabS = ({route, navigation}) => {
  // const {setToken} = route.params
  return(
    <Tab.Navigator
      shifting={true}
      initialRouteName="Thời khóa biểu"
      activeColor="#fff"
      barStyle={{}}
    >
      <Tab.Screen
        name="Thời khóa biểu"
        component={TimeTable}
        options={{
          tabBarLabel: 'TKB',
          tabBarColor: '#3891E9',
          tabBarIcon: ({ color }) => (
            <Icon name="calendar-outline" color={color} size={26} />
          ),
        }}
        
      />
      <Tab.Screen
        name="Kiểm tra"
        component={OnlineExam}
        options={{
          tabBarLabel: 'Kiểm tra',
          tabBarColor: '#3891E9',
          tabBarIcon: ({ color }) => (
            <Icons name="add-task" color={color} size={26} />
          ),          
        }}
        // listeners ={({navigation})=>({
        //   tabPress: (event) => {
        //     event.preventDefault();
        //     navigation.navigate('Exam', {screen:'OnlineExam'})
        //   }
        // })}
        // options={({ navigation }) => {
        //   const { routes, index } = navigation.dangerouslyGetState();
        //   const { state: exploreState } = routes[index];
        //   if (exploreState) {
        //     const { routes: exploreRoutes, index: exploreIndex } = exploreState;
        //     const exploreActiveRoute = exploreRoutes[exploreIndex];
        //     if (exploreActiveRoute.name === "MainExam") {Tab.barStyle.add({display: 'none'});Tab.forceUpdate();}; 
        //   };
        //   return {
        //     tabBarLabel: 'Kiểm tra',
        //     tabBarColor: '#3891E9',
        //     tabBarIcon: ({ color }) => (
        //       <Icons name="add-task" color={color} size={26} />
        //     ),
        //   };
        // }}
      />
      <Tab.Screen
        name="Quản lý môn học"
        component={Subject}
        options={{
          tabBarLabel: 'Môn học',
          tabBarColor: '#3891E9',
          tabBarIcon: ({ color }) => (
            <Icons name="more-time" color={color} size={26} />
          ),
          
        }}
      />
      <Tab.Screen
        name="Thông tin cá nhân"
        component={AccountDetail}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarColor: '#3891E0',
          tabBarIcon: ({ color }) => (
            <Icon name="person-circle-outline" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
)};

// export default MainTabScreen;

// const StackS = ({navigation, route}) => {
//   console.log(route);
//   return(
//   <Stack.Navigator screenOptions={{
//           headerStyle: {
//           backgroundColor: '#3891E9',
//           },
//           headerTintColor: '#fff',
//           headerTitleStyle: {
//           fontWeight: 'bold'
//           },
//           headerTitleAlign: 'center',
//       }}
//       >
//           <Stack.Screen name="Thời khóa biểu" component={TabS}
//             options={({route, navigation}) => { 
//               const routeName = getFocusedRouteNameFromRoute(route);
//               return { title: routeName, 
//               headerRight: () => (
//                 <Pressable  style={[{paddingRight:15}]}onPress={() => {navigation.navigate('Notification')}}>
//                       <Icon name="notifications-outline" color={'#FEFEFE'} size={26} />
//               </Pressable>),
//               headerLeft: () => (
//                 <Pressable  style={[{paddingLeft:15}]}onPress={() => {setToken('')}}>
//                       <Icon name="notifications-outline" color={'#FEFEFE'} size={26} />
//               </Pressable>),
//                }; 
//             }          
//           }      
//           />
//           <Stack.Screen name="Notification" component={Notification} options={{
//             title: 'Thông báo'
//           }}
          
//           />
//           <Stack.Screen name="MainExam" component={mainExam} options={{
//             headerShown: false
//           }}
          
//           />
          
//   </Stack.Navigator>
// )};

export default TabS;