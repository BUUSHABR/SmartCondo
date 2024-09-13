import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  TextInput,
  TouchableNativeFeedback,
} from "react-native-gesture-handler";
import { themes, fonts } from "../themes";
import { detectTheme } from "../helpers";
import {
  ArrowDown,
  ContractorType,
  DropDownNotify,
  ErrorIcon,
  NoNotify,
  SearchIcon,
  TickIcon,
} from "../../assets/img/svgs";
import { useDispatch } from "react-redux";
import { onComplaintsChange } from "../redux/actions/complaint";
import { ServerContainer } from "@react-navigation/native";
import ActionSheet, {
  useScrollHandlers,
  ActionSheetRef,
  SheetProps,
} from "react-native-actions-sheet";
import { Image } from "react-native";
import { ms } from "../helpers/scaling";

const BottomView = (props) => {
  console.log(props, "11p");
  const { dropDownList, standard, type, onChange, id, label, error, value, } = props;
  console.log(dropDownList, "11props");

  const actionSheetRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const scrollHandlers = useScrollHandlers("scrollview-1", actionSheetRef);
  const [isOpen, setIsOpen] = useState(false);
  const [singleSelect, setSingleSelect] = useState(standard?standard:{});
  const [MultiSelect, setMultiSelect] = useState([]);
  const [Filters, setFilters] = useState([]);
  const [Search, setSearch] = useState("");
  const [Data, setData] = useState([]);
  const [isAct, setisAct] = useState(true);
  const isSearch = false;
  const multiSelect = type == "single-select" ? false : true;
  const snapPoints = useMemo(() => ["50%"], []);
  const mode = detectTheme();
  const dispatch = useDispatch();
  const showError = error?.length > 5;

  useEffect(() => {
    setData(dropDownList);
    // bottomSheetRef.current?.snapToIndex(-1);setisAct
    setisAct(false);
  }, [dropDownList]);

  useEffect(() => {
    if(!isAct && singleSelect?.code){
      onChange(
        "single-select",
        singleSelect?.id,
        singleSelect?.value,
        singleSelect?.label
      )
   
    }
      if(!isAct && !singleSelect?.code ){
      onChange(
        "single-select",
        multiSelect
          ? MultiSelect?.map((data) => {
            return data.id;
          })
          : singleSelect.id,
        id,
        type,
        label
    
      
    )
  }
    // bottomSheetRef.current?.snapToIndex(-1);
  }, [singleSelect, MultiSelect]);

  const handleSearch = (text) => {
    setSearch(text);
  };
  useEffect(() => {
    console.log("Serach callimh");
    if (Search.length != 0) {
      console.log("search working");
      let x = Data.filter((data) => {
        if (data.label.toUpperCase().includes(Search.toUpperCase())) {
          console.log("hey you");
          return data;
        }
      });
      console.log(datas, "datas");
      setFilters(datas);
    } else {
      console.log("search not working");
      setFilters([]);
    }
  }, [Search]);

  const handleClose = useCallback((index, decide) => {
    if (decide) {
      actionSheetRef.current?.show();
    } else {
      actionSheetRef.current?.hide();
    }
  }, []);
  const handleChange = (type, item) => {
    console.log("pppppp", item);
    if (multiSelect) {
      console.log("logging");
      let index = Data.findIndex((data) => data.id == item.id);
      console.log(index, "ppppppppp");
      let dataChange = Data;
      dataChange[index].selected = !dataChange[index].selected;
      console.log(dataChange, "datagsjhdutkbc dwlkjliv");
      let multi = dataChange.filter((data) => data.selected == true);
      setMultiSelect(multi);
      setData(dataChange);
    } else {
      setSingleSelect(item);
    }
  };
  const Item = ({ item }) => {
    const { icon, label, selected,code } = item;
    console.log(item, "bootom dropdownitems");
    return (
      <View style={{ paddingHorizontal: 20, position: "relative" }}>
        <TouchableOpacity
          style={{
            borderColor: "transparent",
            borderBottomColor: themes[mode]["lightAsh"],
            borderWidth: 1,
            paddingHorizontal: 20,
            paddingVertical: 15,
            opacity: 0.5,
            flexDirection: "row",
          }}
          onPress={() => {
            !multiSelect && handleClose(-1, false);
            handleChange("multiSelect", item);
          }}
        >
          {icon != null && (
            <View style={{}}>
              <Text>ko</Text>
            </View>
          )}
          {code != null && (
            <View style={{}}>
              <Image
                source={{ uri: `https://flagcdn.com/48x36/${code}.png` }}
                style={{ width: 16, height: 14,marginHorizontal:ms(10)}} 
                alt="Ko"/>
            </View>
          )}
          <View style={{ marginLeft: icon != null ? 20 : 0 }}>
            <Text>{label}</Text>
          </View>
        </TouchableOpacity>
        {selected && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              paddingHorizontal: 20,
            }}
          >
            <View style={{ alignSelf: "flex-end", top: 20, left: 10 }}>
              <TickIcon />
            </View>
          </View>
        )}
      </View>
    );
  };

  const ItemSelected = ({ item }) => {
    return (
      <View>
        <Text
          style={{
            fontFamily: fonts.semiBold,
            fontWeight: "600",
            fontSize: 16,
            color: themes[mode]["headingColor"],
          }}
        >
          {item.label},
        </Text>
      </View>
    );
  };
  const renderItem = ({ item }) => <Item item={item} />;
  const renderSeletedItem = ({ item }) => <ItemSelected item={item} />;
  return (
    <View style={[styles.container]}>
      <Text
        style={{
          fontFamily: fonts.regular,
          color: themes[mode]["lightAsh"],
          fontSize: ms(12),
        }}
      >
        {label}
      </Text>
      <TouchableNativeFeedback
        onPress={() => {
          handleClose(0, true);
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            padding: 10,
            paddingVertical: 15,
            borderColor: "transparent",
            borderBottomColor:
              themes[mode][showError ? "error" : "borderColor"],
            borderWidth: 1,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginRight: 15, marginLeft: -9 }}>
              <ContractorType />
            </View>

            {multiSelect ? (
              Data.some((data) => data.selected == true) ? (
                <View style={{ height: 25, width: "85%" }}>
                  <FlatList
                    horizontal
                    data={MultiSelect}
                    renderItem={renderSeletedItem}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              ) : (
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize:ms(12),
                    color: themes[mode]["lightAsh"],
                  }}
                >
                  Please select
                </Text>
              )
            ) : (
              <View style={{flexDirection:"row"}}>
                {singleSelect?.code &&(
                  <View style={{}}>
                  <Image
                    source={{ uri: `https://flagcdn.com/48x36/${singleSelect?.code}.png` }}
                    style={{ width: ms(16), height: ms(14),marginHorizontal:ms(10),marginVertical:ms(5)}} 
                    alt="Ko"/>
                </View>
                )}
              <Text
                style={{
                  fontSize: typeof singleSelect.label != "string" ? ms(14) : ms(16),
                  fontFamily:
                    typeof singleSelect.label != "string"
                      ? fonts.regular
                      : fonts.semiBold,
                  color:
                    typeof singleSelect.label != "string"
                      ? themes[mode]["lightAsh"]
                      : themes[mode]["headingColor"],
                }}
              >
                {typeof singleSelect.label == "string"
                  ? singleSelect.label
                  : "Please select"}
              </Text>
              </View>
            )}
          </View>

          <View style={{ marginRight: 15 }}>
            <ArrowDown />
          </View>
        </View>
      </TouchableNativeFeedback>
      <View style={{ margin: 3 }}>
        {showError && (
          <View style={{ flexDirection: "row", marginVertical: 5 }}>
            <ErrorIcon />
            <Text
              style={{
                ...styles.error,
                color: themes[mode]["error"],
              }}
            >
              {error}
            </Text>
          </View>
        )}
      </View>

      <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
        <ScrollView {...scrollHandlers} nestedScrollEnabled={true}>
          <View>
            {isSearch && (
              <View style={styles.searchSection}>
                <SearchIcon />
                <TextInput
                  style={styles.input}
                  placeholder="Search"
                  onChangeText={handleSearch}
                  value={Search}
                  underlineColorAndroid="transparent"
                />
              </View>
            )}
            <View style={{ height: 300 }}>
              {console.log(Filters, "oooooooooooooooo")}
              {!(Search.length > 0 && Filters.length == 0) ? (
                <FlatList
                  data={Filters.length == 0 ? Data : Filters}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  // showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  disableVirtualization={true}
                />
              ) : (
                <View
                  style={{
                    justifyContent: "space-evenly",
                    width: "100%",
                    alignItems: "center",
                    height: 300,
                  }}
                >
                  <DropDownNotify />
                  <Text
                    style={{
                      alignSelf: "center",
                      textAlign: "center",
                      fontFamily: fonts.regular,
                    }}
                  >
                    No Record Found
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#f6f6f6",
    color: "#424242",
    borderRadius: 10,
    marginLeft: 15,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 7,
  },
});

export default BottomView;
