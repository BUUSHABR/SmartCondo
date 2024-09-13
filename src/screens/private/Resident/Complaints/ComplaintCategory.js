import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ImageStore,
} from "react-native";
import { themes, fonts } from "../../../../themes";
import { Header } from "../../../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

import { connect } from "react-redux";
import {
  FocusAwareStatusBar,
  navigate,
} from "../../../../navigation/RootNavigation";
import {
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { complaint } from "../../../../redux/actions";
import { ListTypeColumn } from "../../../../components";
import { ms } from "../../../../helpers/scaling";

class ComplaintCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ComplaintValue: { name: "", value: "" }, // To track if it's the initial mount
    };
  }

  componentDidMount() {
    const { setComplaintList } = this.props;
    this.focusListener = this.props.navigation.addListener(
      "focus",
      async () => {
        console.log("krishnakdsdsudysujhdksdjskdjks");

        setComplaintList();
      }
    );

    this.blurListener = this.props.navigation.addListener("blur", async () => {
      await this.handleReset();
    })
  }

  componentWillUnmount() {
    // Remove listeners on component unmount to prevent memory leaks
    if (this.focusListener) {
      this.focusListener();
    }
    if (this.blurListener) {
      this.blurListener();
    }
  }

  handleReset = async () => {
    this.setState({ComplaintValue:{name:"",value:""}});
  }

  handleChange = async ({ name, value, id, icon, terms, search }) => {
    let decide = this.props?.route?.params?.data ? true : false;
    console.log(name, value, "subvisitor changee", decide, id, terms, search);
    this.setState({ComplaintValue:{name,value}});
    name == "complaint_type" && (await this.props.onComplaintsChange("complaint_type", value ));
    search != "search" &&
      (await this.props.helpDeskCategories(id, decide, terms, value));

    await this.props.complaintsChange({
      name: search == "search" ? "complaintSearch" : name,
      value,
    });

    name != "search" &&
      (await this.props.onComplaintsChange("banner_url", icon));
    //  setTimeout(()=>{
    //   this.props?.route?.params?.data? navigate("AddComplaint"):navigate("ComplaintTerms");

    //  },5000)
    // navigate && this.props.navigation.goBack();
  };
  render() {
    const {
      complaintTypeArr,
      complaintOrgArr,
      complaint_type,
      sub_visitor,
    } = this.props;
    const { handleChange } = this;
    let searchProps = {
      handleSearchChange: handleChange,
      value: this.state.ComplaintValue.value,
      placeholder: "Search your category",
      name: "complaint_type",
    };
    let headerProps = {
      title: "Help Desk",
      // leftIcon: true,

      showRightIcon: true,

      rightText: "History",

      onPressRight: () => {
        console.log("shbhjshjbshjbwhjbhjbwhjb");
        navigate("ComplaintList");
      },
    };
    let listProps = {
      data: sub_visitor,
      onClick: handleChange,
    };
    // alert(JSON.stringify(listProps.data[0].icon_url))
    return (
      <ListTypeColumn
        props={{
          searchEnabled: true,
          searchProps,
          headerProps,
          listProps,
          complaint: true,
        }}
      />
    );
  }
}

const mapStateToProps = ({
  profile: { mode },

  complaint: { complaintTypeArr, complaintOrgArr, complaint_type, sub_visitor },
}) => {
  return {
    mode,
    complaintTypeArr,
    complaintOrgArr,
    complaint_type,
    sub_visitor,
  };
};
const {
  complaintsChange,
  setComplaintList,
  helpDeskCategories,
  onComplaintsChange,
} = complaint;
const mapDispatchToProps = {
  complaintsChange,
  setComplaintList,
  helpDeskCategories,
  onComplaintsChange,
};

const styles = StyleSheet.create({
  flatListContainer: {
    alignItems: "center",
  },
  boxShadow: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(16),
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    borderColor: "transparent",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 3.84,

    elevation: 7,
    marginRight: ms(30),
    marginBottom: ms(30),
    marginLeft: 8,
  },
  categoryText: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: "#F8F8F9",
    alignItems: "center",
    justifyContent: "center",
    width: ms(120),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintCategory);
