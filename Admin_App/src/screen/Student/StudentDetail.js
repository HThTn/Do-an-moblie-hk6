import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message'

import { StudentUtils, ClassUtils } from '../../utils'
import styles from '../../style/style';
import TokenContext from '../../Context/TokenContext';
import {
    SubmitButtonDetail,
    TextInput,
    Text,
    HeaderUserDetail,
    LoadingDataModal
} from '../../components'
import { mainWhite } from '../../style/color';
import { ScrollView } from 'react-native';
const StudentDetail = ({ route, navigation }) => {
    const token = useContext(TokenContext);
    const initStudent = {
        "_id": "",
        "class_id": "",
        "date_of_birth": "",
        "decrypt_pass": "",
        "email": "",
        "full_name": "",
        "is_verified": "",
        "password": "",
        "phone": "",
        "status": "",
        "student_code": "",
        "year": ''
    }
    const initClass = {
        "_id": "",
        "faculty": "",
        "name": "",
        "quantity": '',
        "status": "",
        "year": ''
    }

    const { _id } = route.params;
    const [student, setStudent] = useState(initStudent)
    const [isEdit, setIsEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [classList, setClassList] = useState([])
    const [isProcessing, setIsProcessing] = useState(false)
    const getSudentData = async () => {
        await StudentUtils.getStudentById({ token: token, id: _id })
            .then(async (res) => {
                console.log(res.data.status);
                return setStudent(res.data)
            })
    }
    useEffect(async () => {
        await getSudentData();

        return () => {
            setStudent();
            setClassList()
        }
    }, [])

    useEffect(async () => {
        if (student.year) {
            await ClassUtils.getAllClass({ token: token, year: student.year })
                .then(res => {
                    return setClassList(res.data)
                })
            setIsLoading(false)
        }

    }, [student])

    const handlerCancel = async () => {
        await getSudentData();
        setIsEdit(false)
    }

    const save = async () => {
        setIsProcessing(true)
        const query = {

            token: token,
            id: student._id,
            student: {
                status: student.status,
                class_id: student.class_id
            }
        }
        await setTimeout(async () => {
            await StudentUtils.updateStudent(query)
                .then(async (res) => {
                    setIsProcessing(false)
                    if (res.statusCode == 200) {
                        setIsEdit(false);
                        await getSudentData()
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
                        text2: JSON.stringify(res.messages),
                        visibilityTime: 2000,
                        autoHide: true,
                    })
                })
        }, 1000)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }} >
            <HeaderUserDetail
                onBackPress={() => navigation.goBack()}
            />
            <LoadingDataModal visible={isLoading} />
            {!isLoading &&
                <ScrollView style={{ flex: 1 }} >
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ width: '90%' }}>
                            <CustomView  >
                                <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Text>Mã sinh viên:</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        outLine={false}
                                        editable={false}
                                        type='flat'
                                        value={student.student_code} />
                                </View>
                            </CustomView>
                            <CustomView>
                                <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Text>Họ tên:</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        outLine={false}
                                        editable={false}
                                        type='flat'
                                        value={student.full_name} />
                                </View>
                            </CustomView>
                            <CustomView>
                                <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Text>Ngày sinh:</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        outLine={false}
                                        editable={false}
                                        type='flat'
                                        value={student.date_of_birth.split('T')[0].split('-').reverse().join('/')} />
                                </View>
                            </CustomView>
                            <CustomView>
                                <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Text>Số điện thoại:</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        outLine={false}
                                        editable={false}
                                        type='flat'
                                        value={student.phone} />
                                </View>
                            </CustomView>
                            <CustomView>
                                <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Text>Email:</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        outLine={false}
                                        editable={false}
                                        multiline={true}

                                        type='flat'
                                        value={student.email} />
                                </View>
                            </CustomView>
                            <CustomView>
                                <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Text>Lớp sinh hoạt:</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Picker
                                        itemStyle={{ fontFamily: 'Inter', fontSize: 18 }}
                                        enabled={isEdit}
                                        selectedValue={student.class_id}
                                        onValueChange={val => setStudent({ ...student, class_id: val })}
                                    >
                                        {classList.map(val => {
                                            return (
                                                <Picker.Item label={val.name} value={val._id} key={val._id} />
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
                                        selectedValue={student.status}
                                        onValueChange={val => setStudent({ ...student, status: val })}
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

                    </View>
                </ScrollView>
            }

            <Toast ref={(ref) => Toast.setRef(ref)} />

        </SafeAreaView >
    );
};


const CustomView = ({ children }) => {

    return <View style={{
        width: '100%', flexDirection: 'row', alignItems: 'center'
    }} >
        {children}
    </View >
}



const CustomHeaderText = ({ children, navigation }) => {

    return (
        <View style={[styles.headerView, { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }]}>
            <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
                <Text style={styles.headerText}>{children}</Text>
            </View>

            <TouchableOpacity style={{ marginLeft: 10 }}
                onPress={() => navigation.goBack()}
            >
                <Icon name='arrow-left' color='#FFFFFF' size={24} />
            </TouchableOpacity>
        </View>
    )
}

export default StudentDetail;