import React from 'react';
import Toast, { BaseToast } from 'react-native-toast-message';

const ToastMessage = {
    success: ({ text1, ...rest }) => (
        <BaseToast
            {...rest}
            style={{ borderLeftColor: 'pink' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontFamily: 'Inter'
            }}
            text1={text1}
            text2={null}
        />)

}

export default ToastMessage;