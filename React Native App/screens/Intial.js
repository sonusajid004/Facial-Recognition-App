import React, { Component } from "react";
import { Text, View ,ActivityIndicator,Image,TouchableOpacity} from "react-native";
import {Button} from "react-native-elements";

export default class CameraComponent extends Component {
  
  render() {
    return (
      <View style={{flex:1,flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"white"}}>
       <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Trainer")}}>
         <View style={{justifyContent:"center",alignItems:"center",elevation:2,borderWidth:0.2,margin:20,height:100,width:150,borderRadius:10}}>
           <Text>Train Images</Text>
         </View>
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Recognize")}}>
         <View style={{justifyContent:"center",alignItems:"center",elevation:2,margin:20,borderWidth:0.2,height:100,width:150,borderRadius:10}}>
           <Text>Recognize</Text>
         </View>
       </TouchableOpacity>
        
        
      </View>
    );
  }
}