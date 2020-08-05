import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, ToastAndroid, TouchableOpacity, Alert } from 'react-native';
import {
    CustomTextInput,
    register,
    insertText,
    backSpace,
    uninstall,
    hideKeyboard,
    switchSystemKeyboard,
} from 'react-native-custom-keyboard-kit';

import Colors from '../Colors';
import Button from './Button';
import { updateMessage } from '../ApiService';

class MyKeyboard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            lastAddedChar: '',
            lastCharConsonant: true
        }
    }


    onKeyPress = (key) => {
        insertText(this.props.tag, key);
        this.setState({ lastCharConsonant: true, lastAddedChar: key });
    }

    onNotConsonantKeyPress = (key) => {
        insertText(this.props.tag, key);
        this.setState({ lastCharConsonant: false });
    }

    onVowelKeyPress = (key) => {
        insertText(this.props.tag, key);
        this.setState({ lastCharConsonant: false, lastAddedChar: key });
    }

    onPressBackSpace = () => {
        backSpace(this.props.tag);
        this.setState({ lastCharConsonant: false });
    }

    onPressHideKeyboard = () => {
        hideKeyboard(this.props.tag);
    }

    onPressSpaceBar = () => {
        insertText(this.props.tag, ' ');
        this.setState({ lastCharConsonant: false });

    }

    switchKeyboard = () => {
        switchSystemKeyboard(this.props.tag);
    }
    renderFirstRow = () => {
        const { lastCharConsonant, lastAddedChar } = this.state;

        if (lastAddedChar == '' || lastAddedChar == ' ' || !lastCharConsonant) {
            const keys = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९', 'ऋ', '्'];
            return <View style={{ flexDirection: 'row' }}>
                {
                    keys.map(char => {
                        return <Key char={char} onPress={this.onNotConsonantKeyPress} />
                    })
                }
            </View>
        } else {
            const keys = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९', 'ृ', '्'];
            return <View style={{ flexDirection: 'row' }}>
                {
                    keys.map(char => {
                        if (char == 'ृ' || char == '्')
                            return <VowelKey consonant={lastAddedChar} vowel={char} onPress={this.onVowelKeyPress} />
                        return <Key char={char} onPress={this.onNotConsonantKeyPress} />
                    })
                }
            </View>
        }
    }

    renderKeysRow = (keys) => {
        return <View style={{ flexDirection: 'row' }}>
            {
                keys.map(char => {
                    return <Key char={char} onPress={this.onKeyPress} />
                })
            }
        </View>
    }

    renderSymbols = (symbols) => {
        return <View style={{ flexDirection: 'row' }}>
            {
                symbols.map(symbol => {
                    return <Key char={symbol} onPress={this.onKeyPress} />
                })
            }
        </View>
    }

    renderVowels = () => {
        const { lastCharConsonant, lastAddedChar } = this.state;
        console.log(lastCharConsonant);


        if (lastAddedChar == '' || lastAddedChar == ' ' || !lastCharConsonant) {
            const vowels = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'];
            return <View style={{ flexDirection: 'row' }}>
                {
                    vowels.map(char => {
                        return <Key char={char} onPress={this.onVowelKeyPress} />
                    })
                }
            </View>
        }

        const vowels = ['', 'ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः'];
        return <View style={{ flexDirection: 'row' }}>
            {
                vowels.map((vowel, i) => {
                    if (i == 0)
                        return <Key char={lastAddedChar} onPress={this.onKeyPress} />
                    else
                        return <VowelKey consonant={lastAddedChar} vowel={vowel} onPress={this.onVowelKeyPress} />
                })
            }
        </View>
    }

    renderBottomRow = () => {
        const { lastCharConsonant, lastAddedChar } = this.state;

        const keys = ['keyboard', 'ँ', 'ॐ', '।', 'space', 'clear', 'close'];

        return <View style={{ flexDirection: 'row', }}>
            {
                keys.map(key => {
                    switch (key) {
                        case 'keyboard': return <SwitchKeyboard onPress={this.switchKeyboard} />
                        case 'space': return <SpaceBar onPress={this.onPressSpaceBar} />
                        case 'clear': return <BackButton onPress={this.onPressBackSpace} />
                        case 'close': return <CloseButton onPress={this.onPressHideKeyboard} />

                        case 'ँ': case 'ं': if (lastAddedChar == '' || lastAddedChar == ' ' || !lastCharConsonant) {
                            return <Key char={key} onPress={this.onKeyPress} />
                        } else {
                            return <VowelKey consonant={lastAddedChar} vowel={key} onPress={this.onVowelKeyPress} />
                        }

                        default: return <Key char={key} onPress={this.onNotConsonantKeyPress} />
                    }
                })
            }
        </View>
    }

    render() {
        return (
            <View style={{ backgroundColor: '#f4f4f4', display: 'flex', flexDirection: 'column' }}>

                {this.renderFirstRow()}
                {this.renderVowels()}
                {this.renderKeysRow(['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ'])}
                {this.renderKeysRow(['ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ'])}
                {this.renderKeysRow(['म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ'])}

                {this.renderBottomRow()}

            </View>
        );
    }
}

register('nepali', () => MyKeyboard);

export default class MessageInput extends Component {

    urlBase = this.props.urlBase;
    constructor(props) {
        super(props);
        this.state = ({
            message: '',
            lastAddedChar: '',
        });
    }

    componentDidMount() {
        this.fetchSavedMessage();
    }

    saveMessage = async () => {
        try {
            await AsyncStorage.setItem('message', this.state.message);
        } catch (err) {
        }
    }

    fetchSavedMessage = async () => {
        try {
            message = await AsyncStorage.getItem('message');
            this.setState({ message: message })
        } catch (err) {
        }
    }

    async uploadMessage() {
        let { message } = this.state;
        this.saveMessage();

        message = replaceMappedCharacters(message);
        message = this.convertMessage(message);

        updateMessage(message)
    }


    convertMessage(message) {
        var messageArray = message.split('');
        var convertedMessage = '';

        var lastCharNepali = false;
        var lastCharEnglish = false;

        messageArray.forEach((alphabet, index) => {

            if (alphabet >= 'ऀ' || alphabet == '') {
                if (index == 0) convertedMessage += '~';
                if (lastCharEnglish) convertedMessage += '~';
                var unicode = alphabet.charCodeAt(0).toString(16);
                convertedMessage += ('%' + unicode.substring(unicode.length - 2, unicode.length));

                lastCharNepali = true;
                lastCharEnglish = false;

            } else {
                if (index == 0) convertedMessage += '}';
                if (lastCharNepali) convertedMessage += '}';
                convertedMessage += alphabet;

                lastCharEnglish = true;
                lastCharNepali = false;
            }
        });
        return convertedMessage;
    }

    onChangeText = (text) => {
        this.setState({ message: text });
    }

    render() {

        const {  message } = this.state;
 
        return (
            <View style={styles.container}>

                <View style={styles.messageContainer}>
                    <Text style={styles.title}>Message</Text>

                    <View style={styles.hairline} />

                    <CustomTextInput
                        placeholder='Enter Message Here'
                        style={styles.messageInput}
                        customKeyboardType='nepali'
                        value={message}
                        maxLength={400}
                        multiline={true}
                        onChangeText={this.onChangeText}
                    />
                </View>

                <Text style={{ width: '100%', textAlign: 'right' }}>{message ? message.length : 0}/400</Text>

                <Button
                    onPress={() => this.uploadMessage()}
                    title='Upload' />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },
    messageContainer: {
        backgroundColor: '#fffe',
        width: '100%',
        borderRadius: 4,
        marginTop: 4,
        marginBottom: 4,
        alignItems: 'center',
        padding: 12
    },
    messageInput: {
        textAlign: 'center',
        height: 100
        // backgroundColor: '#eee'
    },
    uploadbutton: {
        width: '100%',
        backgroundColor: '#234',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    title: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center'
    },
    buttonText: {
        fontSize: 16,
        color: '#fff'
    },
    hairline: {
        height: 2,
        width: '100%',
        backgroundColor: Colors.primary,
        margin: 8
    },
    buttonLabel: {
        textAlign: "center",
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        fontSize: 20,
        color: '#444'
    },
    button: {
        width: "33.333333333%",
    },
})

function Key(props) {

    const styles = {
        button: {
            width: '8.333333333%',
            borderWidth: 0.5,
            // borderColor: '#ddd',
            borderColor: '#fff',
            paddingTop: 2,
            paddingBottom: 2,
        },
        label: {
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#444',
            fontSize: 18,
        }
    }

    var { char } = props;
    // code = parseInt(code, 16);
    // var label = String.fromCharCode(code);

    var displayLabel = char;

    return <View style={styles.button}>
        <TouchableOpacity onPress={() => props.onPress(char)}>
            <Text style={styles.label}>{displayLabel}</Text>
        </TouchableOpacity>
    </View>
}

function VowelKey(props) {
    let { vowel, consonant } = props;
    const styles = {
        button: {
            width: '8.333333333%',
            borderWidth: 0.5,
            // borderColor: '#ddd',
            borderColor: '#fff',
            paddingTop: 2,
            paddingBottom: 2,
        },
        label: {
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#486',
            fontSize: 18,
        }
    }

    // vowel = parseInt(vowel, 16);

    // vowel = String.fromCharCode(vowel);
    // var displayLabel = mapNepaliChar(consonant) + '' + vowel;

    var displayLabel = consonant + '' + vowel;

    return <View style={styles.button}>
        <TouchableOpacity onPress={() => props.onPress(vowel)}>
            <Text style={styles.label}>{displayLabel}</Text>
        </TouchableOpacity>
    </View>
}

function SpaceBar(props) {

    return <TouchableOpacity style={{
        borderWidth: 0.5,
        flexGrow: 1,
        borderColor: '#bbb',
    }}
        onPress={() => props.onPress(' ')}>
        <Text style={styles.buttonLabel}>&mdash;</Text>
    </TouchableOpacity>
}

function BackButton(props) {
    return <TouchableOpacity style={{
        borderWidth: 0.5,
        width: '15%',
        borderColor: '#fff',
        color: '#fff',
        padding: 8
    }}
        onPress={props.onPress}>
        <Image style={{
            height: 24, width: 48, resizeMode: 'contain'
        }}
            source={require('../assets/keyboard/backspace.png')} />
    </TouchableOpacity>
}

function CloseButton(props) {
    return <TouchableOpacity style={{
        borderWidth: 0.5,
        width: '15%',
        borderColor: '#fff',
        padding: 8
    }}
        onPress={props.onPress}>
        <Image style={{
            height: 24, width: 40, resizeMode: 'contain'
        }}
            source={require('../assets/keyboard/return.png')} />
    </TouchableOpacity>
}

function SwitchKeyboard(props) {
    return <TouchableOpacity style={{
        borderWidth: 0.5,
        width: '10%',
        borderColor: '#fff',
        color: '#fff',
        paddingTop: 4
    }}
        onPress={props.onPress}>
        <Image style={{
            height: 36, width: 30, resizeMode: 'contain'
        }}
            source={require('../assets/keyboard/keyboard.png')} />
    </TouchableOpacity>
}

function replaceMappedCharacters(message) {
    console.log('before mapping', message);

    message = message.replace(/क्ष/g, 'ऺ');
    message = message.replace(/त्र/g, 'ऻ');
    message = message.replace(/ज्ञ/g, '़');
    message = message.replace(/ऊ/g, 'ऌ');
    message = message.replace(/ /g, 'ॿ');

    console.log('after mapping', message);

    return message;
}