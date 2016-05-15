'use strict'
var React = require('react-native');
var { View, Text, Image, TouchableNativeFeedback, Linking } = React;
var Button = require('apsl-react-native-button');
var Icons = require('./resources/icons');

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
          } else {
              console.log('Don\'t know how to open URI: ' + this.props.url);
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
                    <Image style={{width: 96,height: 96,resizeMode: 'stretch'}} source={Icons.logo}/>
                    <View style={{flex:1}}>
                        <Text style={{fontSize: 18,fontWeight: 'bold',marginLeft: 15}}>{'Aw? Boc!'}</Text>
                        <Text style={{fontSize: 14,marginLeft: 15}}>{'Version: ' + this.props.version}</Text>
                        <Text style={{fontSize: 14,marginLeft: 15}}>{'Release: ????'}</Text>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 18}}>{'A no frills meds reminder.'}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 14}}>{'Built with React Native and these helpful modules:'}</Text>
                    <Text style={{fontSize: 12}}>{'react-native-store'}</Text>
                    <Text style={{fontSize: 12}}>{'apsl-react-native-button'}</Text>
                    <Text style={{fontSize: 12}}>{'react-native-audioplayer'}</Text>
                </View>
                <Button onPress={this.props.onClose}>{'Close'}</Button>
            </View>
        );
        /*
        <OpenURLButton label={'react-native'} url={'http://www.reactnative.com/'}/>
        <OpenURLButton label={'react-native-store'} url={'https://github.com/thewei/react-native-store'}/>
        <OpenURLButton label={'apsl-react-native-button'} url={'https://github.com/APSL/react-native-button'}/>
        <OpenURLButton label={'react-native-audioplayer'} url={'https://github.com/andreaskeller/react-native-audioplayer'}/>
        */
    }
});

module.exports = AboutView;
