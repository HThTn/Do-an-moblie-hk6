import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'

import AddSubject from './AddSubject';
import SubjectList from './SubjectList';


const Tab = createMaterialBottomTabNavigator();

const ClassManagement = () => {
    return (
        <Tab.Navigator
            initialRouteName="Danh sách"
            tabBarOptions={{
                activeTintColor: '#0598FC',
            }}
        >
            <Tab.Screen
                name="Thêm mới"
                component={AddSubject}
                options={{
                    tabBarLabel: "Thêm mới",
                    tabBarIcon: ({ color, size }) => (
                        <Icon name='plus' color={color} size={20} />)

                }}
            />
            <Tab.Screen
                name="Danh sách"
                component={SubjectList}
                options={{
                    tabBarLabel: "Danh sách",
                    tabBarIcon: ({ color, size }) => (
                        <Icon name='list' color={color} size={20} />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default ClassManagement;