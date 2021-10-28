
import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import * as Animatable from 'react-native-animatable'

import styles from '../style/style'
import { mainWhite, errorColor, mainGray } from '../style/color'
import Text from './Text'

const fadeIn = {
    from: {
        top: 25,
    },
    to: {
        top: 0,
    },
};

const DatePicker = ({ label, onPick, style, leftIcon = false, placeholder, mode = 'date', errorMessage = false, outLineColor = mainGray, dateDefault = new Date(), editable = true }) => {
    const [show, setShow] = useState(false)
    const [date, setDate] = useState(new Date(dateDefault));
    const [dateText, setDateText] = useState('')
    const [borderColor, setBorderColor] = useState(outLineColor);

    useEffect(() => {
        if (errorMessage) {
            setBorderColor(errorColor)
        } else {
            setBorderColor(outLineColor)
        }

    }, [errorMessage])
    useEffect(() => {
        if (date) {
            if (mode == 'date') {
                setDateText(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`)
            }
            if (mode == 'time') {
                setDateText(`${date.getHours()}:${date.getMinutes()}`)
            }

        }
    }, [date])
    return (
        <View style={{ paddingTop: 13, flex: 1 }}>
            {(label && !dateText == false) && <Animatable.View
                animation={fadeIn}
                duration={500}
                style={{ position: 'absolute', top: 0, marginLeft: !leftIcon ? 15 : 50, backgroundColor: mainWhite, zIndex: 1 }}
            >
                <Text
                    size={16}
                    color={borderColor}
                >{label}</Text>
            </Animatable.View>}
            <TouchableOpacity
                style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: borderColor }, style, !errorMessage ? null : styles.borderErr]}
                onPress={() => {
                    if (editable) return setShow(true);
                    return
                }}
            >
                {leftIcon && <View style={{ marginLeft: 15 }}>
                    <Icon name={leftIcon} size={24} color={errorMessage ? "#ED557A" : '#999999'} />
                </View>
                }
                <TextInput style={[{ flex: 1, marginLeft: 15, fontFamily: 'Inter', fontSize: 16, color: '#22262e' }]}
                    editable={false}
                    placeholderTextColor={borderColor}
                    placeholder={placeholder}
                    value={dateText}
                />
                {
                    show && (<DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(date)}
                        display="default"
                        is24Hour={true}
                        mode={mode}

                        onChange={(event, date) => {
                            setShow(false);
                            if (event.type == 'set') {
                                setDate(date)
                                onPick(date)
                            }
                        }}
                    />)
                }
            </TouchableOpacity >
            {errorMessage && <Text size={14} style={[styles.textErr]}>{errorMessage}</Text>}

        </View>
    )
}

export default DatePicker