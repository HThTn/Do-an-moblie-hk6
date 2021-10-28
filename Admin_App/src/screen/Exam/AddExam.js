import { Picker as PickerBase } from '@react-native-picker/picker'
import React, { useState, useContext, useEffect } from 'react'
import { View, ScrollView, TextInput as TextInputBase, TouchableOpacity, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs';
import { RadioButton, Checkbox } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import Spinkit from 'react-native-spinkit'

import styles from '../../style/style'
import { ExamUtils, ClassUtils, SubjectUtils, StudentUtils } from '../../utils'

import TokenContext from '../../Context/TokenContext'
import { mainGray, mainGreen } from '../../style/color'
import {
    HeaderText,
    Text,
    Button,
    TextInput,
    Picker,
    LoadingDataModal,
    DatePicker
} from '../../components'
import { mainWhite } from '../../style/color'

const getDate = (date, min = 1) => {
    return new Date(new Date(date).setMinutes(new Date(date).getMinutes() + min))
}

export default AddExam = ({ navigation }) => {

    const token = useContext(TokenContext)
    const initError = {
        "class_id": false,
        "name": false,
        "for": false,
        "questions": false,
        "year": false,
        "time": false,
        "start_at": false,
        "expire_at": false,
        "type": false
    }
    const initClass = {
        "quantity": 0,
        "status": "",
        "_id": "",
        "name": "",
        "year": "",
        "faculty": "",

    }
    const [type, setType] = useState('all');
    const [questions, setQuestions] = useState([]);
    const [uploadExam, setUploadExam] = useState(false);
    const [uploadStudent, setUploadStudent] = useState(false)
    const [fileExam, setFileExam] = useState('');
    const [fileStudent, setFileStudent] = useState('');
    const [nameExam, setNameExam] = useState('');
    const [classList, setClassList] = useState([]);
    const [time, setTime] = useState('15');
    const [error, setError] = useState(initError);
    const [previewQuestions, setPrevewQuestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [Class, setClass] = useState(initClass);
    const [subjectList, setSubjectList] = useState([]);
    const [subject, setSubject] = useState([]);
    const [studentCodeList, setStudentCodeList] = useState([]);
    const [studentList, setStudentList] = useState([])
    const [loadingStudentList, setLoadingStudentList] = useState(false)
    const [startAt, setStartAt] = useState(getDate(new Date()));
    const [expireAt, setExpireAt] = useState(getDate(new Date(), 2));
    const [typeTest, setTypeTest] = useState('optional');
    // get Class List

    const compareDate = (val) => {
        const date = new Date(val).getDate();
        const hour = new Date(val).getHours();
        const min = new Date(val).getMinutes();
        const today = new Date();
        if (today.getDate() == date) {
            return new Date(val.setMinutes(min + 1));
        }
        return val
    }

    const handlerUploadExam = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            setFileExam(res.name)
            const fileContents = await RNFS.readFile(res.uri, 'utf8').then(res => res)
                .catch(err => {
                    {
                        !loadingStudentList && studentList.map(student => {

                            return <StudentItem
                                full_name={student.full_name}
                                student_code={student.student_code}
                                onPress={() => handlerDeleteStudent(student._id)}
                            />
                        })
                    }
                    console.log(err.message, err.code);
                });
            setQuestions(examFromat(fileContents));
            setUploadExam(true)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled the picker, exit any dialogs or menus and move on");
            } else {
                throw err;
            }
        }
    }
    const uploadStudentList = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            setFileStudent(res.name)
            const fileContents = await RNFS.readFile(res.uri, 'ascii').then(res => res)
                .catch(err => {
                    console.log(err.message, err.code);
                });
            setStudentCodeList(studentListFromat(fileContents))
            setUploadStudent(true)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled the picker, exit any dialogs or menus and move on");
            } else {
                throw err;
            }
        }
    }
    useEffect(async () => {
        try {
            await ClassUtils.getAllClass({ token: token })
                .then(async (res) => {
                    await setClassList(res.data)
                    if (res.data.length > 0) {
                        await setClass(res.data[0])
                    }
                })
            await SubjectUtils.getAllSubject({ token: token })
                .then(async res => {
                    await setSubjectList(res.data)
                    if (res.data.length > 0) {
                        await setSubject(res.data[0])
                    }
                })
        } catch (err) {
            console.log('Error get classList: ', err);
        }
        return () => {
            setClassList()
            setStudentCodeList();
            setSubjectList();
            setStudentList();
            setIsLoading(false)
        }
    }, [])

    useEffect(async () => {
        if (type == 'class' && classList.length == 0) {
            await ClassUtils.getAllClass({ token: token })
                .then(async (res) => {
                    await setClassList(res.data)
                    if (res.data.length > 0) {
                        await setClass(res.data[0])
                    }
                })
        }
        if (type == 'subject' && subjectList.length == 0) {
            await SubjectUtils.getAllSubject({ token: token })
                .then(async res => {
                    await setSubjectList(res.data)
                    if (res.data.length > 0) {
                        await setSubject(res.data[0])
                    }
                })
        }

    }, [type])
    useEffect(async () => {

        if (type == 'group') {
            if (studentCodeList && studentCodeList.length > 0) {
                setLoadingStudentList(true)
                await StudentUtils.getAllStudent({ token: token })
                    .then(async res => {
                        studentCodeList.forEach(async (val, index,) => {
                            let student = await res.data.find(elmt => elmt.student_code == val);
                            if (student) {
                                setStudentList(prev => [...prev, student]);
                            }
                        })
                    })
                setLoadingStudentList(false)
            }
        }
    }, [studentCodeList])
    useEffect(() => {
        if (studentList.length == 0) {
            setUploadStudent(false)
        }
    }, [studentList])

    const handlerDeleteStudent = (student_id) => {
        return setStudentList(prev => prev.filter(student => student._id != student_id));
    }

    const handlerSubmit = async (e) => {
        setError(initError);
        setIsLoading(true)
        console.log(compareDate(expireAt));
        const exam = {
            name: nameExam,
            for: type,
            questions: questions,
            year: new Date().getFullYear(),
            time: time,
            start_at: startAt,
            expire_at: expireAt,
            type: typeTest
        }
        if (type == 'class') {
            exam.class_id = Class._id
        }
        if (type == 'subject') {
            exam.subject_id = subject._id
        }
        if (type == 'group') {
            exam.student_ids = studentList.map(student => student._id)
        }
        try {
            await setTimeout(async () => {
                await ExamUtils.createExam({ token: token, exam: exam })
                    .then(res => {
                        if (res.error == 4000) return setError(res.messages)
                        else if (res.error == 7000) {
                            setError(initError);
                            return Toast.show({
                                type: 'error',
                                position: 'top',
                                text1: 'Thêm đề thi thất bại',
                                text2: 'Đề thi đã tồn tại trong cơ sở dữ liệu',
                                visibilityTime: 2000,
                                autoHide: true,
                            })
                        }
                        else if (res.data) {

                            setNameExam('');
                            setQuestions('')
                            setUploadExam(false)
                            setTime()
                            setPrevewQuestions(false)
                            setStudentCodeList([]);
                            setStudentList([])
                            return Toast.show({
                                type: 'success',
                                position: 'top',
                                text1: 'Thêm dề thi thành công',
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
                setIsLoading(false)

            }, 1000)


        }
        catch (err) {
            console.log('Error submit exam: ', err);
        }

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
            <HeaderText navigation={navigation}  >Tạo bài thi</HeaderText>
            <ScrollView style={{ marginTop: 30 }}>
                <View style={{ flex: 1, alignItems: 'center', }}>

                    {/* Type Exam for */}
                    <View style={{ width: '90%', marginBottom: 15 }}>
                        <Picker
                            label='Loại bài thi'
                            placeholder='Loại bài thi'
                            displayValue={type == 'all' ? 'Tất cả sinh viên'
                                : type == 'class' ? 'Lớp học'
                                    : type == 'subject' ? 'Môn học'
                                        : 'Nhóm'
                            }
                            selectedValue={type}
                            onValueChange={val => setType(val)}
                        >
                            <PickerBase.Item label="Tát cả sinh viên" value='all' />
                            <PickerBase.Item label='Lớp' value='class' />
                            <PickerBase.Item label='Môn học' value='subject' />
                            <PickerBase.Item label='Nhóm' value='group' />
                        </Picker>
                    </View>
                    <View style={{ width: '90%', marginBottom: 15 }}>
                        <Picker
                            label='Hình thức thi'
                            placeholder='Hình thức thi'
                            displayValue={typeTest == 'live' ? 'Live'
                                : typeTest == 'optional' ? 'Optional'
                                    : ''
                            }
                            selectedValue={typeTest}
                            onValueChange={val => setTypeTest(val)}
                        >
                            <PickerBase.Item label='Optional' value='optional' />
                            <PickerBase.Item label="Live" value='live' />

                        </Picker>
                    </View>
                    {/* Name exam */}
                    <View style={{ width: '90%', marginBottom: 15 }}>
                        <TextInput
                            label='Tên bài thi'
                            isFocus={true}
                            outLine={true}

                            placeholder='Tên bài thi'
                            onChangeText={text => setNameExam(text)}
                            value={nameExam}
                            errorMessage={error.name}
                        />

                    </View>

                    {/* Time exam */}
                    <View style={{ width: '90%', marginBottom: 15 }}>
                        <TextInput
                            label='Thời gian làm bài (phút)'
                            isFocus={true}
                            outLine={true}
                            placeholder='Thời gian làm bài (phút)'
                            onChangeText={text => setTime(text)}
                            value={time}
                            errorMessage={error.time}
                        />

                    </View>

                    <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, flexWrap: 'wrap' }}>
                        <View style={{ flex: .49 }}>
                            <View>
                                <DatePicker label='Ngày bắt đầu' dateDefault={startAt}
                                    onPick={val => setStartAt(compareDate(val).toISOString())}
                                    errorMessage={error.start_at}
                                />
                            </View>
                        </View>
                        <View style={{ flex: .49 }}>
                            <View>
                                <DatePicker label='Ngày kết thúc' dateDefault={expireAt}
                                    onPick={val => setExpireAt(compareDate(val).toISOString())}
                                    errorMessage={error.expire_at}
                                />
                            </View>
                        </View>
                    </View>
                    {/* TypeExam */}
                    {type === 'all' && <View style={{ marginBottom: 15 }}></View>}
                    {type === 'class' &&
                        <View style={{ width: '90%', marginBottom: 15 }}>
                            <Picker
                                label='Lớp'
                                placeholder='Lớp'
                                displayValue={Class.name}
                                selectedValue={Class._id}
                                onValueChange={(val, index) => setClass(val)}
                                errorMessage={error.class_id}
                            >
                                {classList.map(val => <PickerBase.Item
                                    label={val.name}
                                    value={val}
                                    key={val._id} />)}
                            </Picker>
                        </View>}

                    {type === 'subject' &&
                        <View style={{ width: '90%', marginBottom: 15 }}>
                            <Picker
                                label='Môn học'
                                placeholder='Môn học'
                                displayValue={subject.name}
                                selectedValue={subject._id}
                                onValueChange={(val, index) => setSubject(val)}
                                errorMessage={error.subject}
                            >
                                {subjectList.map(subject => <PickerBase.Item
                                    label={subject.name}
                                    value={subject}
                                    key={subject._id} />)}
                            </Picker>
                        </View>}

                    {type === 'group' &&
                        <View style={{ width: '90%', }} >
                            <View style={{ paddingTop: 11, }} >

                                <View
                                    style={{ position: 'absolute', top: 0, marginLeft: 15, backgroundColor: mainWhite, borderColor: mainGray, zIndex: 100 }}
                                >
                                    <Text
                                        size={14}
                                        color={mainGray}
                                    >Danh sách sinh viên</Text>
                                </View>
                                <View style={{ minHeight: 200, borderWidth: 1, borderRadius: 5, borderColor: mainGray, paddingTop: 3, flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {!uploadStudent &&
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center', margin: 15, borderWidth: 1, borderColor: mainGray, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}
                                            onPress={() => uploadStudentList()}
                                        >
                                            <Text size={14} color={mainGray} >Thêm sinh viên</Text>
                                            <Icon size={18} name='plus-circle' color={mainGreen} style={{ marginLeft: 10 }} />
                                        </TouchableOpacity>
                                    }

                                    {uploadStudent &&
                                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {loadingStudentList && <LoadingDataModal marginTop={60} visible={true} />}
                                            {!loadingStudentList && studentList.map(student => {

                                                return <StudentItem
                                                    full_name={student.full_name}
                                                    student_code={student.student_code}
                                                    onPress={() => handlerDeleteStudent(student._id)}
                                                    key={student._id}
                                                />
                                            })}
                                        </View>
                                    }

                                </View>
                            </View>
                        </View>
                    }

                    <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Xem đề thi:</Text>
                        <Checkbox
                            status={previewQuestions ? 'checked' : 'unchecked'}
                            onPress={() => setPrevewQuestions(!previewQuestions)}
                        />
                    </View>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        {uploadExam ? (
                            isLoading ?
                                <Spinkit type='FadingCircleAlt' size={50} color='#0598FC' />
                                : <View style={{ width: '70%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ marginRight: 5 }} >
                                        <View>
                                            <Button onPress={handlerSubmit}>Thêm đề thi</Button>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={{ marginLeft: 5 }}>
                                            <Button onPress={() => {
                                                setUploadExam(false)
                                                setPrevewQuestions(false)
                                                setQuestions()
                                            }}>Hủy đề thi</Button>
                                        </View>
                                    </View>
                                </View>)
                            : <View >
                                <View>
                                    <Button onPress={handlerUploadExam}>Thêm file đề thi</Button>
                                </View>
                            </View>
                        }

                    </View>
                </View>

                {
                    (previewQuestions && questions.length > 0) &&
                    <View style={{ alignItems: 'center', marginBottom: 50 }}>
                        {questions.map((val, index) => {
                            return (
                                <View key={index} style={{ borderWidth: 1, width: '90%', marginBottom: 10, padding: 3, borderColor: '#91919a' }}>
                                    <Text size={16}>Câu {index + 1}: {val.question}</Text>
                                    <RadioButton.Group
                                        value={val.answer}
                                    >
                                        <View>
                                            {val.selection.map((question, index) => {
                                                return (
                                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <RadioButton value={question} />
                                                        <Text size={16}>{question}</Text>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </RadioButton.Group>
                                </View>
                            )
                        })}
                    </View>
                }

            </ScrollView >
            <Toast ref={(ref) => Toast.setRef(ref)} />

        </SafeAreaView >
    )
}

const StudentItem = ({ full_name = 'Đào Tuấn Anh', student_code = '18520443', onPress }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, borderWidth: 1, borderColor: mainGray, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }} >
            <Text size={14} >{full_name}-{student_code}</Text>
            <TouchableOpacity onPress={onPress}>
                <Icon name='minus-circle' size={18} color={mainGreen} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
        </View>
    )

}

function examFromat(csv) {
    var lines = csv.split("\n");
    var result = [];

    for (var i = 1; i < lines.length - 1; i++) {

        let line = lines[i].split(',');
        let obj = {
            question: line[0],
            answer: line[1],
            selection: line.slice(2, line.length)
        }
        result.push(obj);
    }
    return result;
}

function studentListFromat(studentList) {
    return studentList.split('\n').filter(val => val != '')
}