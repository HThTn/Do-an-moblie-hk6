import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { RadioButton } from 'react-native-paper'
import Toast from 'react-native-toast-message';
import { Checkbox } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'

import styles from '../../style/style';
import { mainBlue, mainGray, mainWhite } from '../../style/color'
import { apiURL } from '../../config/config';
import TokenContext from '../../Context/TokenContext';
import { LoadingDataModal, Text, TextInput, SubmitButtonDetail, DatePicker } from '../../components';
import { ExamUtils, ClassUtils, SubjectUtils, AnswerUtils, StudentUtils } from '../../utils'

const getDate = (date, min = 1) => {
    return new Date(new Date(date).setMinutes(new Date(date).getMinutes() + min))
}
const ExamDetail = ({ route, navigation }) => {
    const token = useContext(TokenContext);
    const { _id } = route.params;
    const initExam = {
        "student_ids": [],
        "status": "",
        "_id": "",
        "name": "",
        "year": "",
        "faculty": "",
        "year": "",
        "time": "",
        "questions": [],
        "for": "",
        "created_by": "",
        "start_at": '',
        "expire_at": '',
    }
    const initClass = {
        "quantity": 0,
        "status": "",
        "_id": "",
        "name": "Không có lớp",
        "year": "",
        "faculty": "",
    }
    const initError = {
        "status": false,
        "_id": false,
        "name": false,
        "year": false,
        "faculty": false,
        "year": false,
        "time": false,
        "questions": [],
        "for": false,
        "start_at": false,
        "expire_at": false,
    }
    const initSubject = {
        "student_quantity": 0,
        "status": "",
        "_id": "",
        "name": "Không có môn học",
        "faculty": "",
        "subject_code": "",
        "schedule": []
    }
    const [exam, setExam] = useState(initExam)
    const [classList, setClassList] = useState([]);
    const [error, setError] = useState(initError)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [preview, setPreview] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false)
    const [subjectList, setSubjectList] = useState([]);
    const [showResult, setShowRestult] = useState(false);
    const [AnswerList, setAnswerList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [showStudentList, setShowStudentList] = useState(false);

    const getExam = async () => {
        await ExamUtils.getExamById({ token: token, id: _id })
            .then(async (res) => {
                await setExam(res.data)
            })
    }
    const getStudentList = async () => {
        await StudentUtils.getAllStudent({ token: token })
            .then(res => setStudentList(res.data))
    }
    useEffect(async () => {
        await getExam()
        await setIsLoadingData(false)
        return () => {
            setExam()
            setClassList()
        }
    }, [])


    useEffect(async () => {
        if (exam.for == 'class') {
            try {
                await ClassUtils.getAllClass({ token: token, })
                    .then(res => {
                        if (res.data) {
                            setClassList(res.data)
                        }
                    })
            }
            catch (err) {
                console.log('Error get Class:', err);
            }
        }
        if (exam.for == 'subject') {
            await SubjectUtils.getAllSubject({ token: token, })
                .then(res => {
                    if (res.data) {
                        setSubjectList(res.data)
                    }
                })
        }
        if (exam.for == 'group') {
            await getStudentList();
        }
    }, [exam])
    useEffect(async () => {
        if (showResult && AnswerList.length == 0) {
            await AnswerUtils.getAllAnswer({ token: token, exam_id: _id })
                .then(res => {
                    setAnswerList(res.data)
                })
        }
    }, [showResult])

    useEffect(async () => {
        if (AnswerList.length > 0) {
            await getStudentList()
        }
    }, [AnswerList])

    const handlerCancel = () => {
        setIsEdit(false)
        setError(initError)
        getExam()
    }
    const save = async () => {
        setError(initError)
        setIsProcessing(true)
        const query = {
            token: token,
            id: _id,
            exam: {
                name: exam.name,
            }
        }
        await setTimeout(async () => {
            try {
                const updateExam = await ExamUtils.updateExam(query)
                    .then(res => {
                        return res
                    })
                const updateStatus = await ExamUtils.updateExamStatus({ token: token, id: _id, status: exam.status })
                    .then(res => {
                        console.log(res);
                        return res
                    })
                if (updateExam.statusCode == 200 || updateStatus.statusCode == 200) {

                    Toast.show({
                        type: 'success',
                        position: 'top',
                        text1: 'Cập nhật thành công ',
                        visibilityTime: 2000,
                        autoHide: true,
                    })
                    await setIsEdit(!isEdit)
                    getExam();
                }
                else if (updateStatus.statusCode == 200) {

                    Toast.show({
                        type: 'success',
                        position: 'top',
                        text1: 'Cập nhật trạng thái thành công ',
                        visibilityTime: 2000,
                        autoHide: true,
                    })
                    await setIsEdit(!isEdit)
                    getExam();
                }
                else if (updateExam.errors.time == 7000702) {
                    Toast.show({
                        type: 'error',
                        position: 'top',
                        text1: 'Cập nhật thất bại',
                        text2: 'Không thể cập nhật vì quá ngày bắt đầu',
                        visibilityTime: 2000,
                        autoHide: true,
                    })
                }
                else if (updateExam.errors.exam == 7000500) {
                    setError({ name: 'Tên lớp đã tồn tại' })
                }
                else setError(updateExam.messages);
            }


            catch (err) {
                console.log('Error submit:', err);
            }
            await setIsProcessing(false)
        }, 1000)
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
            <CustomHeaderText navigation={navigation} >Chi tiết bài thi</CustomHeaderText>
            <LoadingDataModal visible={isLoadingData} />
            {!isLoadingData && <ScrollView style={{ flex: 1 }} >
                <View style={{ marginTop: 30, alignItems: 'center' }}>

                    <View style={{ width: '90%' }}>
                        <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Tên bài thi:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    outLine={isEdit && new Date() < new Date(exam.start_at)}
                                    outlineColor={mainBlue}
                                    isFocus={true}
                                    type='flat'
                                    editable={isEdit && new Date() < new Date(exam.start_at)}
                                    value={exam.name}
                                    onChangeText={text => setExam({ ...exam, name: text })}
                                    multiline={true}
                                    errorMessage={error.name}
                                />
                            </View>
                        </CustomView>
                        <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Thời gian thi:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    type='flat'
                                    editable={false}
                                    outLine={false}
                                    value={exam.time.toString() + ' phút'} />
                            </View>
                        </CustomView>
                        <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10, }}>
                                <Text >Ngày bắt đầu:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <DatePicker
                                    editable={false}
                                    style={{ borderWidth: 0 }}
                                    dateDefault={exam.start_at}
                                    errorMessage={error.start_at}
                                />
                            </View>
                        </CustomView>
                        <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10, }}>
                                <Text >Ngày kết thúc:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <DatePicker
                                    editable={isEdit}
                                    style={{ borderWidth: 0 }}
                                    dateDefault={exam.expire_at}
                                    onPick={val => setExam({ ...exam, expire_at: getDate(val).toISOString() })}
                                    errorMessage={error.expire_at}
                                />
                            </View>
                        </CustomView>
                        <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Số câu hỏi:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    type='flat'
                                    editable={false}
                                    outLine={false}

                                    value={exam.questions.length.toString()} />
                            </View>
                        </CustomView>
                        <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Loại bài thi:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    type='flat'
                                    editable={false}
                                    outLine={false}

                                    value={exam.for} />
                            </View>
                        </CustomView>
                        <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Được tạo bởi:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    type='flat'
                                    editable={false}
                                    outLine={false}

                                    value={exam.created_by} />
                            </View>
                        </CustomView>
                        {exam.for == 'class' && <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Lớp :</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Picker
                                    mode='dropdown'
                                    itemStyle={{ fontFamily: 'Inter', fontSize: 18 }}
                                    enabled={isEdit}
                                    selectedValue={exam.class_id}
                                    onValueChange={val => setExam({ ...exam, class_id: val })}
                                >
                                    {classList.map(val => {
                                        return (
                                            <Picker.Item label={val.name} value={val._id} key={val._id} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </CustomView>}
                        {exam.for == 'subject' && <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Môn:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Picker
                                    mode='dropdown'
                                    itemStyle={{ fontFamily: 'Inter', fontSize: 18 }}
                                    enabled={isEdit}
                                    selectedValue={exam.subject_id}
                                    onValueChange={val => setExam({ ...exam, subject_id: val })}
                                >
                                    {subjectList.map(val => {
                                        return (
                                            <Picker.Item label={val.name} value={val._id} key={val._id} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </CustomView>}

                        <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Trạng thái:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Picker style={{ marginRight: '23%' }}
                                    mode='dropdown'
                                    itemStyle={{ fontFamily: 'Inter', fontSize: 18 }}
                                    enabled={isEdit}
                                    selectedValue={exam.status}
                                    onValueChange={val => setExam({ ...exam, status: val })}
                                >
                                    <Picker.Item label='Active' value='active' />
                                    <Picker.Item label='Disabled' value='disabled' />
                                </Picker>
                            </View>
                        </CustomView>
                        {exam.for == 'group' && <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Xem danh sách sinh viên</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Checkbox
                                    status={showStudentList ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setShowStudentList(!showStudentList)
                                        setShowRestult(false);
                                        setPreview(false)
                                    }}
                                />
                            </View>
                        </CustomView>}
                        <CustomView >
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Xem câu hỏi</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Checkbox
                                    status={preview ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setPreview(!preview)
                                        setShowRestult(false)
                                        setShowStudentList(false)

                                    }}
                                />
                            </View>

                        </CustomView>
                        <CustomView >
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Xem kết quả</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Checkbox
                                    status={showResult ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setShowRestult(!showResult)
                                        setPreview(false)
                                        setShowStudentList(false)

                                    }}
                                />
                            </View>

                        </CustomView>
                    </View>
                    <SubmitButtonDetail
                        isEdit={isEdit}
                        isProcessing={isProcessing}
                        onEditPress={() => setIsEdit(true)}
                        onCancelPress={() => handlerCancel()}
                        onSavePress={() => save()}
                    />
                    {(preview || showResult || showStudentList) && <View style={{ borderWidth: 1, width: '100%', borderColor: mainGray }} />}
                    {showStudentList && <View style={{ marginTop: 20, width: '100%' }}>
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <View style={{ width: '95%', marginBottom: 10, borderColor: '#91919a' }}>
                                {studentList.map((student) => {
                                    return exam.student_ids.includes(student._id) &&
                                        <View
                                            key={student._id}
                                            style={{ borderWidth: 1, marginBottom: 10, padding: 5, borderRadius: 5, }}
                                        >
                                            <Text  >
                                                Họ tên: {student.full_name}
                                            </Text>
                                            <Text>
                                                MSSV: {student.student_code}
                                            </Text>
                                        </View>
                                })}
                            </View>
                        </View>
                    </View>}

                    {preview && <View style={{ width: '95%', marginTop: 20 }}>
                        <View style={{ alignItems: 'center' }}>
                            {exam.questions.map((val, index) => {
                                return (
                                    <View key={index} style={{ borderWidth: 1, width: '90%', marginBottom: 10, padding: 3, borderColor: '#91919a' }}>
                                        <Text style={{ fontFamily: 'Inter', fontSize: 16 }}>Câu {index + 1}: {val.question}</Text>
                                        <RadioButton.Group
                                            value={val.answer}
                                        >
                                            <View>
                                                {val.selection.map((question, index) => {
                                                    return (
                                                        <View key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                            <RadioButton value={question} />
                                                            <Text style={{ fontFamily: 'Inter', fontSize: 16 }}>{question}</Text>
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                        </RadioButton.Group>
                                    </View>
                                )
                            })}
                        </View>
                    </View>}
                    {showResult && <View style={{ width: '100%', marginTop: 20 }}>
                        <View style={{ alignItems: 'center' }}>
                            {AnswerList.length == 0 && <View style={{ marginBottom: 10 }} >
                                <Text>Chưa có kết quả</Text>
                            </View>
                            }
                            {AnswerList.length > 0 && AnswerList.length > 0 && AnswerList.map((val, index) => {
                                let student = studentList.find(element => element._id == val.student_id)
                                if (student) {
                                    return (
                                        <View key={index} style={{ borderWidth: 1, width: '95%', marginBottom: 10, borderRadius: 5, padding: 3, borderColor: '#91919a' }}>
                                            <Text style={{ fontFamily: 'Inter', fontSize: 16 }}>{student.full_name}-{student.student_code}</Text>
                                            <Text style={{ fontFamily: 'Inter', fontSize: 16 }}>Điểm: {val.score.toFixed(2)}</Text>
                                        </View>
                                    )
                                }
                            })}
                        </View>
                    </View>}


                </View>
            </ScrollView>}
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


export default ExamDetail;