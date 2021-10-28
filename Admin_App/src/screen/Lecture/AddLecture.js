import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Picker as PickerBase } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';


import HeaderText from '../../components/HeaderText'
import { apiURL, facultyList, facultyToVN } from '../../config/config'
import { LectureUtils } from '../../utils'
import TokenContext from '../../Context/TokenContext'
import TextInput from '../../components/TextInput'
import DatePicker from '../../components/DatePicker'
import Picker from '../../components/Picker'
import SubmitButton from '../../components/SubmitButton'
import Text from '../../components/Text'
import { mainWhite } from '../../style/color';

const AddStudent = ({ navigation }) => {
    const initAccount = {
        email: '',
        phone: '',
        full_name: '',
        date_of_birth: new Date(new Date().setFullYear(1988)).toISOString(),
        faculty: facultyList[0]
    }
    const initError = { email: false, phone: false, full_name: false, date_of_birth: false, faculty: false }
    const token = useContext(TokenContext)
    const [account, setAccount] = useState(initAccount);
    const [error, setError] = useState(initError);
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(async () => {
        await setCompleted(true)
        return () => {
            setAccount();
            setError()
        }

    }, [])

    const onSubmitPress = async () => {
        setIsLoading(true);
        setError(initError)
        await setTimeout(async () => {
            try {
                await LectureUtils.createLecture({ token: token, lecture: account })
                    .then(res => {
                        console.log(res);
                        setIsLoading(false)
                        if (res.data) {
                            setAccount(initAccount);
                            return Toast.show({
                                type: 'success',
                                position: 'top',
                                text1: 'Thêm tài khoản thành công',
                                visibilityTime: 2000,
                                autoHide: true,
                            })
                        }
                        else if (res.error == 4000) return setError(res.messages)
                        else if (res.error == 7000) {
                            return Toast.show({
                                type: 'error',
                                position: 'top',
                                text1: 'Thêm tài khoản không thành công',
                                text2: 'email hoặc số điện thoại đã tồn tại trong hệ thống',
                                visibilityTime: 2000,
                                autoHide: true,
                            })
                        }
                        return Toast.show({
                            type: 'error',
                            position: 'top',
                            text1: 'Error',
                            text2: JSON.stringify(res),
                            visibilityTime: 2000,
                            autoHide: true,
                        })

                    })
            } catch (err) {
                console.error('Error Submit lecture: ', err);
            }
        }, 2000)
    }

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>

            <HeaderText navigation={navigation}>Thêm Giảng Viên</HeaderText>
            {completed && <ScrollView style={{ marginTop: 30 }} >

                <View style={[{ alignItems: 'center', marginBottom: 15 }]}>

                    {/* Email */}
                    <View style={{ width: '90%', marginBottom: 15 }}>
                        <TextInput
                            label='Email'
                            outLine={true} isFocus={true}
                            leftIcon='envelope'
                            placeholder='Email'
                            value={account.email}
                            onChangeText={text => setAccount({ ...account, email: text.trim() })}
                            errorMessage={error.email}
                        />

                    </View>

                    {/* Phone */}
                    <View style={{ width: '90%', marginBottom: 15 }} >
                        <TextInput
                            label='Phone'
                            outLine={true} isFocus={true}
                            leftIcon='mobile'
                            placeholder='Số điện thoại'
                            value={account.phone}
                            onChangeText={text => setAccount({ ...account, phone: text.trim() })}
                            errorMessage={error.phone}
                        />
                    </View>

                    {/* Full name */}
                    <View style={{ width: '90%', marginBottom: 15 }} >
                        <TextInput
                            label='Họ tên'
                            outLine={true}
                            isFocus={true}
                            leftIcon='user'
                            placeholder='Họ tên'
                            value={account.full_name}
                            onChangeText={text => setAccount({ ...account, full_name: text })}
                            errorMessage={error.full_name}
                        />
                    </View>

                    {/* Date of Birth */}
                    <View style={{ width: '90%', marginBottom: 15 }}>
                        <DatePicker
                            label='Ngày sinh'
                            placeholder='Ngày sinh'
                            leftIcon='birthday-cake'
                            mode='date'
                            errorMessage={error.date_of_birth}
                            onPick={val => setAccount({ ...account, date_of_birth: val.toISOString() })}
                            dateDefault={new Date().setFullYear(1988)}
                        />
                    </View>

                    {/* Faculty */}

                    <View style={{ width: '90%', marginBottom: 20 }}>
                        <Picker
                            label='Khoa'
                            leftIcon='chalkboard-teacher'
                            placeholder='Khoa'
                            displayValue={facultyToVN[account.faculty]}
                            selectedValue={account.faculty}
                            onValueChange={(val) => setAccount({ ...account, faculty: val })}
                            errorMessage={error.faculty}
                        >
                            {facultyList.map(val => <PickerBase.Item
                                label={facultyToVN[val]}
                                value={val}
                                key={val} />)}
                        </Picker>
                    </View>
                    <SubmitButton
                        isProcessing={isLoading}
                        textProcessing='Đang xử lý...'
                        onPress={onSubmitPress}>Thêm tài khoản</SubmitButton>
                </View>
            </ScrollView>}
            <Toast ref={(ref) => Toast.setRef(ref)} />

        </SafeAreaView >
    );
};

export default AddStudent;

