import React, { Component } from "react";
import {
  View, StyleSheet, Alert, ActivityIndicator, AsyncStorage, Dimensions, ScrollView, Platform, Image, Text, Picker, TextInput, KeyboardAvoidingView,
} from "react-native";
import {Button} from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

var progress = 0;
export default class EditProfileAlumni extends Component {

    constructor(props)
    {
        super(props);
        this.state={base64Images:[],uriImages:[],text:[{id:'sajid'}],person:'',loading:false}
    }
    

 
  addPhoto = async () => {
    try {
      //Asking for the permissions.
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status == "granted") {
        //Reading the local storage image.

      let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Image,
          allowsEditing: true,
          aspect:[7,5],
          quality: 0.8,
          base64:true
        })
      

        if (!result.cancelled) {
          this.setState({ image: result.uri, imageLoading: true });
          const {uri,base64} = result;
          console.log(uri);

         await this.setState({base64Images:this.state.base64Images.concat(base64),uriImages:this.state.uriImages.concat({id:this.state.uriImages.length+1,value:uri})});


        }
       
      }
      else {
        Alert.alert("Required storage permissions.")
      }
    }
    catch (E) {
      console.log(E);
    }
  }

  submit = ()=>{
      if(this.state.uriImages.length<5)
      {
          Alert.alert("Please add atleast 5 images")
      }
      else
      {
          this.setState({loading:true});
        fetch("http://aade0eb717de.ngrok.io/train",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify({image:this.state.base64Images,name:this.state.person}),
            cache: "no-cache",
            headers: new Headers({
              "content-type": "application/json"
            })
          })
          .then(async (res)=>{
           
           return res.json()
            
  
          })
          .then((res)=>{
              Alert.alert("Training Status:"+res['status']);
              this.setState({loading:false,base64Images:[],uriImages:[]});
          })
          .catch((err)=>console.log(err));
      }
  }


  render() {

    return (
        <View style={{flex:1,flexDirection:"column"}}>
          


            <Text style={{alignSelf:"center",fontWeight:"bold",margin:10,fontSize:20}}>Welcome for Training</Text>
            <Text style={{alignSelf:"center",fontWeight:"bold",margin:10,fontSize:15}}>Enter Name of Person and Atleast Add 5 image</Text>
            <TextInput
                editable={true}
                placeholder="Enter your name"
                underlineColorAndroid='transparent'
                style={{width:200,height:50,borderWidth:2,margin:10,marginTop:0,padding:10,alignSelf:"center"}}
                value={this.state.person}
                onChangeText={(text) => this.setState({ person: text })}
              />
            <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
            {
             this.state.uriImages.length!=0&&   
            this.state.uriImages.map((item,id)=>{
                console.log(item);
                return(
                <View key={id} style={{flexDirection:"row",margin:10}}>
                   
                  <Image source={{uri:item.value}} style={{height:150,width:150}}></Image>

                </View>);
            })

            }
            </View>
          
          
            

            <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                <Button  title="Add Image" buttonStyle={{margin:10}} onPress={()=>{this.addPhoto()}}></Button>
                <Button  title="Train Model" buttonStyle={{margin:10}} onPress={()=>{this.submit()}}></Button>
            </View>
            {this.state.loading&& <ActivityIndicator size="large"></ActivityIndicator>}

        </View>
    );
  }
}

