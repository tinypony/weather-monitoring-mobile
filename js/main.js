import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  AsyncStorage
} from 'react-native';
import _ from 'lodash';
import EntryEditor from './entry-editor';
import CityList from './city-list';
import AlertList from './alert-list';
import ConfigView from './config-view';

import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';

const ADDRESS_KEY = 'addressKey';
const PORT_KEY = 'portKey';
const DEFAULT_PORT = 3000;
const emptyCity = {
  name: '',
  threshold: 0,
  direction: 'smaller'
};

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
      edit: null,
      error: null,
      fetchEerror: null,
      config: {
        port: 3000
      }
    }
  }

  setError = error => {
    this.setState({
      error
    });
  };

  setFetchError = fetchError => {
    this.setState({
      fetchError
    });
  };

  resetEdit = () => this.setState({edit: null});

  renderListOrEdit() {
    if(!this._isConfigDefined()) {
      return this.renderPrompt();
    }
    if(_.isNull(this.state.edit)) {
      return <CityList
        onNewClick={() => this.setState({edit: emptyCity})}
        onEditClick={entry => this.setState({edit: entry})}
        onDeleteClick={this.deleteMonitoringSpec}
        cities={this.state.cities}
        isButtonEnabled={this._isConfigDefined()}
      />;
    } else {
      return <EntryEditor
        entry={this.state.edit}
        onChange={this.saveMonitoringSpec}
        onCancel={this.resetEdit}
      />;
    }
  }

  renderAlerts() {
    if(this._isConfigDefined()) {
      const breached = _.filter(this.state.cities, city => city.alert && city.alert.breached);
      return <AlertList cities={breached} />;
    } else {
      return this.renderPrompt();
    }
  }

  renderPrompt() {
    return (<View style={styles.configPrompt}>
      <Text style={styles.configPromptHeader}>Your config is empty</Text>
      <Text style={styles.configPromptContent}>Please go to "Config" tab and configure the address and port number of your server</Text>
    </View>);
  }

  renderError() {
    if(this.state.fetchError) {
      return <Text style={styles.errorMessage}>Error: {this.state.fetchError.message}</Text>;
    }

    if(this.state.error) {
      return <Text style={styles.errorMessage}>Error: {this.state.error.message}</Text>;
    }
  }

  render() {
    return (<ScrollableTabView
      style={styles.scrollableTabView}
      renderTabBar={() => <DefaultTabBar />}>
      <ScrollView tabLabel='Cities'>
        {this.renderError()}
        {this.renderListOrEdit()}
      </ScrollView>
      <ScrollView tabLabel='Alerts'>
        {this.renderError()}
        {this.renderAlerts()}
      </ScrollView>
      <ScrollView tabLabel='Config'>
        <ConfigView onSave={this.saveConfiguration} {...this.state.config} />
      </ScrollView>
    </ScrollableTabView>);
  }

  saveConfiguration = async (address, port) => {
    await AsyncStorage.setItem(ADDRESS_KEY, address);
    await AsyncStorage.setItem(PORT_KEY, port.toString());
    this.setState({
      config: {address, port: Number.parseInt(port)}
    });
  }

  deleteMonitoringSpec = spec => {
    fetch(`${this.baseUrl}/watch/${spec._id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      const {cities} = this.state;
      const index = _.findIndex(cities, {_id: spec._id});
      cities.splice(index, 1);

      this.setState({
        cities
      });
    })
    .catch(error => console.error(error));
  }

  saveMonitoringSpec = spec => {
    if (spec._id) {
      return this.updateMonitoringSpec(spec);
    } else {
      return this.createMonitoringSpec(spec);
    }
  }

  updateMonitoringSpec = spec => {
    fetch(`${this.baseUrl}/watch/${spec._id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spec)
    })
    .then(response => response.json())
    .then(responseJson => {
      const {cities} = this.state;
      const index = _.findIndex(cities, {_id: responseJson._id});
      cities.splice(index, 1, responseJson);

      this.setState({
        cities,
        edit: null
      });
    })
    .catch(error => console.error(error));
  }

  createMonitoringSpec = spec => {
    fetch(`${this.baseUrl}/watch`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spec)
    })
    .then(response => response.json())
    .then(responseJson => {
      const {cities} = this.state;
      const updatedMonitoredCities = _.union([responseJson], cities);
      this.setState({
        cities: updatedMonitoredCities,
        edit: null
      });
    })
    .catch(error => console.error(error));
  }

  get baseUrl() {
    return `http://${this.state.config.address}:${this.state.config.port}`;
  }

  _loadConfiguration = async () => {
    try {
      const address = await AsyncStorage.getItem(ADDRESS_KEY);
      const retrievedPort = await AsyncStorage.getItem(PORT_KEY);
      const port = retrievedPort ? retrievedPort : DEFAULT_PORT;
      return {address, port};
    } catch(e) {
      this.setError(e);
    }
  };

  _isConfigDefined = () => !!this.state.config.address && !!this.state.config.port;

  _checkMonitoredCities = async () => {
    if(!this._isConfigDefined()) {
      return;
    }

    try {
      const response = await fetch(`${this.baseUrl}/watch`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      const responseJson = await response.json();
      return this.setState({
        cities: responseJson,
        fetchError: null
      });
    } catch (error) {
      this.setFetchError(error);
    }
  };

  componentDidMount = async () => {
    const config = await this._loadConfiguration();
    this.setState({config});
    await this._checkMonitoredCities();
    setInterval(this._checkMonitoredCities, 2000);
  };
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    textAlign: 'center'
  },
  configPrompt: {
    margin: 25,
    marginTop: 90
  },
  configPromptHeader: {
    fontSize: 24,
    textAlign: 'center'
  },
  configPromptContent: {
    textAlign: 'center'
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20
  }
});
