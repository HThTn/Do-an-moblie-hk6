import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();



import AddStudent from './AddStudent';
import StudentList from './StudentList'
import Icon from 'react-native-vector-icons/FontAwesome'

export default StudentManagement = () => {



    return (
        <Tab.Navigator
            initialRouteName="Danh sách"
            tabBarOptions={{
                activeTintColor: '#0598FC',
            }}
        >
            <Tab.Screen
                name="Thêm mới"
                component={AddStudent}
                options={{
                    tabBarLabel: "Thêm mới",
                    tabBarIcon: ({ color, size }) => (
                        <Icon name='plus' color={color} size={20} />)

                }}
            />

            <Tab.Screen
                name="Danh sách"
                component={StudentList}
                options={{
                    tabBarLabel: "Danh sách",
                    tabBarIcon: ({ color, size }) => (
                        <Icon name='list' color={color} size={20} />
                    )
                }}
            />

        </Tab.Navigator>
    )
}