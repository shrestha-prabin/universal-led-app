/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  AsyncStorage,
  TextInput,
} from 'react-native';

import Config from './Config';
import Colors from './Colors';

import MessageInput from './components/MessageInput';
import SpeedControl from './components/SpeedControl';
import TimeInput from './components/TimeInput';
import BrightnessControl from './components/BrightnessControl';
import Button from './components/Button'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      secret_key: '',
      secret_key_form_visible: true
    }
  }


  componentDidMount() {
    AsyncStorage.getItem('secret_key').then(res => {
      if (res != null) {
        this.setState({
          secret_key: res,
          secret_key_form_visible: false
        })
      }

    }).catch(err => {
      this.setState({ secret_key: res })
    })
  }

  saveSecretKey = () => {
    AsyncStorage.setItem('secret_key', this.state.secret_key).then(res=>{
      this.setState({
        secret_key_form_visible: false
      })
    })
  }

  render() {

    if (this.state.secret_key_form_visible) {
      return <View>
        <StatusBar barStyle='dark-content' hidden={false} backgroundColor='#fff2' translucent={true} />

        <Image style={styles.background} source={Config.backgroundImage} />

        <View style={styles.container}>

          <View>
            <TextInput style={styles.input}
              onChangeText={text => this.setState({ secret_key: text})} 
              value={this.state.secret_key}/>

            <Button title="Save" onPress={this.saveSecretKey} />
          </View>

        </View>

      </View>
    }

    return (

      <View>
        <StatusBar barStyle='dark-content' hidden={false} backgroundColor='#fff2' translucent={true} />

        <Image style={styles.background} source={Config.backgroundImage} />

        <ScrollView>

          {/* <Image style={styles.logo} source={Config.logo} /> */}

          <View style={styles.container}>

            <MessageInput />

            <SpeedControl />

            <BrightnessControl />

            <TimeInput />

            <TouchableOpacity onPress={()=>this.setState({ secret_key_form_visible: true })}>
              <Image style={styles.settings} source={require('./assets/settings.png')} />
            </TouchableOpacity>

          </View>
        </ScrollView>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  logo: {
    height: 130,
    marginTop: 36,
    width: '100%',
    resizeMode: 'contain'
  },
  container: {
    minHeight: Dimensions.get('window').height,
    marginLeft: 24,
    marginRight: 24,
    justifyContent: 'space-evenly'
  },
  input: {
    backgroundColor: '#fffe',
    width: '100%',
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 4,
    alignItems: 'center',
    padding: 12,
    textAlign: 'center'
  },
  settings: {
    height: 24,
    width: 24,
    resizeMode:'contain'
  }
});

export default App;
