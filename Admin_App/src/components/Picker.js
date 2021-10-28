import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native'
import { Picker as PickerBase } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import * as Animatable from 'react-native-animatable'

import styles from '../style/style'
import { mainWhite, mainGray, errorColor } from '../style/color'
import Text from './Text'

const fadeIn = {
    from: {
        top: 25,
    },
    to: {
        top: 0,
    },
};

const Picker = ({
    label,
    selectedValue,
    displayValue = '',
    onValueChange,
    placeholder,
    children,
    style,
    errorMessage = false,
    leftIcon = false,
    outLineColor = mainGray }) => {

    const [borderColor, setBorderColor] = useState(outLineColor);
    useEffect(() => {
        if (errorMessage) {
            setBorderColor(errorColor)
        } else {
            setBorderColor(outLineColor)
        }

    }, [errorMessage])

    return (
        <View style={{ paddingTop: 13 }}>
            {(label && !displayValue == false) && <Animatable.View
                animation={fadeIn}
                duration={500}
                style={{ position: 'absolute', top: 0, marginLeft: !leftIcon ? 15 : 50, backgroundColor: mainWhite, zIndex: 1 }}
            >
                <Text
                    size={16}
                    color={borderColor}
                >{label}</Text>
            </Animatable.View>}

            <View style={[{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: outLineColor, zIndex: 0 }, style, !errorMessage ? null : styles.borderErr]}>
                {leftIcon && <View style={{ marginLeft: 15, }}>
                    <Icon name={leftIcon} size={24} color={errorMessage ? "#ED557A" : '#999999'} />
                </View>}
                <TextInput
                    style={[{ flex: 1, marginLeft: 15, fontFamily: 'Inter', fontSize: 16, borderRightWidth: 1, borderRightColor: errorMessage ? "#ED557A" : '#999999', color: '#22262e' }]}
                    placeholder={placeholder}
                    placeholderTextColor={borderColor}
                    value={displayValue}
                    placeholder={placeholder}
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