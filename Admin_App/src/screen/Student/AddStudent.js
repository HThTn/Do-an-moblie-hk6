import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Picker as PickerBase } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

import HeaderText from '../../components/HeaderText'

import { apiURL, yearList } from '../../config/config'
import { mainWhite } from '../../style/color';
import { StudentUtils } from '../../utils'
import TokenContext from '../../Context/TokenContext'
import TextInput from '../../components/TextInput'
import DatePicker from '../../components/DatePicker'
import Picker from '../../components/Picker'
import SubmitButton from '../../components/SubmitButton'
const AddStudent = ({ navigation }) => {
    const initAccount = {
        email: '',
        phone: '',
        full_name: '',
        date_of_birth: new Date(new Date().setFullYear(2000)).toISOString(),
        year: new Date().getFullYear().toString(),
        class_id: ''
    }
    const initError = {
        email: false,
        phone: false,
        full_name: false,
        date_of_birth: false,
        year: false,
        class_id: false
    }
    const initClass = {
        "quantity": 0,
        "status": "",
        "_id": "",
        "name": "",
        "year": "",
        "faculty": "",
    }
    const token = useContext(TokenContext)
    const [account, setAccount] = useState(initAccount);
    const [error, setError] = useState(initError);
    const [classList, setClassList] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [completed, setCompleted] = useState(false);
    const [Class, setClass] = useState(initClass)
    useEffect(async () => {
        setCompleted(true)
        return () => {
            setYearList();
            setAccount();
            setError();
            setClassList();
        }
    }, [])
    useEffect(async () => {
        try {
            await fetch(`${apiURL}/class/admin/?year=${account.year}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(res => res.json()).then(async (res) => {
                await setClassList(res.data);
                if (res.data.length > 0) {
                    await setAccount({ ...account, class_id: res.data[0]._id })
                } else {
                    await setAccount({ ...account, class_id: '' })

                }

            })
        }
        catch (err) {
            console.log('Get classList error :', err);
        }
    }, [account.year])
    useEffect(async () => {
        if (account.class_id != '') {
            await setClass(classList.find(element => element._id == account.class_id))
        }
        else {
            setClass(initClass)
        }
    }, [account.class_id])

    const onSubmitPress = async () => {
        setError(initError)

        await setIsLoading(true)
        await setTimeout(async () => {
            StudentUtils.createStudent({ token: token, student: account }).then(res => {
                setIsLoading(false)
                if (res.error == 4000) {
                    return setError(res.messages)
                }
                if (res.error == 7000) {
                    setError(initError)
                    return Toast.show({
                        type: 'error',
                        position: 'top',
                        text1: 'Th??m t??i kho???n kh??ng th??nh c??ng',
                        text2: 'email ho???c s??? ??i???n tho???i ???? t???n t???i trong h??? th???ng',
                        visibilityTime: 2000,
                        autoHide: true,
                    })
                }
                else if (res.data) {
                    setAccount(initAccount)

                    return Toast.show({
                        type: 'success',
                        position: 'top',
                        text1: 'Th??m t??i kho???n th??nh c??ng',
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
        }, 1000)

    }

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>

            <HeaderText navigation={navigation}>Th??m Sinh Vi??n</HeaderText>
            {completed && <ScrollView style={{ flex: 1, marginTop: 10 }} >

                <View style={[{ alignItems: 'center', flex: 1, marginBottom: 10 }]}>

                    {/* Email */}
                    <View style={{ width: '90%', marginTop: 1 }}>
                        <TextInput
                            label='Email'
                            outLine={true}
                            isFocus={true}
                            leftIcon='envelope'
                            placeholder='Email'
                            value={account.email}
                            onChangeText={text => setAccount({ ...account, email: text.trim() })}
                            errorMessage={error.email}
                        />
                    </View>

                    {/* Phone */}
                    <View style={{ width: '90%', marginBottom: 10 }}>
                        <TextInput
                            label='Phone'
                            outLine={true}
                            isFocus={true}
                            leftIcon='mobile'
                            placeholder='S??? ??i???n tho???i'
                            value={account.phone}
                            onChangeText={text => setAccount({ ...account, phone: text.trim() })}
                            errorMessage={error.phone}
                        />
                    </View>

                    {/* Full nme */}
                    <View style={{ width: '90%', marginBottom: 10 }}>
                        <TextInput
                            label='H??? t??n'
                            outLine={true}
                            isFocus={true}
                            leftIcon='user'
                            placeholder='H??? t??n'
                            value={account.full_name}
                            onChangeText={text => setAccount({ ...account, full_name: text })}
                            errorMessage={error.full_name}

                        />

                    </View>

                    {/* Date of Birth */}
                    <View style={{ width: '90%', marginBottom: 10 }}>
                        <DatePicker
                            label='Ng??y sinh'
                            placeholder='Ng??y sinh'
                            leftIcon='birthday-cake'
                            mode='date'
                            errorMessage={error.date_of_birth}
                            onPick={val => setAccount({ ...account, date_of_birth: val.toISOString() })}
                            dateDefault={new Date().setFullYear(2000)}

                        />
                    </View>
                    {/* Year */}
                    <View style={{ width: '90%', marginBottom: 10 }}>
                        <Picker
                            label='N??m h???c'
                            leftIcon='calendar-alt'
                            placeholder='N??m h???c'
                            displayValue={account.year != 'N??m h???c' ? account.year : null}
                            selectedValue={account.year}
                            onValueChange={val => {
                                setAccount({ ...account, year: val })
                            }}
                            errorMessage={error.year}
                        >
                            {yearList.map(y =>
                                <PickerBase.Item
                                    label={y.toString()}
                                    value={y.toString()}
                                    key={y.toString()} />
                            )}
                        </Picker>
                    </View>
                    {/* Class  */}
                    <View style={{ width: '90%', marginBottom: 20 }}>
                        <Picker
                            label='L???p sinh ho???t'
                            leftIcon='chalkboard'
                            placeholder='L???p sinh ho???t'
                            displayValue={Class.name}
                            selectedValue={account.class_id}
                            onValueChange={(val, index) => setAccount({ ...account, class_id: val })}
                            errorMessage={error.class_id}
                        >
                            {classList.length > 0 ? classList.map(val => <PickerBase.Item
                                label={val.name}
                                value={val._id}
                                key={val._id} />) : <PickerBase.Item
                                label='Kh??ng c?? l???p '
                                value=''
                            />}
                        </Picker>
                    </View>
                    <SubmitButton
                        isProcessing={isLoading}
                        textProcessing='??ang x??? l??...'
                        onPress={onSubmitPress}>Th??m t??i kho???n</SubmitButton>
                </View>
            </ScrollView>}
            <Toast ref={(ref) => Toast.setRef(ref)} />

        </SafeAreaView>
    );
};

export default AddStudent;

