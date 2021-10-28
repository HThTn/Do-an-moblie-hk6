import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome5'
const HeaderUserDetail = ({ src = require('../../assets/public/img/user.png'), onBackPress }) => {
    return (
        <View style={{ height: '30%' }}>
            <View
                style={{ height: '70%', backgroundColor: '#0598FC', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, }}
            >

                <TouchableOpacity style={{ marginLeft: 5, marginTop: 5, padding: 5 }}
                    onPress={onBackPress}
                >
                    <Icon name='arrow-left' color='#FFFFFF' size={24} />
                </TouchableOpacity>

            </View>
            <View style={{ width: '100%', alignItems: 'center', position: 'absolute', top: '40%', }}>
                <Avatar.Image
                    size={120}
                    source={src} />
            </View>
        </View>
    );
};

export default HeaderUserDetail;