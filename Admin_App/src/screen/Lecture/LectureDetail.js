import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message'


import styles from '../../style/style'
import { apiURL, facultyList, facultyToVN } from '../../config/config';
import { LectureUtils } from '../../utils'
import TokenContext from '../../Context/TokenContext'
import {
    Text,
    HeaderUserDetail,
    TextInput,
    SubmitButtonDetail,
    LoadingDataModal
} from '../../components'
import { mainWhite } from '../../style/color';
const LectureDetail = ({ route, navigation }) => {
    const token = useContext(TokenContext);
    const { _id } = route.params;
    const initLecture = {
        "_id": "",
        "date_of_birth": "",
        "email": "",
        "faculty": "",
        "full_name": "",
        "password": "",
        "phone": "",
        "status": ""
    }

    const [lecture, setLecture] = useState(initLecture)
    const [isEdit, setIsEdit] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const getLectureData = async () => {
        await LectureUtils.getLectureById({ token: token, id: _id })
            .then(async (res) => {
                await setLecture(res.data)
            })
    }
    useEffect(async () => {
        try {
            await getLectureData();
            setIsLoading(false)

        } catch (err) {
            console.log("Error get lecture data: ", err);
        }
        return () => {
            setLecture()

        }
    }, [])
    const save = async () => {
        setIsProcessing(true)
        const query = {
            token: token,
            id: _id,
            lecture: {
                status: lecture.status,
                faculty: lecture.faculty
            }
        }
        await setTimeout(async () => {
            try {
                await LectureUtils.updateLecture(query)
                    .then(async (res) => {

                        if (res.statusCode == 200) {
                            await getLectureData();
                            setIsEdit(false);
                            return Toast.show({
                                type: 'success',
                                position: 'top',
                                text1: 'Cập nhật thành công ',
                                visibilityTime: 2000,
                                autoHide: true,
                            })
                        }
                        return Toast.show({
                            type: 'error',
                            position: 'top',
                            text1: 'Cập nhật thất bại ',
                            text2: JSON.stringify(res),
                            autoHide: false,
                        })
                    })
                setIsProcessing(false)
            }
            catch (err) {
                console.log("error submit error: ", err);
            }
        }, 1000)
    }
    const handlerCancel = async () => {
        await getLectureData();
        setIsEdit(false)
    }
    console.log(lecture.status);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
            <HeaderUserDetail
                src={require('../../../assets/public/img/profile.png')}
                onBackPress={() => navigation.goBack()}
            />
            <LoadingDataModal visible={isLoading} />
            {!isLoading && <View style={{ alignItems: 'center' }}>

                <View style={{ width: '90%' }}>
                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Họ tên:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                multiline={true}
                                outLine={false}
                                type='flat'
                                editable={false}
                                value={lecture.full_name} />
                        </View>
                    </CustomView>
                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Ngày sinh:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                outLine={false}
                                type='flat'
                                editable={false}
                                value={lecture.date_of_birth.split('T')[0].split('-').reverse().join('/')} />
                        </View>
                    </CustomView>
                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Số điện thoại:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                outLine={false}
                                type='flat'
                                editable={false}
                                value={lecture.phone} />
                        </View>
                    </CustomView>
                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Email:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                outLine={false}
                                multiline={true}
                                type='flat'
                                editable={false}
                                value={lecture.email} />
                        </View>
                    </CustomView>
                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Khoa:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Picker
                                itemStyle={{ fontFamily: 'Inter', fontSize: 18 }}
                                enabled={isEdit}
                                selectedValue={lecture.faculty}
                                onValueChange={val => setLecture({ ...lecture, faculty: val })}
                            >
                                {facultyList.map(val => {
                                    return (
                                        <Picker.Item label={facultyToVN[val]} value={val} key={val} />
                                    )
                                })}
                            </Picker>
                        </View>
                    </CustomView>
                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Trạng thái:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Picker style={{ marginRight: '23%' }}
                                mode='dropdown'
                                itemStyle={{ fontFamily: 'Inter', fontSize: 18 }}
                                enabled={isEdit}
                                selectedValue={lecture.status}
                                onValueChange={val => setLecture({ ...lecture, status: val })}
                            >
                                <Picker.Item label='Active' value='active' />
                                <Picker.Item label='Disabled' value='disabled' />
                            </Picker>
                        </View>
                    </CustomView>



                </View>
                <SubmitButtonDetail
                    isEdit={isEdit}
                    isProcessing={isProcessing}
                    onEditPress={() => setIsEdit(true)}
                    onSavePress={() => save()}
                    onCancelPress={() => handlerCancel()}
                />

            </View>}
            <Toast ref={(ref) => Toast.setRef(ref)} />

        </SafeAreaView >
    );
};


const CustomView = ({ children }) => {

    return <View style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    }} >
        {children}
    </View >
}

export default LectureDetail;