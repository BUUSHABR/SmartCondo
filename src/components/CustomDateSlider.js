import { View, Text, FlatList, TouchableOpacity, } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { commonColors, fonts, themes } from '../themes'
import { generateSubsequentDates } from '../helpers'
import { useSelector } from 'react-redux'
import { ms } from '../helpers/scaling'
import CustomDatePicker from './CustomDatePicker'
import DateTimePicker from "@react-native-community/datetimepicker";

const CustomDateSlider = ({ time, handleInputChange }) => {


    const mode = useSelector(state => state.profile.mode);
    const [dates, setDates] = useState(generateSubsequentDates(15, time));
    const [show, setShow] = useState(false);
    const flatListRef = useRef(null);



    const renderDate = ({ item, index }) => {
        console.log("debree", item)
        const activetimestamp = new Date(time);
        const itemtimestamp = new Date(item.value);
        const formatDate = (date) => {
            return moment(date).format('DD/MM/YYYY');
        };
        return (
            <>
                <TouchableOpacity
                    style={{
                        backgroundColor: themes[mode].black,//formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.yellowColor : themes[mode].black
                        borderRadius: 10, width: 50, alignItems: "center", justifyContent: "space-evenly", height: "100%"
                    }}
                    onPress={() => handleDateSelection(item.value, index)}>
                    <Text style={{
                        alignSelf: "center",
                        textAlign: "center",
                        color: themes[mode].black,//formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.darkWhite : themes[mode].black,
                        fontSize: ms(10),

                        letterSpacing: 0.5,
                        fontFamily: fonts.semiBold

                    }}>{item.weekday}</Text>
                    <Text style={{
                        alignSelf: "center",
                        textAlign: "center",
                        color: themes[mode].black,// formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.darkWhite : themes[mode].black,
                        fontSize: ms(16),
                        letterSpacing: 0.5,
                        fontFamily: fonts.semiBold
                    }}>{item.day}</Text>
                    <Text style={{
                        alignSelf: "center",
                        textAlign: "center",
                        color: themes[mode].black,//formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.darkWhite : themes[mode].black,
                        fontSize: ms(10),
                        letterSpacing: 0.5,
                        fontFamily: fonts.semiBold
                    }}>{item.month}</Text>
                </TouchableOpacity>

            </>
        )
    };
    const handleDateSelection = (selectedDate, index) => {
        console.log(selectedDate, "lopk");
        handleInputChange('visiting_time', selectedDate);
        const newDates = generateSubsequentDates(15, selectedDate);
        const mergedDates = [...dates, ...newDates];
        const uniqueDates = Array.from(new Set(mergedDates.map(date => date.value)))
            .map(value => mergedDates.find(date => date.value === value));

        setDates(uniqueDates);
        if (index) {
            setTimeout(() => flatListRef.current.scrollToIndex({ animated: true, index: index }), 500);
        }
    };

    return (
        <View style={{
            width: "100%",
            marginTop: "5%",
            borderColor: "#FFFF",
            height: 100,
            backgroundColor:
                themes[mode][
                mode === "light" ? "bgColor" : "shadowColor"
                ],
            shadowColor: mode === "light" ? "#bbb" : "#000",
            elevation: 10,
            borderRadius: 5,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.9,
            shadowRadius: 5,
            flex: 1, flexDirection: "row"
        }}>
            <>
                <View style={{ width: "15%", alignContent: "center", alignItems: "center", justifyContent: "space-evenly", flexDirection: "column", backgroundColor: commonColors.yellowColor, color: commonColors.darkWhite, borderRadius: 5 }}>
                    <Text style={{ color: commonColors.darkWhite, fontFamily: fonts.semiBold }}>
                        {moment(time).format('ddd')}
                    </Text>
                    <Text style={{ color: commonColors.darkWhite, fontFamily: fonts.semiBold }}>
                        {moment(time).format('DD')}
                    </Text>
                    <Text style={{ color: commonColors.darkWhite, fontFamily: fonts.semiBold }}>
                        {moment(time).format('MMM')}
                    </Text>
                </View>
                <View style={{ width: "85%" }}>
                    <FlatList
                        ref={flatListRef}
                        data={dates}
                        renderItem={renderDate}
                        keyExtractor={item => item.title}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            // marginHorizontal: 5,
                            alignContent: "center"
                        }}
                        style={{
                            height: ms(100),
                            width: "100%",
                            height: "70%",
                            borderBottomWidth: 2,
                            borderBottomColor: "#0000002B"
                        }}
                    />
                    <View style={{ width: "100%", paddingHorizontal: "8%", paddingVertical: "1%" }}>
                        <Text style={{ textAlign: "right", fontSize: ms(12), fontFamily: fonts.semiBold }}>More</Text>
                        {show && (
                            <View style={{ backgroundColor: "white" }}>
                                <DateTimePicker
                                    value={new Date()}
                                    mode={"date"}
                                    is24Hour={true}
                                    display={displayFormat || "default"}
                                    allowFontScaling={false}
                                    onChange={(val) => {
                                        this.setState({
                                            date: val.nativeEvent.timestamp,
                                            show: false,
                                        });
                                        handleChange(name, val.nativeEvent.timestamp);
                                    }}
                                    minimumDate={minDate}
                                    maximumDate={maxDate}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </>
        </View>
    )
}

export default CustomDateSlider