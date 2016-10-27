import React, { PropTypes, Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  BackAndroid
} from 'react-native';
import _ from 'lodash';
import ComparatorToggle from './entry-editor/comparator-toggle';

class EntryEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
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
    this.state = {entry};
  }

  handleHardwareBackPress() {
    this.props.onCancel();
    return true;
  }

  getChangeHandler(field) {
    return value => {
      const entry = _.assign({}, this.state.entry, {[field]: value});
      this.setState({entry});
    };
  }

  render() {
    return <View style={styles.editorWrapper}>
      <TextInput
        style={styles.cityInput}
        onChangeText={this.getChangeHandler('name')}
        placeholder="City name"
        value={this.state.entry.name}
      />
      <View style={styles.temperatureLine}>
        <Text style={styles.temperatureLabel}>Temp</Text>
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
        <Text style={styles.temperatureLabel}>{'\xB0 C'}</Text>
      </View>
      <TouchableHighlight style={styles.buttonWrapper} onPress={() => this.props.onChange(this.state.entry)}>
        <Text style={styles.saveButton}>Save</Text>
      </TouchableHighlight>
    </View>;
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
        this.props.onCancel();
        return true;
    });
  }
}

const styles = StyleSheet.create({
  editorWrapper: {
    marginBottom: 25,
    marginTop: 25,
    padding: 25
  },
  temperatureLine: {
    flex: 1,
    alignItems: 'center',
    height: 40,
    flexDirection: 'row',
    marginTop: 20
  },
  temperatureLabel: {
    fontSize: 20,
    marginRight: 25
  },
  cityInput: {
    height: 50,
    borderWidth: 0,
    fontSize: 20
  },
  thresholdInput: {
    height: 40,
    flex: 10,
    marginLeft: 25,
    borderWidth: 0
  },
  buttonWrapper: {
    marginTop: 35
  },
  saveButton: {
    fontSize: 20,
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#96ceb4',
    color: '#ffffff'
  }
});

export default EntryEditor;
