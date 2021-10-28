import React from 'react';
import { View } from 'react-native'
import Spinkit from 'react-native-spinkit'

import { mainBlue } from '../style/color'
import Button from './Button'
import Text from './Text'
const SubmitButtonDetail = ({ isProcessing = false, isEdit = false, onEditPress, onSavePress, onCancelPress }) => {
    return (
        <View style={{ marginVertical: 10, alignItems: 'center' }}>
            {isProcessing ?
                <View style={{ alignItems: 'center' }}>
                    <Spinkit type='FadingCircleAlt' size={50} color={mainBlue} />
                    <Text style={{ fontFamily: 'Inter', fontSize: 18, color: mainBlue }}> Đang xử lý...</Text>
                </View>
                :
                !isEdit ?
                    <Button onPress={onEditPress} >Chỉnh sửa</Button>
                    :
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Button style={{ marginRight: 5 }} onPress={onSavePress}>Cập nhật</Button>
                        <Button style={{ marginLeft: 5 }} onPress={onCancelPress}>Hủy</Button>
                    </View>
            }

        </View>
    );
};

export default SubmitButtonDetail;