import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { themes, fonts } from "../../src/themes";
import { detectTheme } from "../../src/helpers";
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
export const BottomLoader = () => {
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          width: 50,
          height: 20,
          borderRadius: 5,
        }}
      />
    </SkeletonPlaceholder>
  );
};

export const SubscribeLoader = () => {
  const mode = detectTheme();
  return (
    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >
      <View
        style={{
          height: 60,
          borderRadius: 5,
          marginHorizontal: 20,
          marginVertical: 10,
          borderBottomWidth: 0.5,
          borderColor: themes[mode]["lineColor"],
        }}
      >
        <View style={{ width: "30%", height: 5 }} />
        <View style={{ height: 30, marginVertical: 10 }} />
      </View>
    </SkeletonPlaceholder>
  );
};
export const CommunityListLoader = ({ expand }) => {
  const mode = detectTheme();
  return (
    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: 35,
            height: 35,
            borderRadius: 17,
            backgroundColor: themes[mode]["lightAsh1"],
            alignSelf: "center",
            marginVertical: 20,
          }}
        />
        <View
          style={{
            height: 60,
            borderRadius: 5,
            marginHorizontal: 20,
            marginVertical: 10,
            // borderBottomWidth: 0.5,
            borderColor: themes[mode]["lineColor"],
            width: "100%",
            alignSelf: "center",
          }}
        >
          <View style={{ width: "30%", height: 5 }} />
          <View style={{ height: 20, marginVertical: 10 }} />
        </View>
      </View>

      <View
        style={{
          height: expand ? 234 : 134,
          width: "100%",
          borderRadius: 10,
          backgroundColor: themes["light"]["lightAsh"],
          marginHorizontal: 5,
          marginVertical: 10,
          padding: 20,
          flexDirection: "row",
          justifyContent: "center",
          alignSelf: "center"

        }}
      >
      </View>
    </SkeletonPlaceholder>
  );
};
export const VisitorLoader = () => {
  const mode = detectTheme();
  return (
    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >

      <View style={{
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: themes[mode]["lightAsh1"],
        // alignSelf: "center",
        marginVertical: 10, marginHorizontal: 15
      }}></View>
      <View style={{ width: "30%", height: 5, marginLeft: 25 }} />
    </SkeletonPlaceholder>
  );
};
export const UpcomingLoader = () => {
  const mode = detectTheme();
  return (
    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10
        }}
      >
        <View
          style={{
            width: 35,
            height: 35,
            borderRadius: 17,
            backgroundColor: themes[mode]["lightAsh1"],
            alignSelf: "center",
            marginVertical: 20,
          }}
        />
        <View
          style={{
            height: 60,
            borderRadius: 5,
            marginHorizontal: 20,
            marginVertical: 10,
            borderBottomWidth: 0.5,
            borderColor: themes[mode]["lineColor"],
            width: "80%",
            alignSelf: "center",
          }}
        >
          <View style={{ width: "50%", height: 5 }} />
          <View style={{ height: 30, marginVertical: 10 }} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};
export const NotificationLoader = () => {
  const mode = detectTheme();
  return (
    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10
        }}
      >
        <View
          style={{
            width: 35,
            height: 35,
            borderRadius: 17,
            backgroundColor: themes[mode]["lightAsh1"],
            alignSelf: "center",
            marginVertical: 20,
          }}
        />
        <View
          style={{
            height: 60,
            borderRadius: 5,
            marginHorizontal: 20,
            marginVertical: 10,
            borderBottomWidth: 0.5,
            borderColor: themes[mode]["lineColor"],
            width: "80%",
            alignSelf: "center",
          }}
        >
          <View style={{ width: "50%", height: 5 }} />
          <View style={{ height: 30, marginVertical: 10 }} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};
export const InfoLoader = () => {
  const mode = detectTheme();
  return (
    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >
      {/* <TourGuideZone
                zone={3}
                text={"A react-native-copilot remastered! 🎉"}
                borderRadius={16}
                style={{ paddingLeft: 10 }}
              >  */}

      <View
        style={{
          height: 100,
          width: "100%",
          borderRadius: 20,
          backgroundColor: themes["light"]["lightAsh"],
          // marginHorizontal: 5,
          // marginVertical: 10,
          // padding: 20,
          // flexDirection: "row",
          // justifyContent: "space-between",
        }}
      ></View>
      {/* </View> */}
      {/* </TourGuideZone> */}
    </SkeletonPlaceholder>
  );
};

export const AnnouncementLoader = () => {
  const mode = detectTheme();
  return (
    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >
      {/* <TourGuideZone
                zone={3}
                text={"A react-native-copilot remastered! 🎉"}
                borderRadius={16}
                style={{ paddingLeft: 10 }}
              >  */}
      {/* <View
        style={{
          height: 204,
          borderRadius: 20,
          minWidth: "70%",
          borderWidth: 1,
          borderColor: themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
          marginRight: 20,
        }}
      > */}
      <View
        style={{
          height: 134,
          borderRadius: 20,
          backgroundColor: themes["light"]["lightAsh"],
          marginHorizontal: 5,
          marginVertical: 10,
          padding: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          minWidth: "40%",
        }}
      >
        <View style={{}}></View>
        <View>{/* <AnnouncementIcon /> */}</View>
      </View>
      {/* <View
          style={{
            width: "90%",
            height: 10,
            backgroundColor: themes[mode]["lightAsh1"],
            alignSelf: "center",
          }}
        />
        <View
          style={{
            width: "80%",
            height: 10,
            backgroundColor: themes[mode]["lightAsh1"],
            alignSelf: "center",
            marginTop: 10,
          }}
        /> */}
      {/* </View> */}
      {/* </TourGuideZone> */}
    </SkeletonPlaceholder>
  );
};

export const SOSLoader = () => {
  const mode = detectTheme();
  return (
    <View
      style={{
        width: 125,
        height: 129,
        borderRadius: 10,
        backgroundColor: themes[mode]["dimWhite"],
        marginHorizontal: 15,
        marginVertical: 20,
      }}
    >
      <SkeletonPlaceholder
        speed={1500}
        backgroundColor={themes[mode]["bottom"]}
        highlightColor={
          themes[mode][mode === "light" ? "lightAsh" : "otpColor"]
        }
      >
        <View>
          <View
            style={{
              alignSelf: "center",
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 1,
              borderColor:
                themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
              marginTop: 20,
              flexGrow: 1,
            }}
          ></View>
          <View
            style={{
              height: 32,
              backgroundColor:
                themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
              marginTop: 25,
            }}
          ></View>
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

export const SOSLoaderr = () => {
  const mode = detectTheme();
  return (
    <View
      style={{
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: themes[mode]["dimWhite"],
        marginHorizontal: 30,
        marginVertical: 20,
      }}
    >
      <SkeletonPlaceholder
        speed={1500}
        backgroundColor={themes[mode]["bottom"]}
        highlightColor={
          themes[mode][mode === "light" ? "lightAsh" : "otpColor"]
        }
      >
        <View>
          <View
            style={{
              alignSelf: "center",
              width: 40,
              height: 40,
              borderRadius: 25,
              borderWidth: 1,
              borderColor:
                themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
              marginTop: 20,
              flexGrow: 1,
            }}
          ></View>
          <View
            style={{

              height: 10,
              backgroundColor:
                themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
              marginTop: 35,
            }}
          ></View>
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

export const SOSCommunityLoader = () => {
  const mode = detectTheme();
  return (

    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={
        themes[mode][mode === "light" ? "lightAsh" : "otpColor"]
      }
    >
      <View style={{
        width: "91%",
        minHeight: 70,
        borderRadius: 10,
        backgroundColor:
          themes[mode][
          mode === "light" ? "bgColor" : "modalWrap"
          ],
        // justifyContent: "center",
        marginHorizontal: 20,
        marginVertical: 10,
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.15,
        // shadowColor: "#bbb",
        shadowRadius: 10,
        shadowOpacity: 0.1,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center'
      }}>


      </View>
      {/* <View>
          <View
            style={{
              alignSelf: "center",
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 1,
              borderColor:
                themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
              marginTop: 15,
              flexGrow: 1,
            }}
          ></View>
        </View>
        <View
            style={{
              height: 17,
              backgroundColor:
                themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
              marginTop: 35,
            }}
          ></View> */}
    </SkeletonPlaceholder>

  );
};
export const VideoAccessLoader = () => {
  const mode = detectTheme();
  return (

    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={
        themes[mode][mode === "light" ? "lightAsh" : "otpColor"]
      }
    >
      <View
        style={{
          width: "90%",
          height: 35,
          backgroundColor:
            themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
          marginHorizontal: "5%",
          marginVertical: "5%",
          borderRadius: 20
        }}
      ></View>
    </SkeletonPlaceholder>

  )
}
export const FeatureLoader = () => {
  const mode = detectTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // borderWidth: 1,

        elevation: 3,
        // shadowColor:themes
      }}
    >
      <View
        style={{
          width: 15,
          height: 15,
          borderRadius: 7,
          backgroundColor:
            themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
        }}
      />
      <SkeletonPlaceholder
        speed={1500}
        backgroundColor={themes[mode]["bottom"]}
        highlightColor={
          themes[mode][mode === "light" ? "lightAsh" : "otpColor"]
        }
      >
        <View
          style={{
            width: 50,
            height: 15,
            backgroundColor:
              themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
            marginHorizontal: 10,
          }}
        ></View>
      </SkeletonPlaceholder>
    </View>
  );
};

export const ShowComplaintLoader = () => {
  const mode = detectTheme();
  return (
    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
        }}
      >
        <View style={{ width: 35, height: 35, borderRadius: 17 }} />
        <View style={{ paddingLeft: 30 }}>
          <View
            style={{
              width: 120,
              height: 7,
              paddingTop: 10,
            }}
          />
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
            return (
              <View
                style={{
                  width: 300,
                  height: 10,
                  marginTop: 20,
                }}
              />
            );
          })}
          <View
            style={{
              width: "80%",
              height: 120,
              backgroundColor:
                themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
              marginVertical: "7%",
              alignSelf: "center",
            }}
          ></View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export const ShowAnnouncementDetailLoader = () => {
  const mode = detectTheme();
  return (
    <SkeletonPlaceholder
      key={0}
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >
      <View
        style={{
          paddingHorizontal: 10,
        }}
      >
        <View style={{}}>
          <View
            style={{
              width: 180,
              height: 15,
              marginVertical: 10,
            }}
          />
          <View
            style={{
              width: 120,
              height: 8,
              marginVertical: 10,
            }}
          />
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
            return (
              <View
                style={{
                  width: 330,
                  height: 10,
                  marginTop: 20,
                  alignSelf: "center",
                  marginHorizontal: 15,
                }}
              />
            );
          })}
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export const ShowVisitorDetailsLoader = () => {
  const mode = detectTheme();
  return (
    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 30,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "55%",
            // justifyContent: 'center',
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor:
                themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
            }}
          />
          <View
            style={{
              width: 100,
              height: 15,
              borderRadius: 3,
              backgroundColor:
                themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
              marginLeft: 5,
            }}
          />
        </View>
        <View
          style={{
            width: "50%",
            flexDirection: "row",
            // flexDirection: 'row',
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor:
                themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
            }}
          />
          <View
            style={{
              width: 100,
              height: 15,
              borderRadius: 3,
              backgroundColor:
                themes[mode][mode === "light" ? "lightAsh" : "otpColor"],
              marginLeft: 5,
            }}
          />
        </View>
        {/* {[1, 2].map(item => {
          return (
            
          );
        })} */}
      </View>
    </SkeletonPlaceholder>
  );
};

export const ShowFacilityDescription = () => {
  return (
    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >
      <View
        style={{
          width: "50",
          height: 10,
          borderWidth: 1,
          borderColor: "transparent",
          backgroundColor:
            themes[mode][mode === "light" ? "ligtAsh" : "otpColor"],
          marginVertical: 5,
        }}
      ></View>
    </SkeletonPlaceholder>
  );
};

export const BannerImageLoader = () => {
  return (
    <SkeletonPlaceholder
      speed={1500}
      backgroundColor={themes[mode]["bottom"]}
      highlightColor={themes[mode][mode === "light" ? "lightAsh" : "otpColor"]}
    >
      <View
        style={{
          height: 500,
          backgroundColor:
            themes[mode][mode === "light" ? "ligtAsh" : "otpColor"],
        }}
      ></View>
    </SkeletonPlaceholder>
  );
};
