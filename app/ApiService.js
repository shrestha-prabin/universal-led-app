import { ToastAndroid, AsyncStorage } from 'react-native'
import Config from './Config';

export const updateMessage = (message) => {

    hitAPI(Config.key.message, message)
        .then(res => {
            ToastAndroid.show('Message Updated', ToastAndroid.SHORT);
        })
        .catch(err => {
            alert(err)
        })
}

export const updateSpeed = (delay) => {
    hitAPI(Config.key.speed, delay)
        .then(res => {
            ToastAndroid.show('Speed Updated', ToastAndroid.SHORT);
        })
        .catch(err => {
            alert(err)
        })
}

export const updateTime = (time) => {
    hitAPI(Config.key.time, time)
        .then(res => {
            ToastAndroid.show('Time Updated', ToastAndroid.SHORT);
        })
        .catch(err => {
            alert(err)
        })
}

export const updateBrightness = (value) => {
    hitAPI(Config.key.brightness, value)
        .then(res => {
            ToastAndroid.show('Brightness Updated', ToastAndroid.SHORT);
        })
        .catch(err => {
            alert(err)
        })
}

async function hitAPI(key, value) {

    await AsyncStorage.getItem('secret_key').then(secretKey=>{
        let url = `${Config.baseURL}${secretKey}?${key}=${value}`;    

        if(Config.debug) alert(url)
    
        return fetch(url)
            .then(res => res.json())
            .then(resJson => {
                return resJson;
            })
            .catch(err => {
                if(Config.debug) throw err + '\n' + url;
                else throw err;
            })
    })

    
}