import React, { useState } from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import Text from './Text'
import styles from '../style/style'

const Password = ({ onChangeText, errorMessage = false, value, style }) => {
    const [showPassWord, setShowPassWord] = useState(false)
    return (
        <View>
            <View style={[{ flexDirection: 'row', alignItems: 'center', borderRadius: 30, elevation: 1 }, { style }, !errorMessage ? null : styles.borderErr]}>
                <View style={{ marginLeft: 15 }}>
                    <Icon name='lock' size={24} color={errorMessage ? "#ED557A" : '#999999'} />
                </View>
                <TextInput
                    style={[{ flex: 1, marginLeft: 10, fontFamily: 'Inter', fontSize: 16 },]}
                    placeholder='Mật khẩu'
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={!showPassWord}
                />
                <TouchableOpacity style={{ marginRight: 20 }}
                    onPress={() => setShowPassWord(!showPassWord)}
                >
                    <Text style={{ padding: 6 }} size={12} color='#999999'>{showPassWord ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
            </View>
            { errorMessage && <Text size={14} style={[styles.textErr]}>{errorMessage}</Text>}
        </View >
    )
}

export default Password