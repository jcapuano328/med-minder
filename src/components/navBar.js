import React, {PropTypes} from 'react';
import { View, Text, Platform } from 'react-native';
import IconButton from './iconButton';
import Icons from '../res';
let height = {
    ...Platform.select({
      ios: {
        height: 64,
      },
      android: {
        height: 54,
      },
    })
};
let iconWidth = 32, iconHeight = 32;//height.height;

module.exports = (opts) => {

    let NavBar = React.createClass({
        contextTypes: {
            drawer: PropTypes.object,
        },
        styles: {
            header: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: '#EFEFF2',
                paddingTop: 0,
                top: 0,
                height: height.height,
                right: 0,
                left: 0,
                borderBottomWidth: 0.5,
                borderBottomColor: '#828287',
                position: 'absolute'
            },
            menuButton: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            },
            backButton: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            },
            title: {
                flex: 8,
                flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'flex-start'
            },
            rightButton: {
                flex: 2,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginVertical: 10
            }
        },
        render() {
            let state = this.props.navigationState;
            let selected = state.children[state.index];
            while (selected.hasOwnProperty('children')) {
              state = selected;
              selected = selected.children[selected.index];
            }
            const navProps = { ...this.props, ...selected };

            return (
                <View style={[
                    {...this.styles.header, ...opts.style},
                    this.props.navigationBarStyle,
                    state.navigationBarStyle,
                    selected.navigationBarStyle,
                ]}>
                    {this.renderMenuButton(navProps,state)}
                    {this.renderBackButton(navProps,this.props.navigationState)}
                    {this.renderTitle(navProps,state)}
                    {this.renderRightButton(navProps,state)}
                </View>
            )
        },
        renderMenuButton(props,state) {
            return (
                <View style={this.styles.menuButton}>
                    <IconButton image={props.logo || props.menu || Icons['menu-light']} height={iconHeight} width={iconWidth} resizeMode='stretch'
                        onPress={this.context.drawer.toggle} />
                </View>
            );
        },
        renderBackButton(props,state) {
            return (state.index === 0 && (!state.parentIndex || state.parentIndex === 0))
                ? null
                : (
                    <View style={this.styles.backButton}>
                        <IconButton image={Icons['chevron-left']} height={iconHeight} width={iconWidth} resizeMode='stretch' onPress={opts.onBack} />
                    </View>
                );
        },
        renderTitle(props,state) {
            let getText = (text) => {
                if (typeof text == 'function') {
                    return text();
                }
                return text || '';
            }

            return (
                <View style={this.styles.title}>
                    <Text style={{
                          color: props.textcolor || 'black',
                          fontSize: 22,
                          fontWeight: 'bold',
                          //marginLeft: 10,
                          //marginVertical: 10,
                          //color: 'blue'
                        }}>
                      {getText(props.title)}
                    </Text>
                    {props.subtitle
                        ? <Text style={{
                              color: props.textcolor || 'black',
                              fontSize: 14,
                              //marginLeft: 10,
                              //marginVertical: 10,
                              //color: 'blue'
                            }}>
                            {getText(props.subtitle)}
                          </Text>
                        : null
                    }
                </View>
            );
        },
        renderRightButton(props,state) {
            let getImage = (image) => {
                if (typeof image == 'string') {
                    return Icons[image];
                }
                return image;
            }
            return (
                <View style={this.styles.rightButton}>
                    {(opts.rightButtons || []).map((b,i) => {
                        return (
                            <IconButton key={i} image={getImage(b.image)} height={b.height || iconHeight} width={b.width || iconWidth} onPress={b.onPress} />
                        )
                    })}
                </View>
            );
        }
    });

    return NavBar;
};
