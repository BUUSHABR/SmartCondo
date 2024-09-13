import React, {useRef} from 'react';
import {View, Text, Dimensions} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import {commonColors, fonts} from '../themes';

const PaginationComponent = props => {
  const carouselRef = useRef(null);

  const {
    data,
    renderItem,
    onSnapToItem,
    currentIndex,
    itemWidth,
    itemHeight,
    dotStyle1,
    leftText,
  } = props;

  const pagination = ({data, currentIndex}) => {
    return (
      <Pagination
        dotsLength={data.length}
        activeDotIndex={currentIndex}
        containerStyle={{}}
        dotStyle={{
          width: 9,
          height: 9,
          borderRadius: 5,

          backgroundColor: commonColors.darkWhite,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };
  return (
    <View style={{}}>
      <Carousel
        ref={carouselRef}
        data={data}
        renderItem={renderItem}
        onSnapToItem={onSnapToItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        // loop={true}
        // autoplay={true}
        // autoplayDelay={1000}
        // autoplayInterval={3000}
        // lockScrollWhileSnapping={true}
        // loopClonesPerSide={4}
        // enableMomentum 
      />

      <View
        style={{
          ...dotStyle1,
        }}>
        <View>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 22,
              color: commonColors.darkWhite,
              textTransform: 'capitalize',
              letterSpacing: 0.5,
              marginVertical: data?.length < 2 ? 10 : 0,
            }}>
            {leftText}
          </Text>
        </View>
        <View style={{}}>{pagination({data, currentIndex})}</View>

        <View style={{width: '30%'}} />
      </View>
    </View>
  );
};

export default PaginationComponent;
