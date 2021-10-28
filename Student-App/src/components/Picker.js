import React from 'react';
import { View, TextInput } from 'react-native'
import { Picker as PickerBase } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/FontAwesome5'

import styles from '../style/style'
import Text from './Text'
let i = 0;
const Picker = ({ selectedValue, displayValue = '', onValueChange, placeholder, children, style, errorMessage = false, leftIcon = false }) => {

    return (
        <View>
            <View style={[{ flexDirection: 'row', alignItems: 'center', borderRadius: 30, elevation: 1 }, style, !errorMessage ? null : styles.borderErr]}>
                <View style={{ marginLeft: 15 }}>
                    {leftIcon && <Icon name={leftIcon} size={24} color={errorMessage ? "#ED557A" : '#999999'} />}
                </View>
                <TextInput
                    style={[{ flex: 1, marginLeft: 10, fontFamily: 'Inter', fontSize: 16, borderRightWidth: 1, borderRightColor: errorMessage ? "#ED557A" : '#999999', color: '#22262e' }]}
                    placeholder={placeholder}
                    value={displayValue}
                    editable={false} />
                <PickerBase
                    style={{ flex: .15 }}
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    dropdownIconColor={errorMessage ? "#ED557A" : '#999999'}
                >
                    {children}
                </PickerBase>
            </View>
            {errorMessage && <Text size={14} style={styles.textErr}>{errorMessage}</Text>}
        </View>
    );
};

export default Picker;