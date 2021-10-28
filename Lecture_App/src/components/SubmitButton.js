import React from 'react';
import { View } from 'react-native'
import Spinkit from 'react-native-spinkit';

import Button from './Button'
import Text from './Text'
const SubmitButton = ({
    isProcessing = false, children, onPress, textProcessing = 'Đang xử lý ...', textColor = '#0598FC', btnStyle }) => {

    if (isProcessing) return (
        <View style={{ alignItems: 'center' }} >
            <Spinkit type='FadingCircleAlt' size={50} color={textColor} />
            {textProcessing && <Text style={{ fontFamily: 'Inter', fontSize: 18, color: textColor }}> {textProcessing}</Text>}
        </View >
    )
    return <Button
        style={btnStyle}
        onPress={onPress}>{children}</Button>

};

export default SubmitButton;