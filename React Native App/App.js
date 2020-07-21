import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Root } from "native-base";
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator } from 'react-navigation-drawer';
import * as firebase from 'firebase';
import * as Font from 'expo-font';
import Recog from "./screens/Recog";
import Initial from "./screens/Intial";
import Trainer from "./screens/Trainer";

import { Ionicons } from '@expo/vector-icons';
const stacked = createStackNavigator({
  Recognize:{
    screen:Recog,
    navigationOptions:()=>({
      headerTitle: "Welcome"
    })
  },
  Initial:{
    screen:Initial,
    navigationOptions:()=>({
      headerTitle: "Welcome"
    })

  },
  Trainer:{
    screen:Trainer,
    navigationOptions:()=>({
      headerTitle:"Train Images"
    })
  }

},{
  initialRouteName:"Initial"

}
)


const AppContainer = createAppContainer(stacked);



export default class App extends React.Component {
  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    return (
      <Root>
        <AppContainer />
      </Root>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
