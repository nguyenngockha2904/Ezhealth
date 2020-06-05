import React, { Component } from 'react';
import * as Font from 'expo-font';
import Navigator from './routes/AppStack';
import Loader from './shared/Loader';

export default class App extends Component {
  state = {
    assetsLoaded: false,
    loading: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'quicksand-regular': require('./assets/fonts/Quicksand-Regular.ttf'),
      'quicksand-bold': require('./assets/fonts/Quicksand-Bold.ttf'),
      'quicksand-light': require('./assets/fonts/Quicksand-Light.ttf'),
      'quicksand-medium': require('./assets/fonts/Quicksand-Medium.ttf'),
      'quicksand-semibold': require('./assets/fonts/Quicksand-SemiBold.ttf'),
    });
    this.setState({ assetsLoaded: true });
  }
  render() {
    const { assetsLoaded } = this.state;

    if (assetsLoaded) {
      return (
        <Navigator />
      );
    }
    else {
      return (
        <Loader
          loading={this.state.loading} />
      );
    }
  }
}