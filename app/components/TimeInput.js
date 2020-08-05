import React, { Component } from 'react';
import { Alert, StyleSheet, Text, ToastAndroid, View } from 'react-native';

import adbs from 'ad-bs-converter';
import Button from './Button';
import { updateTime } from '../ApiService';
import Colors from '../Colors';


export default class TimeInput extends Component {

    state = {
        // date: this.formatDate(new Date(), 'dd MMM yyyy'),
        date: this.getDisplayDate(),
        time: this.formatDate(new Date(), 'h:mm:ss TT')
    }

    constructor(props) {
        super(props);
        this.state = {
            debug: props.debug,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            debug: props.debug
        })
    }

    componentDidMount() {

        setInterval(() => {
            const date = new Date();
            // this.setState({ date: this.formatDate(date, 'dd MMM yyyy') })
            this.setState({ date: this.getDisplayDate() })
            this.setState({ time: this.formatDate(date, 'h:mm:ss TT') })
        }, 1000);

    }

    getDisplayDate() {
        const d = new Date();
        date = this.formatDate(d, 'd/MM/yy');
        var npDate = adbs.ad2bs(this.formatDate(d, 'yyyy/MM/d'));
        var npYear = npDate.ne.year;
        var npMonth = npDate.ne.strMonth;
        var npDay = npDate.ne.day;

        return npDay + ' ' + npMonth + ' ' + npYear;
    }

    getNepaliDate() {
        const format = 'yyyy/MM/dd';
        const d = new Date();
        date = this.formatDate(d, format);

        var npDate = adbs.ad2bs(this.formatDate(d, format));
        var npYear = npDate.en.year;
        var npMonth = npDate.en.month;
        var npDay = npDate.en.day;

        if (npDay < 10) {
            npDay = '0' + npDay;
        }
        if (npMonth < 10) {
            npMonth = '0' + npMonth;
        }

        return npDay + '/' + npMonth + '/' + npYear % 2000;
    }

    async uploadDateTime() {

        const {url, debug} = this.state;

        const d = new Date();
        // date = this.formatDate(d, 'dd/MM/yy');
        date = this.getNepaliDate();
        time = this.formatDate(d, 'H:mm:ss');

        dateTime = date + '-' + time;

        updateTime(dateTime)
    }

    formatDate(date, format, utc) {
        var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        function ii(i, len) {
            var s = i + "";
            len = len || 2;
            while (s.length < len) s = "0" + s;
            return s;
        }

        var y = utc ? date.getUTCFullYear() : date.getFullYear();
        format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
        format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
        format = format.replace(/(^|[^\\])y/g, "$1" + y);

        var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
        format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
        format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
        format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
        format = format.replace(/(^|[^\\])M/g, "$1" + M);

        var d = utc ? date.getUTCDate() : date.getDate();
        format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
        format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
        format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
        format = format.replace(/(^|[^\\])d/g, "$1" + d);

        var H = utc ? date.getUTCHours() : date.getHours();
        format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
        format = format.replace(/(^|[^\\])H/g, "$1" + H);

        var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
        format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
        format = format.replace(/(^|[^\\])h/g, "$1" + h);

        var m = utc ? date.getUTCMinutes() : date.getMinutes();
        format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
        format = format.replace(/(^|[^\\])m/g, "$1" + m);

        var s = utc ? date.getUTCSeconds() : date.getSeconds();
        format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
        format = format.replace(/(^|[^\\])s/g, "$1" + s);

        var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
        format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
        f = Math.round(f / 10);
        format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
        f = Math.round(f / 10);
        format = format.replace(/(^|[^\\])f/g, "$1" + f);

        var T = H < 12 ? "AM" : "PM";
        format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
        format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

        var t = T.toLowerCase();
        format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
        format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

        var tz = -date.getTimezoneOffset();
        var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
        if (!utc) {
            tz = Math.abs(tz);
            var tzHrs = Math.floor(tz / 60);
            var tzMin = tz % 60;
            K += ii(tzHrs) + ":" + ii(tzMin);
        }
        format = format.replace(/(^|[^\\])K/g, "$1" + K);

        var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
        format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
        format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

        format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
        format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

        format = format.replace(/\\(.)/g, "$1");

        return format;
    };

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.timeContainer}>
                    <Text style={styles.title}>Date and Time</Text>

                    <View style={styles.hairline} />
                    <View>
                        <Text style={styles.title}>{this.state.date}</Text>
                        <Text style={styles.title}>{this.state.time}</Text>
                    </View>
                </View>
                <Button title='Upload' onPress={() => this.uploadDateTime()} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop:24,
        marginBottom:24,
        height: 150,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeContainer: {
        backgroundColor: '#fffe',
        width: '100%',
        marginTop: 4,
        marginBottom: 4,
        alignItems: 'center',
        padding: 12,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    title: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center'
    },
    hairline: {
        height: 2,
        width: '100%',
        backgroundColor: Colors.primary,
        margin: 8
    }
})