import React, {useState} from 'react';
import Login from './src/screen/Auth/Login';
import MainTabScreen from '././src/screen/Main';
import mainExam from './src/screen/OnlineExam/mainExam';
import Notification from './src/screen/Notification';
import {Provider as PaperProvider} from 'react-native-paper';
import {BottomNavigation, Text, Appbar} from 'react-native-paper';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { KeyboardAvoidingView, View, StyleSheet, TextInput, Button, TouchableOpacity, SafeAreaView,ScrollView,Modal, Alert, Pressable, StatusBar } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TokenProvider } from './src/Context/TokenContext'
import {SetTokenProvider} from './src/Context/SetTokenContext';
import Icon from 'react-native-vector-icons/Ionicons';
const Stack = createStackNavigator();

const App = () => {
  const [token, setToken] = useState('');
  
  if (!token) return <Login token={token} setToken={setToken} />;
  return(
    <NavigationContainer>
      <TokenProvider value={token}>
        <SetTokenProvider value={setToken}>
          <Stack.Navigator screenOptions={{
            headerStyle: {
            backgroundColor: '#3891E9',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold'
            },
            headerTitleAlign: 'center',
            }}> 
              <Stack.Screen name="MainTabScreen" component={MainTabScreen}
              options={({route, navigation}) => { 
                const routeName = getFocusedRouteNameFromRoute(route);
                return { title: routeName, 
                headerRight: () => (
                  <Pressable  style={[{paddingRight:15}]}onPress={() => {navigation.navigate('Notification')}}>
                        <Icon name="notifications-outline" color={'#FEFEFE'} size={26} />
                </Pressable>),
                }; 
              }}
              // initialParams={{ setToken }}      
            />
            <Stack.Screen name="Notification" component={Notification} options={{
              title: 'Thông báo'
            }}
            
            />
            <Stack.Screen name="MainExam" component={mainExam} options={{
              headerShown: false
            }}
            />
            </Stack.Navigator>
          </SetTokenProvider>
      </TokenProvider>
    </NavigationContainer>
  )
};
export default App;
