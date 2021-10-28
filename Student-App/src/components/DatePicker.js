
import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/FontAwesome5'

import styles from '../style/style'
import Text from './Text'
const DatePicker = ({ onPick, style, leftIcon = false, placeholder, mode = 'date', errorMessage = false }) => {
    const [show, setShow] = useState(false)
    const [date, setDate] = useState('');
    const [dayText, setDateText] = useState('')
    useEffect(() => {
        if (date) {
            let tmp = new Date(date)
            if (mode == 'date') {
                setDateText(`${tmp.getDate()}/${tmp.getMonth() + 1}/${tmp.getFullYear()}`)
            }
            if (mode == 'time') {
                setDateText(`${tmp.getHours()}:${tmp.getMinutes()}`)
            }

        }
    }, [date])
    return (
        <View>
            <TouchableOpacity
                style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 30, elevation: 1, }, style, !errorMessage ? null : styles.borderErr]}
                onPress={() => setShow(true)}
            >
                <View style={{ marginLeft: 15 }}>
                    {leftIcon && <Icon name={leftIcon} size={24} color={errorMessage ? "#ED557A" : '#999999'} />}
                </View>
                <TextInput style={[{ flex: 1, marginLeft: 10, fontFamily: 'Inter', fontSize: 16, color: '#22262e' }]}
                    editable={false}
                    placeholder={placeholder}
                    value={dayText}
                />
                {
                    show && (<DateTimePicker
                        testID="dateTimePicker"
                        value={new Date}
                        display="default"
                        is24Hour={true}
                        mode={mode}

                        onChange={(event, date) => {
                            setShow(false);
                            if (event.type == 'set') {
                                setDate(date.toISOString())
                                onPick(date)
                            }
                        }}
                    />)
                }
            </TouchableOpacity >
            { errorMessage && <Text size={14} style={[styles.textErr]}>{errorMessage}</Text>}

        </View>
    )
}

export default DatePicker