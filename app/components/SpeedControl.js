import React, { Component } from 'react';
import {
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    Slider
} from 'react-native';

import { updateSpeed } from '../ApiService';

export default class SpeedControl extends Component {

    constructor(props) {
        super(props);
        this.state = {
            speed: 25,
        };
    }

    componentDidMount() {
        this.fetchSavedValues();
    }

    fetchSavedValues = async () => {
        try {
            const value = await AsyncStorage.getItem('speed');
            if (value) this.setState({ speed: value })
        } catch {

        }
    }

    uploadValue = async () => {
        var value = this.state.speed;

        if (!value || value == '') {
            value = 0;
        }

        const delay = 60 - value;
        updateSpeed(delay)

        try { await AsyncStorage.setItem('speed', delay); } catch (error) { }
    }

    speedLevel(level) {
        if (level <= 10) {
            return 'Very Slow';
        } else if (level <= 20) {
            return 'Slow';
        } else if (level <= 30) {
            return 'Normal';
        } else if (level <= 40) {
            return 'Fast';
        } else if (level <= 50) {
            return 'Very Fast';
        } else {
            return '-';
        }
    }

    render() {
        var displayValue = 'Speed: ' + this.speedLevel(this.state.speed);
        return (
            <View style={styles.container}>
                <Text>{displayValue}</Text>
                <Slider style={styles.slider}
                    value={this.state.speed}
                    step={1}
                    maximumValue={50}
                    minimumValue={0}
                    onValueChange={value => this.setState({ speed: value })}
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