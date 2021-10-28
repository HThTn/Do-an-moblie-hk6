import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, TouchableOpacity } from "react-native";
import styles from '../../style/style'
    ; import { Picker } from '@react-native-picker/picker';
import HeaderText from '../../components/HeaderText';
export default AddNotifiacaion = ({ navigation }) => {
    const [codeClass, setCodeClass] = useState('All')
    const [type, setType] = useState(true)
    return (
        <View>
            <HeaderText navigation={navigation} >Tạo thông báo</HeaderText>

            <ScrollView>
                <View style={styles.container}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '60%', marginTop: 50 }}>
                        <Text style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 18 }}>Lớp:</Text>
                        <Picker
                            selectedValue={codeClass}
                            onValueChange={(value) => setCodeClass(value)}
                            mode='dropdown'
                            style={{ alignItems: 'center', width: '50%' }}>
                            <Picker.Item label="All" value="All" />
                            <Picker.Item label="IT001.J15" value="HTTT" />
                            <Picker.Item label="IT002.J15" value="CNPM" />
                        </Picker>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '60%' }}>
                        <Text style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 18 }}>Loại thông báo:</Text>
                        <Picker
                            selectedValue={codeClass}
                            onValueChange={(value) => setType(value)}
                            mode='dropdown'
                            style={{ alignItems: 'center', width: '50%' }}
                        >
                            <Picker.Item label="Nghỉ" value={true} />
                            <Picker.Item label="Bù" value={false} />
                        </Picker>
                    </View>
                    <View style={[styles.inputView]}>
                        <TextInput style={[styles.input, styles.inputArea, { textAlignVertical: 'top', fontFamily: 'Inter' }]}
                            placeholder="Nội dung thông báo"
                            focusable={false}
                            multiline={true}
                            numberOfLines={10}

                        />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <View>
                            <TouchableOpacity
                                style={{ backgroundColor: '#0598FC', height: 40, alignItems: 'center', width: 150, borderRadius: 30, elevation: 5, paddingVertical: 5 }}
                            // onPress={handlerSubmit}
                            >
                                <Text style={{ fontFamily: 'Inter', fontSize: 18, color: '#FFFFFF' }}>Tạo thông báo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >
            </ScrollView>
        </View>
    )

}
