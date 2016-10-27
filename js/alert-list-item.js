import React, { PropTypes, Component } from 'react';
import { Card } from 'react-native-material-design';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import _ from 'lodash';
import ComparatorToggle from './entry-editor/comparator-toggle';
import moment from 'moment';

export default class AlertListItem extends Component {
  static propTypes = {
    entry: PropTypes.shape({
      _id: PropTypes.string,
      owner: PropTypes.string,
      name: PropTypes.string.isRequired,
      threshold: PropTypes.number.isRequired,
      direction: PropTypes.oneOf(['larger', 'smaller']).isRequired,
      alert: PropTypes.shape({
        breached: PropTypes.bool.isRequired,
        temp: PropTypes.number,
        time: PropTypes.number,
        timeTxt: PropTypes.string
      })
    })
  };

  get thresholdText() {
    const {name, direction, threshold, alert} = this.props.entry;
    const comparisonOperator = direction === 'larger' ? 'over' : 'below';
    const dateString = moment.unix(alert.time).format('MMMM Do YYYY, hh:mm');
    return `Temperature goes ${comparisonOperator} ${threshold} \xB0C on ${dateString}`;
  }

  get summary() {
    const {name, alert} = this.props.entry;
    return `${name}: ${alert.temp} \xB0C`;
  }

  render() {
    return (
      <Card style={styles.wrapper}>
        <Text style={styles.summary}>{this.summary}</Text>
        <Text style={styles.name}>{this.thresholdText}</Text>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    padding: 25
  },
  summary: {
    fontSize: 16
  },
  name: {
    borderWidth: 0,
    fontSize: 16
  }
});
