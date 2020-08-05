import React, { Component } from 'react';
import {
    Alert,
    AsyncStorage,
    StyleSheet,
    TextInput,
    ToastAndroid,
    Text,
    View,
    Slider
} from 'react-native';

import { updateBrightness } from '../ApiService';

export default class BrightnessControl extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            brightness: 50,
            frontKey: props.frontKey,
            backKey: props.backKey,
            debug: props.debug
        });
    }

    componentDidMount() {
        this.fetchSavedValues();
    }

    fetchSavedValues = async () => {
        try {
            const value = await AsyncStorage.getItem('brightness');

            if (value)
                this.setState({
                    brightness: value,
                })

        } catch {

        }
    }

    uploadValue = async () => {

        var value = this.state.brightness;

        if (value == '') {
            value = 0;
        }

        updateBrightness(value)

    }

    render() {
        var displayValue = 'Brightness: ' + this.state.brightness;
        return (
            <View style={styles.container}>
                <Text>{displayValue}</Text>
                <Slider style={styles.slider}
                    value={this.state.brightness}
                    step={1}
                    maximumValue={255}
                    minimumValue={1}
                    onValueChange={value => this.setState({ brightness: value })}
                    onSlidingComplete={this.uploadValue} />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        width: '100%',
        marginTop: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffffe0',
        alignSelf: 'center',
        borderRadius: 4,
    },
    slider: {
        width: '100%',

    }
});