import {Picker as PickerBase} from '@react-native-picker/picker';
import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput as TextInputBase,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {RadioButton, Checkbox} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Spinkit from 'react-native-spinkit';

import {ExamUtils, ClassUtils} from '../../utils';

import TokenContext from '../../Context/TokenContext';
import {apiURL, yearList} from '../../config/config';
import {
  Text,
  Button,
  TextInput,
  Picker,
  DatePicker,
} from '../../components/Tags';
import {mainWhite} from '../../style/color';

const getDate = (date, min = 1) => {
  return new Date(new Date(date).setMinutes(new Date(date).getMinutes() + min));
};
export default AddExam = ({navigation}) => {
  const token = useContext(TokenContext);
  const initError = {
    subject_id: false,
    name: false,
    for: false,
    questions: false,
    year: false,
    time: false,
    start_at: false,
    expire_at: false,
    type: false,
  };
  const initsubject = {
    quantity: 0,
    status: '',
    _id: '',
    name: '',
    year: '',
    faculty: '',
  };
  const [type, setType] = useState('subject');
  const [questions, setQuestions] = useState([]);
  const [uploadExam, setUploadExam] = useState(false);
  const [uploadStudent, setUploadStudent] = useState(false);
  const [fileExam, setFileExam] = useState('');
  const [fileStudent, setFileStudent] = useState('');
  const [nameExam, setNameExam] = useState('');
  const [subjectList, setsubjectList] = useState([]);
  const [subjectId, setsubjectId] = useState('');
  const [time, setTime] = useState(15);
  const [error, setError] = useState(initError);
  const [previewQuestions, setPrevewQuestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setsubject] = useState(initsubject);
  const [compelete, setComplete] = useState(false);
  const [startAt, setStartAt] = useState(getDate(new Date()));
  const [expireAt, setExpireAt] = useState(getDate(new Date(), 2));
  const [typeTest, setTypeTest] = useState('optional');
  // get subject List

  const handlerUploadExam = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFileExam(res.name);
      const fileContents = await RNFS.readFile(res.uri, 'utf8')
        .then(res => res)
        .catch(err => {
          console.log(err.message, err.code);
        });
      setQuestions(examFromat(fileContents));
      setUploadExam(true);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log(
          'User cancelled the picker, exit any dialogs or menus and move on',
        );
      } else {
        throw err;
      }
    }
  };

  useEffect(async () => {
    try {
      await fetch(`${apiURL}/subject/lecture`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then(res => res.json())
        .then(async res => {
          await setsubjectList(res.data);
          if (res.data.length > 0) {
            await setsubjectId(res.data[1]._id);
            setComplete(true);
          }
        });
    } catch (err) {
      console.log('Error get subjectList: ', err);
    }
    return () => {
      setsubjectList();
      setIsLoading(false);
    };
  }, []);

  useEffect(async () => {
    await setsubject(subjectList.find(element => element._id == subjectId));
  }, [subjectId]);
  const handlerSubmit = async e => {
    setIsLoading(true);
    const exam = {
      name: nameExam,
      for: type,
      questions: questions,
      year: new Date().getFullYear(),
      time: time,
      start_at: startAt,
      expire_at: expireAt,
      type: typeTest,
    };
    if (type === 'subject') {
      exam.subject_id = subjectId;
    }
    console.log(exam.subject_id);
    try {
      await setTimeout(async () => {
        ExamUtils.createExam({token: token, exam: exam}).then(res => {
          console.log(res);
          setIsLoading(false);
          if (res.error == 4000) return setError(res.messages);
          if (res.error == 7000) {
            setError(initError);
            return Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Thêm đề thi thất bại',
              text2: 'Đề thi đã tồn tại trong cơ sở dữ liệu',
              visibilityTime: 2000,
              autoHide: true,
            });
          }
          setError(initError);
          setNameExam('');
          setQuestions('');
          setUploadExam(false);
          setPrevewQuestions(false);
          return Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Thêm dề thi thành công',
            visibilityTime: 2000,
            autoHide: true,
          });
        });
      }, 1000);
    } catch (err) {
      console.log('Error submit exam: ', err);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: mainWhite}}>
      {compelete && (
        <ScrollView style={{marginTop: 30}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            {/* Type Exam for */}
            <View style={{width: '90%'}}>
              <Picker
                label="Loại bài thi"
                placeholder="Loại bài thi"
                displayValue={type}
                selectedValue={type}
                onValueChange={val => setType(val)}>
                <PickerBase.Item label="Lớp" value="subject" />
              </Picker>
            </View>
            {/* Name exam */}
            <View style={{width: '90%'}}>
              <TextInput
                label="Tên bài thi"
                isFocus={true}
                outLine={true}
                placeholder="Tên bài thi"
                onChangeText={text => setNameExam(text)}
                value={nameExam}
                errorMessage={error.name}
              />
            </View>
            {/* TypeExam */}
            {type === 'subject' && (
              <View style={{width: '90%', marginBottom: 15}}>
                <Picker
                  label="Môn học"
                  placeholder="Lớp"
                  displayValue={subject.name}
                  selectedValue={subjectId}
                  onValueChange={(val, index) => setsubjectId(val)}
                  errorMessage={error.subject_id}>
                  {subjectList.map(val => (
                    <PickerBase.Item
                      label={val.name}
                      value={val._id}
                      key={val._id}
                    />
                  ))}
                </Picker>
              </View>
            )}
            {type === 'group' && (
              <View>
                {uploadStudent ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text>{fileStudent}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setuploadExam(false);
                        setQuestions();
                      }}>
                      <Icon name="times" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Button
                    title="Chọn file danh sách sinh viên"
                    onPress={uploadStudentList}
                  />
                )}
              </View>
            )}
            <View style={{width: '90%', marginBottom: 15}}>
              <Picker
                label="Hình thức thi"
                placeholder="Hình thức thi"
                displayValue={
                  typeTest == 'live'
                    ? 'Live'
                    : typeTest == 'optional'
                    ? 'Optional'
                    : ''
                }
                selectedValue={typeTest}
                onValueChange={val => setTypeTest(val)}>
                <PickerBase.Item label="Optional" value="optional" />
                <PickerBase.Item label="Live" value="live" />
              </Picker>
            </View>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 15,
                flexWrap: 'wrap',
              }}>
              <View style={{flex: 0.49}}>
                <View>
                  <DatePicker
                    label="Ngày bắt đầu"
                    dateDefault={startAt}
                    onPick={val => setStartAt(getDate(val).toISOString())}
                    errorMessage={error.start_at}
                  />
                </View>
              </View>
              <View style={{flex: 0.49}}>
                <View>
                  <DatePicker
                    label="Ngày kết thúc"
                    dateDefault={expireAt}
                    onPick={val =>
                      setExpireAt(getDate(val, time).toISOString())
                    }
                    errorMessage={error.expire_at}
                  />
                </View>
              </View>
            </View>
            {/* Time */}
            <View
              style={{
                width: '90%',
                díplay: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text>Thời gian làm bài: </Text>
              <TextInputBase
                style={{
                  color: '#495057',
                  width: '7%',
                  fontFamily: 'Inter',
                  fontSize: 18,
                }}
                value={time.toString()}
                onChangeText={text => setTime(text)}
              />
              <Text>phút</Text>
            </View>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text>Xem đề thi:</Text>
              <Checkbox
                status={previewQuestions ? 'checked' : 'unchecked'}
                onPress={() => setPrevewQuestions(!previewQuestions)}
              />
            </View>
            <View style={{marginTop: 20, marginBottom: 20}}>
              {uploadExam ? (
                isLoading ? (
                  <Spinkit type="FadingCircleAlt" size={50} color="#0598FC" />
                ) : (
                  <View
                    style={{
                      width: '70%',
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{marginRight: 5}}>
                      <View>
                        <Pressable
                          style={styles.submit}
                          onPress={handlerSubmit}>
                          <Text style={styles.textStyle}>Thêm đề thi</Text>
                        </Pressable>
                      </View>
                    </View>
                    <View>
                      <View style={{marginLeft: 5}}>
                        <Pressable
                          style={styles.submit}
                          onPress={() => {
                            setUploadExam(false);
                            setPrevewQuestions(false);
                            setQuestions();
                          }}>
                          <Text style={styles.textStyle}>Hủy đề thi</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )
              ) : (
                <View>
                  <View>
                    <Pressable
                      style={styles.button}
                      onPress={handlerUploadExam}>
                      <Text style={styles.textStyle}>Thêm file đề thi</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
            <Toast ref={ref => Toast.setRef(ref)} />
          </View>

          {previewQuestions && questions.length > 0 && (
            <View style={{alignItems: 'center', marginBottom: 50}}>
              {questions.map((val, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      borderWidth: 1,
                      width: '90%',
                      marginBottom: 10,
                      padding: 3,
                      borderColor: '#91919a',
                    }}>
                    <Text size={16}>
                      Câu {index + 1}: {val.question}
                    </Text>
                    <RadioButton.Group value={val.answer}>
                      <View>
                        {val.selection.map((question, index) => {
                          return (
                            <View
                              key={index}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <RadioButton value={question} />
                              <Text size={16}>{question}</Text>
                            </View>
                          );
                        })}
                      </View>
                    </RadioButton.Group>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
function examFromat(csv) {
  var lines = csv.split('\n');
  var result = [];

  for (var i = 1; i < lines.length - 1; i++) {
    let line = lines[i].split(',');
    let obj = {
      question: line[0],
      answer: line[1],
      selection: line.slice(2, line.length),
    };
    result.push(obj);
  }
  return result;
}

function studentListFromat(studentList) {
  return studentList.split('\n');
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    width: 200,
    borderRadius: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submit: {
    backgroundColor: '#2196F3',
    padding: 15,
    width: 150,
    borderRadius: 20,
  },
});
