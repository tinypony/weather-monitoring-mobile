import React, { PropTypes, Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';

export default class ComparatorToggle extends Component {
    static propTypes = {
      value: PropTypes.oneOf(['smaller', 'larger']),
      onChange: PropTypes.func.isRequired
    };

    handlePress = () => {
      if(this.props.value === 'smaller') {
        this.props.onChange('larger');
      } else if(this.props.value === 'larger') {
        this.props.onChange('smaller');
      }
    }

    displayOperator = () => {
      if(this.props.value === 'smaller') {
        return '<';
      } else if(this.props.value === 'larger') {
        return '>';
      } else {
        return '=';
      }
    }

    render() {
      return <TouchableOpacity activeOpacity={12} onPress={this.handlePress}>
        <Text style={styles.toggle}>{this.displayOperator()}</Text>
      </TouchableOpacity>;
    }
}

const styles = StyleSheet.create({
  toggle: {
    borderColor: '#aeaeae',
    backgroundColor: '#dedede',
    color: '#666',
    borderWidth: 1,
    textAlign: 'center',
    width: 40,
    height: 40,
    padding: 10
  }
});
