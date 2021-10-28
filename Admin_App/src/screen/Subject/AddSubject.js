import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Picker as PickerBase } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { Checkbox } from 'react-native-paper'
import Modal from 'react-native-modal'

import styles from '../../style/style'
import TokenContext from '../../Context/TokenContext'
import { yearList, facultyList, apiURL, facultyToVN } from '../../config/config'
import { LoadingModal, Button, TextInput, Picker, Text, SubmitButton, HeaderText, DatePicker } from '../../components'
import { mainGray, mainWhite } from '../../style/color';
import { SubjectUtils, LectureUtils, } from '../../utils'

const getDate = (date, min = 1) => {
    return new Date(new Date(date).setMinutes(new Date(date).getMinutes() + min))
}

const AddSubject = ({ navigation }) => {
    const token = useContext(TokenContext)
    const initError = {
        name: false,
        faculty: false,
        subject_code: false,
        schedule: false,
        lecture_id: false,
        register_at: false,
        end_register_at: false
    }
    const initSubject = {
        name: '',
        faculty: facultyList[0],
        subject_code: '',
        schedule: [],
        lecture_id: '',
        register_at: getDate(new Date()),
        end_register_at: getDate(new Date().setDate(new Date().getDate() + 1))
    }
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
    const initShowModal = {
        monday: false,
        tuesday: false,
        wednesday: false,
        friday: false,
        saturday: false,
        sunday: false

    }
    const [weekday, setWeekDay] = useState('')
    const [schedule, setSchedule] = useState([]);
    const [subject, setSubject] = useState(initSubject);
    const [error, setError] = useState(initError);
    const [showModal, setShowModal] = useState(initShowModal);
    const [lectureList, setLectureList] = useState([]);
    const [lecture, setLecture] = useState(initLecture);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        return () => {
            setSubject();
            setLectureList([]);
            setLecture();
        }
    }, [])

    useEffect(async () => {
        await LectureUtils.getAllLecture({ token: token, faculty: subject.faculty })
            .then(async (res) => {
                await setLectureList(res.data);
                if (res.data.length > 0) {
                    setSubject({ ...subject, lecture_id: res.data[0]._id })
                } else {
                    setSubject({ ...subject, lecture_id: '' })
                }
            })
    }, [subject.faculty])

    useEffect(async () => {
        if (subject.lecture_id) {
            setLecture(lectureList.find(element => element._id == subject.lecture_id))
        } else {
            setLecture(initLecture)
        }
    }, [subject.lecture_id])

    useEffect(async () => {
        await setSubject({ ...subject, schedule: schedule })

    }, [schedule])

    const compareDate = (val) => {
        const date = new Date(val).getDate();
        const hour = new Date(val).getHours();
        const min = new Date(val).getMinutes();
        const today = new Date();
        if (today.getDate() == date) {
            return new Date(val.setMinutes(min + 5));
        }
        return val
    }

    const onSubmitPress = async () => {
        await setError(initError)
        await setIsLoading(true);

        await setTimeout(async () => {
            await SubjectUtils.createSubject({ token: token, subject: subject })
                .then(res => {
                    if (res.data) {
                        setSubject(initSubject)
                        setSchedule([])
                        return Toast.show({
                            type: 'success',
                            position: 'top',
                            text1: 'Thêm môn học thành công',
                            visibilityTime: 2000,
                            autoHide: true,
                        })
                    }

                    else if (res.error == 7000) {
                        return Toast.show({
                            type: 'error',
                            position: 'top',
                            text1: 'Thêm môn học không thành công',
                            text2: 'Môn học đã tồn tại trong hệ thống',
                            visibilityTime: 2000,
                            autoHide: true,
                        })


                    }
                    else if (res.error == 4000) {
                        return setError(res.messages)
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
        })
        setIsLoading(false)

    }

    const findWeekday = (weekday) => {
        return schedule.find(element => element.weekday == weekday)
    }

    const handlerCheckSchedule = async (weekday) => {
        if (findWeekday(weekday)) {
            await setSchedule(prev => {
                return prev.filter(element => element.weekday != weekday)
            })

        }
        else {
            await setSchedule([...schedule, { weekday: weekday }])
            await setShowModal({ ...showModal, [weekday]: true })
            setWeekDay(weekday)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
            <HeaderText navigation={navigation} >Thêm mới môn học</HeaderText>
            <ScrollView style={{ marginTop: 30 }}>
                <View style={[{ alignItems: 'center', marginBottom: 10, flex: 1 }]}>
                    <View style={{ width: '90%', marginBottom: 15 }}>
                        <TextInput
                            label='Tên môn học'
                            placeholder='Tên môn học'
                            onChangeText={val => setSubject({ ...subject, name: val })}
                            value={subject.name}

                            errorMessage={error.name}
                        />
                    </View>
                    <View style={{ width: '90%', marginBottom: 15 }}>
                        <TextInput
                            label='Mã môn học'
                            placeholder='Mã môn học'
                            onChangeText={val => setSubject({ ...subject, subject_code: val })}
                            value={subject.subject_code}
                            errorMessage={error.subject_code}

                        />
                    </View>
                    <View style={{ width: '90%', marginBottom: 15 }}>
                        <Picker
                            label='Khoa'
                            displayValue={facultyToVN[subject.faculty]}
                            selectedValue={subject.faculty}
                            placeholder='Khoa'
                            onValueChange={val => setSubject({ ...subject, faculty: val })}
                            errorMessage={error.faculty}
                        >
                            {facultyList.map(val => <PickerBase.Item
                                label={facultyToVN[val]}
                                value={val}
                                key={val} />)}
                        </Picker>
                    </View>
                    <View style={{ width: '90%', marginBottom: 15 }}>
                        <Picker
                            label='Giảng viên phụ trách'
                            placeholder='Giảng viên phụ trách'
                            displayValue={lecture.full_name}
                            selectedValue={subject.lecture_id}
                            onValueChange={val => setSubject({ ...subject, lecture_id: val })}
                            errorMessage={error.lecture_id}

                        >
                            {lectureList.length == 0 && <PickerBase.Item label='Không có giảng viên' value='' />}
                            {
                                lectureList.length > 0 && lectureList.map(val => <PickerBase.Item
                                    label={val.full_name + '-' + val.email}
                                    value={val._id}
                                    key={val._id} />)
                            }
                        </Picker>
                    </View>

                    <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, flexWrap: 'wrap' }}>
                        <View style={{ flex: .49 }}>
                            <View>
                                <DatePicker label='Ngày đăng kí'
                                    dateDefault={subject.register_at}
                                    onPick={val => {
                                        setSubject({ ...subject, register_at: compareDate(val).toISOString() })
                                    }}
                                    errorMessage={error.register_at}
                                />
                            </View>
                        </View>
                        <View style={{ flex: .49 }}>
                            <View>
                                <DatePicker label='Ngày kết thúc'
                                    dateDefault={subject.end_register_at}
                                    onPick={val => setSubject({ ...subject, end_register_at: compareDate(val).toISOString() })}
                                    errorMessage={error.end_register_at}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ paddingTop: 11, }} >

                        <View
                            style={{ position: 'absolute', top: 0, marginLeft: 15, backgroundColor: mainWhite, borderColor: mainGray, zIndex: 100 }}
                        >
                            <Text
                                size={14}
                                color={mainGray}
                            >Lịch học</Text>
                        </View>
                        <View style={{ borderWidth: 1, borderRadius: 5, borderColor: mainGray, alignItems: 'center', paddingTop: 3 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: '10%', flexDirection: 'column', alignItems: 'center', }}>
                                    <Text>Hai</Text>
                                    <Checkbox
                                        status={findWeekday('monday') ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            handlerCheckSchedule('monday')
                                        }}
                                    />

                                </View>
                                <View style={{ width: '13%', flexDirection: 'column', alignItems: 'center', }}>
                                    <Text>Ba</Text>
                                    <Checkbox
                                        status={findWeekday('tuesday') ? 'checked' : 'unchecked'}
                                        onPress={() => handlerCheckSchedule('tuesday')}

                                    />
                                </View>
                                <View style={{ width: '13%', flexDirection: 'column', alignItems: 'center', }}>
                                    <Text>Tư</Text>
                                    <Checkbox
                                        status={findWeekday('wednesday') ? 'checked' : 'unchecked'}
                                        onPress={() => handlerCheckSchedule('wednesday')}

                                    />
                                </View>
                                <View style={{ width: '13%', flexDirection: 'column', alignItems: 'center', }}>
                                    <Text>Năm</Text>
                                    <Checkbox
                                        status={findWeekday('thursday') ? 'checked' : 'unchecked'}
                                        onPress={() => handlerCheckSchedule('thursday')}

                                    />
                                </View>
                                <View style={{ width: '13%', flexDirection: 'column', alignItems: 'center', }}>
                                    <Text>Sáu</Text>
                                    <Checkbox
                                        status={findWeekday('friday') ? 'checked' : 'unchecked'}
                                        onPress={() => handlerCheckSchedule('friday')}

                                    />
                                </View>
                                <View style={{ width: '13%', flexDirection: 'column', alignItems: 'center', }}>
                                    <Text>Bảy</Text>
                                    <Checkbox
                                        status={findWeekday('saturday') ? 'checked' : 'unchecked'}
                                        onPress={() => handlerCheckSchedule('saturday')}

                                    />
                                </View>
                                <View style={{ width: '13%', flexDirection: 'column', alignItems: 'center', }}>
                                    <Text>CN</Text>
                                    <Checkbox
                                        status={findWeekday('sunday') ? 'checked' : 'unchecked'}
                                        onPress={() => handlerCheckSchedule('sunday')}

                                    />
                                </View>
                            </View>
                        </View>

                    </View>
                    <ModalTime
                        weekday={weekday}
                        schedule={schedule}
                        setSchedule={setSchedule}
                        findWeekday={() => findWeekday(weekday)}
                        showModal={showModal}
                        setShowModal={setShowModal}
                    />
                    <View style={{ marginTop: 15 }}>
                        <SubmitButton
                            isProcessing={isLoading}
                            textProcessing='Đang xử lý...'
                            onPress={onSubmitPress}>Thêm môn học</SubmitButton>
                    </View>
                </View>
            </ScrollView>
            <Toast ref={(ref) => Toast.setRef(ref)} />

        </SafeAreaView >
    );
};

const ModalTime = ({ weekday, schedule, findWeekday, setSchedule, showModal, setShowModal }) => {

    const [time, setTime] = useState({
        from: new Date(new Date().setHours(7)).getHours(),
        to: new Date(new Date().setHours(11)).getHours()
    })

    const handlerSave = () => {
        setSchedule(prev => prev.map(val => {
            if (val.weekday == weekday) {
                val.from = time.from;
                val.to = time.to
            }
            return val
        }))
        setShowModal({ ...showModal, [weekday]: false })

    }

    const handlerCancel = async () => {
        await setSchedule(prev => {
            return prev.filter(element => element.weekday != weekday)
        })
        setShowModal({ ...showModal, [weekday]: false })
    }

    return (
        <Modal isVisible={showModal[weekday]} >
            <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 5, alignItems: 'center', paddingVertical: 50 }}>
                <View style={{ width: '90%', height: 70, marginBottom: 20 }} >
                    <DatePicker
                        label='Thời gian bắt đầu'
                        placeholder='thời gian bắt đầu'
                        mode='time'
                        onPick={val => setTime({ ...time, from: val.getHours() })}
                        dateDefault={new Date().setHours(7, 30)}
                    />
                </View>
                <View style={{ width: '90%', height: 70 }} >

                    <DatePicker
                        label='Thời gian kết thúc'
                        placeholder='thời gian kết thúc'
                        mode='time'
                        onPick={val => setTime({ ...time, to: val.getHours() })}
                        dateDefault={new Date().setHours(11, 30)}
                    />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Button style={{ width: 100, marginRight: 5 }}
                        onPress={() => handlerSave()}
                    >Lưu</Button>
                    <Button style={{ width: 100, marginLeft: 5 }}
                        onPress={() => {
                            handlerCancel()
                        }}
                    >Hủy</Button>
                </View>
            </View>
        </Modal >
    )

}

export default AddSubject;