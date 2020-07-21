import React, { Component } from "react";
import { Text, View ,ActivityIndicator,Image} from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import * as Permissions from "expo-permissions";
import { Icon, Button } from "native-base";
import ImgToBase64 from 'react-native-image-base64';
import * as ImageManipulator from "expo-image-manipulator";


export default class CameraComponent extends Component {
    camera = null;
  state = {
    faceSquare: {},
    facesPresent:false,
    loading:false,
    source:'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540sajid_542%252Ffacial-recog/ImageManipulator/e271334c-d89d-4db1-b38f-5a2a8cc496d5.jpg',
    source1:'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540sajid_542%252Ffacial-recog/ImageManipulator/e271334c-d89d-4db1-b38f-5a2a8cc496d5.jpg',
    name:'',
    prob:''

  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }



  captureImage = async ()=>{
    if(this.camera)
    {
       
        if(!this.state.facesPresent) {
            alert('No face detected!');
            return;
        }
        await this.setState({loading:true})
        let photo = await this.camera.takePictureAsync({ base64: true });
        const {uri,base64} = photo;
       
        fetch("http://aade0eb717de.ngrok.io/predict",{
          method: "POST",
          credentials: "include",
          body: JSON.stringify({image:base64}),
          cache: "no-cache",
          headers: new Headers({
            "content-type": "application/json"
          })
        })
        .then(async (res)=>{
         
         return res.json()
          

        })
        .then(async (res)=>{
          console.log(res)
          await this.setState({name:res['prediction']['name'],prob:res['prediction']['prob']})
        await this.setState({loading:false})
        })
        .catch(err=>{
          console.log(err)
        })

        

    }
  }

  render() {
    return (
      <View style={{ width: "100%", flex: 1 }}>
        <Camera
          type={Camera.Constants.Type.front}
          ref ={(ref)=>{this.camera=ref}}
          style={{ flex: 1, width: "100%" }}
          onFacesDetected={res => {
            
            if (res.faces[0]) {
              this.setState({
                  facesPresent:true,
                faceSquare: {
                  width: res.faces[0].bounds.size.width,
                  height: res.faces[0].bounds.size.height,
                  marginLeft: res.faces[0].bounds.origin.x,
                  marginTop: res.faces[0].bounds.origin.y,
                  smillingProbability: res.faces[0].smilingProbability
                }
              });
            }
            if (res.faces.length == 0) {
              this.setState({
                  facesPresent:false,
                faceSquare: {}
              });
            }
            // else {
            //   this.setState({
            //     faceSquare: {}
            //   });
            // }
          }}
          faceDetectorSettings={{
            mode: FaceDetector.Constants.Mode.fast,
            detectLandmarks: FaceDetector.Constants.Landmarks.none,
            runClassifications: FaceDetector.Constants.Classifications.all,
            minDetectionInterval: 100,
            tracking: true
          }}
        >
          
          {Object.keys(this.state.faceSquare) ? (
            <View>
           
              <View
                style={{
                  borderWidth: 2,
                  borderColor:
                    this.state.faceSquare.smillingProbability > 0.7
                      ? "green"
                      : "red",
                  borderStyle: "solid",
                  width: this.state.faceSquare.width,
                  height: this.state.faceSquare.height,
                  marginLeft: this.state.faceSquare.marginLeft,
                  marginTop: this.state.faceSquare.marginTop
                }}
              ></View>
               {this.state.faceSquare.smillingProbability > 0.7 ? (
                <Button
                  style={{
                    backgroundColor: "#007AFF",
                    width: 60,
                    height: 50,
                    alignSelf: "center",
                    marginTop: 10
                  }}
                >
                  <Icon active name="smile" type="FontAwesome5" />
                </Button>
              ) : null}
            </View>
          ) : null}
        </Camera>

        <View style={{flex:0.2,flexDirection:"column",justifyContent:"center"}}>
        <Text style={{color:'green',fontSize:20,fontWeight:"bold",alignSelf:"center"}}>{this.state.name} {this.state.prob}</Text>
             
                  <Button style={{
                    backgroundColor: "#007AFF",
                    alignSelf: "center",
                    padding:10,
                    marginTop: 10
                  }} onPress={()=>{this.captureImage()}}  ><Text>Recognize</Text></Button>
                  {this.state.loading&&(<ActivityIndicator size="large"></ActivityIndicator>)}
                 
        
        </View>
      </View>
    );
  }
}