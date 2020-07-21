import React from 'react'
import {View,Text,StyleSheet,Image, TouchableOpacity} from 'react-native'
export default class App extends React.Component
{
  state={
    doctors:[
      {
        id:0,
        imgid:"./../assets/icon.png",
        name:"Rani"
      },
      {
        id:1,
        imgid:"./../assets/icon.png",
        name:"Moni"
      },
      {
        id:2,
        imgid:"./../assets/icon.png",
        name:"sai"
      },
      {
        id:3,
        imgid:"./../assets/icon.png",
        name:"siva"
      },
      {
        id:4,
        imgid:"./../assets/icon.png",
        name:"anish"
      },
      {
        id:5,
        imgid:"./../assets/icon.png",
        name:"mani"
      }
    ]
  }
  render(){
    return(
      <View style={styles.container}>
        <View style={styles.topredbox}>
          <Text style={styles.doctortext}>Doctor</Text>
        </View>
        <View style={styles.doctorView}>
        {
          this.state.doctors.map((item,index)=>{
              console.log(item.imgid);
           return (<TouchableOpacity 
          key ={item.id}
          style={styles.doctorsDetails}>
            <Image source={require(item.imgid)}
                    style={styles.images}></Image>
            <Text style={styles.textofDoctors}>{item.name}</Text>
          </TouchableOpacity>
          )})
        }
        </View>
        <View style={styles.bottomredbox}/>
      </View>
    );
  }
}

const styles=StyleSheet.create({
  images:{
      width:"21%",
      height:73,
      alignSelf:"flex-start",
      position:"absolute",
      top:12,
      left:10
  },
  container:
  {
    backgroundColor:"#a9a9a9",
    flex:1,  
  },
  textofDoctors:{
      fontSize:20
  },
  topredbox:{
      backgroundColor:"red",
      width:"100%",
      height:140,
      justifyContent:"center",
      alignItems:"center"
  },
  doctorView:{
      justifyContent:"center",
      alignItems:"center",
      paddingHorizontal:10,
      paddingVertical:10
  },
  doctortext:{
    color:"white",
    fontWeight:"bold",
    fontSize:25
  },
  bottomredbox:{
    backgroundColor:"red",
    width:"100%",
    height:50,
    position:"absolute",
    bottom:0
  },
  doctorsDetails:{
    height:100,
    width:"100%",
    backgroundColor:"white",
    justifyContent:"center",
    alignItems:"center",
    borderColor:"red",
    borderRadius:10,
    borderWidth:1

  }
})