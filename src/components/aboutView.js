'use strict'
var React = require('react');
import { View, Text, Image, TouchableNativeFeedback, Linking } from 'react-native';
var Button = require('apsl-react-native-button');

var OpenURLButton = React.createClass({
  propTypes: {
      label: React.PropTypes.string,
      url: React.PropTypes.string
  },
  handleClick: function() {
      Linking.canOpenURL(this.props.url)
      .then(supported => {
          if (supported) {
              Linking.openURL(this.props.url);
          }
      });
  },
  render: function() {
      return (
        <TouchableNativeFeedback onPress={this.handleClick}>
            <View style={{padding: 10,backgroundColor: '#3B5998',marginBottom: 10}}>
                <Text style={{color: 'white'}}>{this.props.label}</Text>
            </View>
        </TouchableNativeFeedback>
    );
  }
});

var AboutView = React.createClass({
    getInitialState() {
        return {
        };
    },
    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                //height: 100,
                //width: 100,
                //backgroundColor: '#ffffff',
                //opacity: 0.25,
                borderRadius: 10,
                borderColor: 'black',
                borderWidth: 5,
                margin: 50,
                paddingLeft: 25,
                paddingRight: 25,
                paddingBottom: 25,
                paddingTop: 25
            }}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{width: 96,height: 96,resizeMode: 'stretch'}} source={this.props.logo}/>
                    <View style={{flex:1}}>
                        <Text style={{fontSize: 18,fontWeight: 'bold',marginLeft: 15}}>{this.props.title}</Text>
                        <Text style={{fontSize: 14,marginLeft: 15}}>{'Version: ' + this.props.version}</Text>
                        <Text style={{fontSize: 14,marginLeft: 15}}>{'Release: ' + this.props.releasedate}</Text>
                    </View>
                </View>
                <View style={{flex: .75}}>
                    <Text style={{fontSize: 18}}>{this.props.description}</Text>
                </View>
                {this.props.credit
                    ? <View style={{flex: 1}}>
                        <Text style={{fontSize: 18}}>{this.props.credit.description}</Text>
                        {this.props.credit.links.map((c,i) =>
                            <OpenURLButton key={i} label={c.label} url={c.url} />
                        )}
                    </View>
                    : null
                }
                {this.props.additionalinfo
                    ? <View style={{flex: 1}}>
                        <Text style={{fontSize: 18}}>{this.props.additionalinfo.description}</Text>
                        {this.props.additionalinfo.links.map((c,i) =>
                            <OpenURLButton key={i} label={c.label} url={c.url} />
                        )}
                    </View>
                    : null
                }
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 14}}>{'Built with React Native and these helpful modules:'}</Text>
                    {this.props.dependencies.map((d,i) =>
                        <Text key={i} style={{fontSize: 12}}>{d.description}</Text>
                        //{/*<OpenURLButton label={d.description} url={d.url}/>*/}
                    )}
                </View>
                <Button onPress={this.props.onClose}>{'Close'}</Button>
            </View>
        );
    }
});

module.exports = AboutView;
