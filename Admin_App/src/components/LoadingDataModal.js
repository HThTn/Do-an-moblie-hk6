import React from 'react';
import { View } from 'react-native';
import SpinKit from 'react-native-spinkit';

import Text from './Text'

const LoadingDataModal = ({ visible, marginTop = '30%' }) => {
    return (
        visible ?
            < View style={{ flex: 1, alignItems: 'center' }}>


                <View style={{ alignItems: 'center', marginTop: marginTop }}>
                    <SpinKit type='Circle' style={{ marginBottom: 5 }} />
                    <Text>Đang tải dữ liệu...</Text>
                </View>


            </View > : null
    );
};

export default LoadingDataModal;