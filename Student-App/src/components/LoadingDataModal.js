import React from 'react';
import { View } from 'react-native';
import SpinKit from 'react-native-spinkit';

import Text from './Text'

const LoadingDataModal = ({ visible }) => {
    return (
        visible ?
            < View style={{ flex: 1, alignItems: 'center' }}>


                <View style={{ alignItems: 'center', marginTop: '30%' }}>
                    <SpinKit type='Circle' style={{ marginBottom: 5 }} />
                    <Text>Đang tải dữ liệu...</Text>
                </View>


            </View > : null
    );
};

export default LoadingDataModal;