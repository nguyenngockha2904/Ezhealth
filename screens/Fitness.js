import React from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { homeStyles } from "../styles/HomeStyles";
import fitness from "../temp/TempFitness";
import FitnessList from "../components/FitnessList";
import colors from "../shared/Colors";
import Loader from "../shared/Loader";

export default class Fitness extends React.Component {
  state = {
    assetsLoaded: false,
    fitness: fitness,
    fitnessCompleted: [],
    records: {},
  };
  componentDidMount() {
    firebaseApp
      .firestore()
      .collection("users")
      .doc(firebaseApp.auth().currentUser.email)
      .collection("features")
      .doc("records")
      .onSnapshot((doc) => {
        this.setState({
          records: {
            BMI: doc.data().BMI,
            completedRounds: doc.data().completedRounds,
            workoutSeconds: doc.data().workoutSeconds,
            burnedCalories: doc.data().burnedCalories,
            wunMedals: doc.data().wunMedals,
          },
          assetsLoaded: true,
        });
      });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  renderFit = (item) => {
    return (
      <FitnessList
        fitness={item}
        navigation={this.props.navigation}
        infomations={this.props.navigation.getParam("infomations", "")}
      />
    );
  };
  render() {
    const { assetsLoaded } = this.state;
    const time = Math.ceil(this.state.records.workoutSeconds / 60);
    if (assetsLoaded) {
      return (
        <View style={styles.container}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
          >
            <View style={styles.header}>
              <View style={styles.maxim}>
                <Text
                  style={[
                    styles.text,
                    { fontSize: 30, paddingTop: 25, letterSpacing: 5 },
                  ]}
                >
                  DAILY FITNESS
                </Text>
              </View>

              {/* 4 Infomations */}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  style={{ width: "100%" }}
                >
                  {/* Left */}
                  <View
                    style={{
                      flex: 1,
                      width: Dimensions.get("window").width / 2,
                    }}
                  >
                    <View style={styles.infoDetail}>
                      <View style={styles.infoIcon}>
                        <FontAwesome5
                          name={"fist-raised"}
                          size={20}
                          color={colors.green}
                        />
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[styles.infoText, { color: colors.green }]}
                      >
                        {this.state.records.completedRounds}
                      </Text>
                      <View style={styles.infoChild}>
                        <Text style={styles.infotextChild}>COMPLETED</Text>
                        <Text style={styles.infotextChild}>ROUNDS</Text>
                      </View>
                    </View>

                    <View style={styles.infoDetail}>
                      <View style={styles.infoIcon}>
                        <MaterialCommunityIcons
                          name={"clock"}
                          size={25}
                          color={colors.blue}
                        />
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[styles.infoText, { color: colors.blue }]}
                      >
                        {time}
                      </Text>
                      <View style={styles.infoChild}>
                        <Text style={styles.infotextChild}>WORKOUT</Text>
                        <Text style={styles.infotextChild}>MINUTES</Text>
                      </View>
                    </View>
                  </View>

                  {/* Right */}
                  <View
                    style={{
                      flex: 1,
                      width: Dimensions.get("window").width / 2,
                    }}
                  >
                    <View style={[styles.infoDetail]}>
                      <View style={styles.infoIcon}>
                        <FontAwesome5
                          name={"fire"}
                          size={20}
                          color={colors.red}
                        />
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[styles.infoText, { color: colors.red }]}
                      >
                        {this.state.records.burnedCalories}
                      </Text>
                      <View style={styles.infoChild}>
                        <Text style={styles.infotextChild}>BURNED</Text>
                        <Text style={styles.infotextChild}>CALORIES</Text>
                      </View>
                    </View>

                    <View style={styles.infoDetail}>
                      <View style={styles.infoIcon}>
                        <FontAwesome5
                          name={"trophy"}
                          size={20}
                          color={colors.orange}
                        />
                      </View>

                      <Text
                        numberOfLines={1}
                        style={[styles.infoText, { color: colors.orange }]}
                      >
                        {this.state.records.wunMedals}
                      </Text>
                      <View style={styles.infoChild}>
                        <Text style={styles.infotextChild}>MEDALS</Text>
                        <Text style={styles.infotextChild}>WUN</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>

              {/*  */}
            </View>
            <View style={styles.body}>
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={[
                    styles.text,
                    {
                      fontSize: 22,
                      paddingVertical: 20,
                      textAlign: "center",
                      color: colors.white,
                      alignSelf: "center",
                    },
                  ]}
                >
                  POPULAR FITNESS
                </Text>
                <FlatList
                  flexDirection={"column"}
                  horizontal={true}
                  style={homeStyles.flatlistBoby}
                  data={this.state.fitness}
                  contentContainerStyle={{
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                  }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => this.renderFit(item)}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return <Loader loading={this.state.loading} />;
    }
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2B2E35",
    width: "100%",
    height: "100%",
  },
  header: {
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    height: 250,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  maxim: {
    marginTop: 20,
    alignItems: "center",
    alignContent: "center",
  },
  text: {
    color: colors.black,
    alignSelf: "flex-start",
    fontFamily: "quicksand-bold",
    letterSpacing: 2,
  },
  infoDetail: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 15,
    paddingTop: 20,
  },
  infoIcon: {
    width: 40,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#3B3A3B",
  },
  infoText: {
    marginLeft: 5,
    fontSize: 35,
    fontFamily: "quicksand-light",
    letterSpacing: 2,
    textAlign: "right",
  },
  infoChild: {
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
  },
  infotextChild: {
    color: "#151515",
    fontSize: 12,
    fontFamily: "quicksand-bold",
    textAlign: "left",
  },
  body: {
    width: "100%",
    justifyContent: "flex-start",
    paddingBottom: 10,
  },
  bodyContent: {
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  imagebutton: {
    borderRadius: 100,
    width: 50,
    height: 50,
    alignSelf: "flex-end",
    marginRight: 30,
  },
});
