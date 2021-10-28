import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'

import AddExam from './AddExam'
import ExamList from './ExamList'


const Tab = createMaterialBottomTabNavigator();


export default ExamManagement = () => {
    return (
        <Tab.Navigator

            initialRouteName="Danh sách"
            tabBarOptions={{

                activeTintColor: '#0598FC',
            }}
        >
            <Tab.Screen
                name="Thêm mới"
                component={AddExam}
                options={{
                    tabBarLabel: "Thêm mới",
                    tabBarIcon: ({ color, size }) => (
                        <Icon name='plus' color={color} size={20} />)

                }}
            />
            <Tab.Screen
                name="Danh sách"
                component={ExamList}
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