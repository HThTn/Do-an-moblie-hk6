import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();
import Icon from 'react-native-vector-icons/FontAwesome'

import AddLecture from './AddLecture';
import LectureList from './LectureList'




export default LecturerManagement = () => {

    return (
        <Tab.Navigator
            initialRouteName="Danh sách"
            tabBarOptions={{
                activeTintColor: '#0598FC',
            }}
        >
            <Tab.Screen
                name="Thêm mới"
                component={AddLecture}
                options={{
                    tabBarLabel: "Thêm mới",
                    tabBarIcon: ({ color, size }) => (
                        <Icon name='plus' color={color} size={20} />)

                }}
            />
            <Tab.Screen
                name="Danh sách"
                component={LectureList}
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