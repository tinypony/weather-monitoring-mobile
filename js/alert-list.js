import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import _ from 'lodash';
import EntryEditor from './entry-editor';
import AlertListItem from './alert-list-item';


export default class AlertList extends Component {

  static propTypes = {
    cities: PropTypes.array
  };

  static defaultProps = {
    cities: []
  };

  render() {
      return <View style={styles.cityList}>
      {_.map(this.props.cities, city => {
        return <AlertListItem
          key={city.name}
          entry={city}
        />;
      })}
    </View>;
  }
}

const styles = StyleSheet.create({
  cityList: {
    margin: 5
  }
});
