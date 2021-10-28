import React, { Children } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'

import styles from '../style/style'

export default HeaderText = ({ children, navigation, haveBackButton = true }) => {
    return (
        <View style={[styles.headerView, { flexDirection: 'row', justifyContent: 'flex-start' }]}>
            <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
                <Text style={styles.headerText}>{children}</Text>
            </View>
            {haveBackButton ?
                <TouchableOpacity style={{ marginLeft: 10 }}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Icon name='arrow-left' color='#FFFFFF' size={24} />
                </TouchableOpacity>
                : null
            }
        </View>
    )
}