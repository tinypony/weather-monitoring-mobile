import React, { PropTypes, Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput
} from 'react-native';
import _ from 'lodash';
import ComparatorToggle from './entry-editor/comparator-toggle';

export default class EntryEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    entry: PropTypes.shape({
      _id: PropTypes.string,
      owner: PropTypes.string,
      name: PropTypes.string.isRequired,
      threshold: PropTypes.number.isRequired,
      direction: PropTypes.oneOf(['larger', 'smaller']).isRequired
    })
  };

  constructor(props) {
    super(props);
    const {entry} = props;
    this.state = {};

    if(entry) {
      this.state.entry = entry;
    }
  }

  getChangeHandler(field) {
    return value => {
      const entry = _.assign({}, this.state.entry, {[field]: value});
      this.setState({entry});

      if(entry.name && entry.threshold && entry.direction) {
        this.props.onChange && this.props.onChange(entry);
      }
    };
  }

  render() {
    if(!this.state.entry) {
      return <Text/>;
    } else {
      return <View style={styles.editorWrapper}>
        <TextInput
          style={styles.cityInput}
          onChangeText={this.getChangeHandler('name')}
          value={this.state.entry.name}
        />
        <ComparatorToggle
          onChange={this.getChangeHandler('direction')}
          value={this.state.entry.direction}
        />
        <TextInput
          style={styles.thresholdInput}
          onChangeText={this.getChangeHandler('threshold')}
          keyboardType="numeric"
          maxLength={5}
          value={'' + this.state.entry.threshold}
        />
      </View>;
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.entry && nextProps.entry) {
      this.setState({
        entry: nextProps.entry
      });
    }
  }
}

const styles = StyleSheet.create({
  editorWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 25
  },
  cityInput: {
    height: 40,
    flex: 20,
    borderWidth: 0
  },
  thresholdInput: {
    height: 40,
    flex: 10,
    borderWidth: 0
  }
});
