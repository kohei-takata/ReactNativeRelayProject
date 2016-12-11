/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    View,
    Text,
    ListView
} from 'react-native';
import Relay, {
    Route,
    RootContainer,
    DefaultNetworkLayer
} from 'react-relay';

Relay.injectNetworkLayer(new DefaultNetworkLayer('http://localhost:3000/graphql'));

class Tea extends Component {
    render() {
        var {name, steepingTime} = this.props.tea;
        return (
            <Text key={name}>
                {name} ({steepingTime} min)
            </Text>
        );
    }
}
Tea = Relay.createContainer(Tea, {
    fragments: {
        tea: () => Relay.QL`
            fragment on Tea {
                name,
                steepingTime,
            }
        `,
    },
});

class TeaStore extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(props.store.teas)
        }
    }

    render() {
        return (
            <ListView
                style={{ marginTop: 20 }}
                dataSource={this.state.dataSource}
                renderRow={tea => <Tea tea={tea}/>}
            />
        );

    }
}
App = Relay.createContainer(TeaStore, {
    fragments: {
        store: () => Relay.QL`
            fragment on Store {
                teas { ${Tea.getFragment('tea')} },
            }
        `,
    },
});

class AppHomeRoute extends Relay.Route {
    static routeName = 'Home';
    static queries = {
        store: (Component) => Relay.QL`
            query TeaStoreQuery {
                store { ${Component.getFragment('store')} },
            }
        `,
    };
}

export default class ReactNativeRelayProject extends Component {
    render() {
        return (
            <Relay.RootContainer
                Component={App}
                route={new AppHomeRoute()}
            />
        );
    }
}

AppRegistry.registerComponent('ReactNativeRelayProject', () => ReactNativeRelayProject);
