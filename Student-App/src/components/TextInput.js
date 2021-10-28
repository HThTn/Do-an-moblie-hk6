import React from 'react';

import { View, TextInput as TextInputBase } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'

import styles from '../style/style'
import Text from './Text'
const TextInput = ({ placeholder, onChangeText, errorMessage = false, value, leftIcon = false, style }) => {
    return (
        <View >
            <View style={[{ flexDirection: 'row', alignItems: 'center', borderRadius: 30, elevation: 1, }, style, !errorMessage ? null : styles.borderErr]}>
                <View style={{ marginLeft: 15 }}>
                    {leftIcon && <Icon name={leftIcon} size={24} color={errorMessage ? "#ED557A" : '#999999'} />}
                </View>
                <TextInputBase
                    style={[{ flex: 1, marginLeft: 10, fontFamily: 'Inter', fontSize: 16 }]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText} />
            </View>
            {errorMessage && <Text size={14} style={styles.textErr}>{errorMessage}</Text>}
        </View>
    );
};

export default TextInput