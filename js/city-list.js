import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import _ from 'lodash';
import EntryEditor from './entry-editor';
import CityListItem from './city-list-item';


export default class CityList extends Component {

  static propTypes = {
    cities: PropTypes.array,
    onNewClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    isButtonEnabled: PropTypes.bool.isRequired
  };

  static defaultProps = {
    cities: []
  };

  render() {
    return <View>
      <TouchableHighlight style={styles.buttonWrapper} onPress={this.props.isButtonEnabled ? this.props.onNewClick : () => {}}>
        <Text style={styles.newButton}>Add new city</Text>
      </TouchableHighlight>
      <View style={styles.cityList}>
        {_.map(this.props.cities, city => {
          return <CityListItem
            key={city.name}
            entry={city}
            onDeleteClick={this.props.onDeleteClick}
            onClick={this.props.onEditClick}
          />;
        })}
      </View>
    </View>;
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    textAlign: 'center'
  },
  buttonWrapper: {
    margin: 12
  },
  newButton: {
    fontSize: 20,
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#96ceb4',
    color: '#ffffff'
  },
  newButtonDisabled: {
    fontSize: 20,
    margin: 25,
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#cecece',
    color: '#f9f9f9'
  },
  cityList: {
    margin: 5
  }
});
