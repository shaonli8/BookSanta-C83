import React, { Component } from 'react';
import { Text , View , TouchableOpacity ,FlatList, TextInput, StyleSheet, KeyboardAvoidingView , Alert,Image } from 'react-native';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from "../config";
import MyHeader from '../components/MyHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { dodgerblue } from 'color-name';
import MyHeader from '../components/MyHeader';

export default class RecieverDetailsScreen extends Component{
    constructor(props){
        super(props)
        this.state={
            userId:firebase.auth().currentUser.email,
            recieverId:this.props.navigation.getParam("details")["userId"],
            requestId:this.props.navigation.getParam("details")["request_Id"],
            bookName:this.props.navigation.getParam("details")["bookName"],
            reasonToRequest:this.props.navigation.getParam("details")["reasonToRequest"],
            recieverName:"",
            recieverContact:"",
            recieverAddress:"",
            recieverRequestDocId:""
        }
    }

    getRecieverDetail=()=>{
        db.collection("users").where("emaild","==",this.state.recieverId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    recieverName:doc.data().firstName,
                    recieverContact:doc.data().phoneNumber,
                    recieverAddress:doc.data().address
                })
            })
        })
        db.collection("users").where("requestId" ,"==",this.state.requestId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    recieverRequestDocId:doc.id
                })
            })
        })
    }

    updateBookStatus=()=>{
        db.collection("allDonations").add({
            bookName:this.state.bookName,
            requestId:this.state.requestId,
            requestedBy:this.state.recieverName,
            donorId:this.state.userId,
            requestStatus:"DONOR ACCEPTED YOUR REQUEST"
        })
    }

    addNotification=()=>{
       var message=this.state.userName+" HAS SHOWN INTEREST IN DONATING THE BOOK TO YOU"
       db.collection("allNotifications").add({
        "targeted_user_id" : this.state.recieverId,
        "donor_id" : this.state.userId,
        "request_id" : this.state.requestId,
        "book_name" : this.state.bookName,
        "date" : firebase.firestore.FieldValue.serverTimestamp(),
        "notification_status" : "unread",
        "message" : message
       })
    }

    componentDidMount(){
        this.getRecieverDetail()
    }

    render() {
        var {
          recieverId,
          userId,
          bookName,
          reasonToRequesting,
          recieverName,
          recieverContact,
          recieverAddress
        } = this.state;
    
        var bookInfoList = [
          { type: "Name", value: recieverName },
          { type: "Contact", value: recieverContact }
        ];
    
        var recieverInfoList = [
          { type: "Name", value: bookName },
          { type: "Reason", value: reasonToRequesting }
        ];
    
        return (
          <View style={styles.container}>
            {/* Before writing MyHeader code pass props in MyHeader */}
            <MyHeader
              navigation={this.props.navigation}
              title={"Donate Books"}
              leftComponent={
                <Icon
                  name={"arrow-left"}
                  type={"feather"}
                  color={"#696969"}
                  onPress={() => this.props.navigation.goBack()}
                />
              }
            />
            <View style={styles.upperContainer}>
              <Card title={"Book Information"} titleStyle={styles.cardTitle}>
                {bookInfoList.map((item, index) => (
                  <Card key={`book-card-${index}`}>
                    <Text
                      key={`book-card-value-${index}`}
                      style={{ fontWeight: "bold" }}
                    >
                      {item.type}: {item.value}
                    </Text>
                  </Card>
                ))}
              </Card>
            </View>
            <View style={styles.middleContainer}>
              <Card title={"Reciever Information"} titleStyle={styles.cardTitle}>
                {recieverInfoList.map((item, index) => (
                  <Card key={`receiver-card-${index}`}>
                    <Text
                      key={`receiver-card-value-${index}`}
                      style={{ fontWeight: "bold" }}
                    >
                      {item.type}: {item.value}
                    </Text>
                  </Card>
                ))}
              </Card>
            </View>
            <View style={styles.lowerContainer}>
              {recieverId !== userId ? (
                <CustomButton
                  title={"I want to Donate"}
                  style={styles.button}
                  onPress={() => {
                    this.updateBookStatus();
                    this.addNotification();
                    this.props.navigation.navigate("MyDonations")
                  }}
                  titleStyle={styles.buttonText}
                />
              ) : null}
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    upperContainer: {
      flex: 0.3
    },
    middleContainer: {
      flex: 0.3
    },
    cardTitle: {
      fontSize: 20
    },
    lowerContainer: {
      flex: 0.3,
      justifyContent: "center",
      alignItems: "center"
    },
    button: {
      width: 200,
      height: 50,
      borderRadius: 10
    },
    buttonText: {
      fontWeight: "300"
    }
  });