import React, { PropTypes, Component } from 'react';
import { Card, Button } from 'react-native-material-design';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import _ from 'lodash';
import ComparatorToggle from './entry-editor/comparator-toggle';

export default class CityListItem extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    entry: PropTypes.shape({
      _id: PropTypes.string,
      owner: PropTypes.string,
      name: PropTypes.string.isRequired,
      threshold: PropTypes.number.isRequired,
      direction: PropTypes.oneOf(['larger', 'smaller']).isRequired
    })
  };

  get thresholdText() {
    const {direction, threshold} = this.props.entry;
    const comparisonOperator = direction === 'larger' ? '>' : '<';
    return `T ${comparisonOperator} ${threshold} \xB0C`;
  }


  render() {
    const {onClick, onDeleteClick, entry} = this.props;
    return (
      <Card>
        <TouchableHighlight underlayColor="#eee" onPress={() => onClick(entry)}>
          <View style={styles.editorWrapper}>
            <Text style={styles.name}>{entry.name}</Text>
            <Text style={styles.threshold}>{this.thresholdText}</Text>
            <TouchableHighlight  underlayColor="#eee" onPress={() => onDeleteClick(entry)}>
              <Text style={styles.deleteButton}>x</Text>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  editorWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    flex: 15,
    borderWidth: 0,
    fontSize: 20
  },
  threshold: {
    flex: 10,
    borderWidth: 0,
    fontSize: 16,
    marginRight: 10
  },
  deleteButton: {
    width: 45,
    height: 50,
    padding: 12,
    textAlign: 'center',
    fontSize: 18
  }
});
