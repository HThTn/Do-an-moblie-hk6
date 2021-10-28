import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Modal, RadioButton } from 'react-native-paper'
import Toast from 'react-native-toast-message';
import { Checkbox } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'

import styles from '../../style/style';
import { mainBlue, mainWhite } from '../../style/color'
import { facultyToVN, getDateMonthYear, weekdayToVN } from '../../config/config';
import TokenContext from '../../Context/TokenContext';
import { LoadingDataModal, Text, TextInput, SubmitButtonDetail } from '../../components';
import { SubjectUtils, LectureUtils } from '../../utils'
const SubjectDetail = ({ route, navigation }) => {
    const token = useContext(TokenContext)
    const { _id } = route.params;
    const initError = {
        name: false,
        faculty: false,
        subject_code: false,
        schedule: false,
        lecture_id: false
    }
    const initSubject = {
        _id: '',
        name: '',
        faculty: '',
        subject_code: '',
        schedule: [],
        lecture_id: '',
        status: '',
        student_quantity: 0,
    }
    const initLecture = {
        "_id": "",
        "date_of_birth": "",
        "email": "",
        "faculty": "",
        "full_name": "Không có giảng viên",
        "password": "",
        "phone": "",
        "status": ""
    }
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [subject, setSubject] = useState(initSubject)
    const [error, setError] = useState(initError)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [newSubject, setNewSubject] = useState({});
    const [lectureList, setLectureList] = useState([]);
    const [lecture, setLecture] = useState(initLecture)
    const [preview, setPreview] = useState(false)
    const getSubjetcData = async () => {
        await SubjectUtils.getSubjectById({ token: token, id: _id })
            .then(async (res) => {
                await setSubject(res.data)
            })
    }
    useEffect(async () => {
        await getSubjetcData()
        return () => {
            setSubject();
            setNewSubject();
            setLectureList();
        }
    }, [])
    useEffect(async () => {
        await LectureUtils.getLectureById({ token: token, id: subject.lecture_id })
            .then(res => {
                if (res.data) {
                    setLecture(res.data)
                }
            })
        // await LectureUtils.getAllLecture({ token: token, faculty: subject.faculty })
        //     .then(res => {
        //         if (res.data) {
        //             setLectureList(res.data)
        //         }
        //     })
        setIsLoadingData(false)
    }, [subject])
    const cancelHandler = async () => {
        setIsEdit(false)
        await getSubjetcData()
    }

    const save = async () => {
        setIsProcessing(true)
        await setError(initError);
        const query = {
            token: token,
            id: _id,
            subject: {
                name: subject.name,
                faculty: subject.faculty,
                subject_code: subject.subject_code,
                lecture_id: subject.lecture_id
            }
        }
        await SubjectUtils.updateSubject(query)
            .then(async res => {
                if (res.statusCode == 200) {
                    setIsEdit(false)
                    await getSubjetcData();
                    Toast.show({
                        type: 'success',
                        position: 'top',
                        text1: 'Cập nhật thành công thành công',
                        visibilityTime: 2000,
                        autoHide: true,
                    })

                }
                else if (res.error == 4000) {
                    setError(res.messages)
                }
                else if (res.errors.time && res.errors.time == 7000702) {
                    Toast.show({
                        type: 'error',
                        position: 'top',
                        text1: 'Cập nhật thất bại',
                        text2: 'Không thể cập nhật vì quá ngày bắt đầu',
                        visibilityTime: 2000,
                        autoHide: true,
                    })
                }
                else {
                    Toast.show({
                        type: 'error',
                        position: 'top',
                        text1: 'Error',
                        text2: JSON.stringify(res),
                        visibilityTime: 2000,
                        autoHide: true,
                    })
                }

            })
        setIsProcessing(false)
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
            <CustomHeaderText navigation={navigation} >Chi tiết môn học</CustomHeaderText>
            <LoadingDataModal visible={isLoadingData} />
            {!isLoadingData &&
                <View style={{ flex: 1, marginTop: 30, alignItems: 'center' }}>
                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Tên môn học:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                outLine={isEdit}
                                outlineColor={mainBlue}
                                isFocus={true}
                                type='flat'
                                editable={isEdit}
                                value={subject.name}
                                multiline={true}
                                errorMessage={error.name}
                                onChangeText={val => {
                                    setSubject({ ...subject, name: val })
                                    setNewSubject({ newSubject, name: val })
                                }}
                            />
                        </View>
                    </CustomView>

                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Mã môn học:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                outLine={isEdit}
                                outlineColor={mainBlue}
                                isFocus={true}
                                type='flat'
                                editable={isEdit}
                                value={subject.subject_code}
                                multiline={true}
                                errorMessage={error.subject_code}
                                onChangeText={val => {
                                    setSubject({ ...subject, subject_code: val })
                                    setNewSubject({ newSubject, subject_code: val })
                                }}
                            />
                        </View>
                    </CustomView>

                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Giảng viên:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            {/* <Picker
                                itemStyle={{ fontFamily: 'Inter', fontSize: 18 }}
                                enabled={isEdit}
                                selectedValue={subject.lecture_id}
                                onValueChange={val => setSubject({ ...subject, lecture_id: val })}
                            >
                                {lectureList.length == 0 && <Picker.Item label='Không có giảng viên' value={0} />}
                                {lectureList.length > 0 && lectureList.map(val => {
                                    return (
                                        <Picker.Item label={val.full_name} value={val._id} key={val._id} />
                                    )
                                })}
                            </Picker> */}
                            <TextInput
                                outLine={false}
                                type='flat'
                                editable={false}
                                value={lecture.full_name ? lecture.full_name : 'Không có giảng viên'}
                                multiline={true}
                            />
                        </View>
                    </CustomView>

                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Khoa quản lý:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                outLine={false}
                                type='flat'
                                editable={false}
                                value={facultyToVN[subject.faculty]}
                                multiline={true}
                            />
                        </View>
                    </CustomView>

                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Ngày mở đăng kí:</Text>
                        </View>
                        <View style={{ flex: 1 }}>

                            <TextInput
                                outLine={false}
                                type='flat'
                                editable={false}
                                value={subject.register_at ? getDateMonthYear(subject.register_at) : 'Null'}
                                multiline={true}
                            />
                        </View>
                    </CustomView>
                    <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Ngày đóng đăng kí:</Text>
                        </View>
                        <View style={{ flex: 1 }}>

                            <TextInput
                                outLine={false}
                                type='flat'
                                editable={false}
                                value={subject.end_register_at ? getDateMonthYear(subject.end_register_at) : 'Null'}
                                multiline={true}
                            />
                        </View>
                    </CustomView>
                    <CustomView >
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Xem lịch học</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Checkbox
                                status={preview ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setPreview(!preview)
                                }}
                            />
                        </View>

                    </CustomView>
                    {/* <CustomView>
                        <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                            <Text>Trạng thái:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Picker style={{ marginRight: '23%' }}
                                mode='dropdown'
                                itemStyle={{ fontFamily: 'Inter', fontSize: 18 }}
                                enabled={false}
                                selectedValue={subject.status}
                                onChangeText={val => {
                                    setSubject({ ...subject, status: val })
                                    setNewSubject({ newSubject, status: val })
                                }}
                            >
                                <Picker.Item label='Active' value='active' />
                                <Picker.Item label='Disable' value='disable' />
                            </Picker>
                        </View>
                    </CustomView> */}
                    <SubmitButtonDetail
                        isEdit={isEdit}
                        isProcessing={isProcessing}
                        onEditPress={() => setIsEdit(true)}
                        onSavePress={() => save()}
                        onCancelPress={() => {
                            cancelHandler()
                        }}
                    />
                    {preview && <View style={{ marginTop: 20, width: '100%' }}>
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            {(subject.schedule && subject.schedule.length == 0) && <Text>Không có lịch học</Text>}
                            <View style={{ width: '95%', marginBottom: 10, borderColor: '#91919a' }}>
                                {subject.schedule.map((val) => {
                                    return (
                                        <View
                                            key={val._id}
                                            style={{ borderWidth: 1, marginBottom: 10, padding: 5, borderRadius: 5, alignItems: 'center' }}
                                        >
                                            <Text  >
                                                Thứ {weekdayToVN[val.weekday]}: {val.from}h - {val.to}h
                                            </Text>

                                        </View>)
                                })}
                            </View>
                        </View>
                    </View>}
                </View>
            }
            <Toast ref={(ref) => Toast.setRef(ref)} />

        </SafeAreaView>
    );
};

const CustomView = ({ children, borderWidth = 0 }) => {

    return <View style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: borderWidth
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


export default SubjectDetail;