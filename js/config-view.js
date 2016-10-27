import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput
} from 'react-native';
import _ from 'lodash';
import { Card } from 'react-native-material-design';


export default class ConfigView extends Component {

  static propTypes = {
    onSave: PropTypes.func,
    address: PropTypes.string,
    port: PropTypes.number
  };

  static defaultProps = {
    cities: []
  };

  constructor(props) {
    super(props);
    const {address, port} = props;
    this.state = {
      address,
      port
    };
  }

  getChangeHandler = field => value => this.setState(_.assign({}, this.state, {[field]: value}));

  render() {
    return <Card><View style={styles.wrapper}>
      <Text style={styles.title}>Server configuration</Text>
      <TextInput
        style={styles.addressInput}
        onChangeText={this.getChangeHandler('address')}
        placeholder="IP address or FQDN"
        value={this.state.address}
      />
      <TextInput
        style={styles.portInput}
        onChangeText={this.getChangeHandler('port')}
        placeholder="Port number"
        keyboardType="numeric"
        value={'' + this.state.port}
      />
      <TouchableHighlight
        style={styles.buttonWrapper}
        onPress={() => this.props.onSave(this.state.address, this.state.port)}>
        <Text style={styles.saveButton}>Save</Text>
      </TouchableHighlight>
    </View></Card>;
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20
  },
  wrapper: {
    margin: 10,
    marginBottom: 20
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
