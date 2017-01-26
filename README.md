# med-minder
React Native med reminder app

## Refactor for Redux and Router

https://github.com/aksonov/react-native-router-flux

https://medium.com/differential/react-native-basics-using-react-native-router-flux-f11e5128aff9#.oa459pk4n

https://github.com/root-two/react-native-drawer


### Forget the typeahead idea
Navigate to a "simple" search form that auto-fills based on the entered criteria
ala adding a contact to a text message

### Medication names are retrieved from RxNav:
[RxNav] (https://rxnav.nlm.nih.gov/PrescribableAPIs.html)

##### system notification: firebase build error
https://github.com/Neson/react-native-system-notification/issues/69

solved by adding:

	compile 'com.google.firebase:firebase-messaging:9.0.1'
    compile 'com.google.android.gms:play-services-gcm:9.0.1'

into "project/node_modules/react-native-system-notification/android/build.gradle"
after adding as i was getting another Multi-dex related issue, I had to enable multi-dex and app runs without error.


## Resources
- [normalizr](https://github.com/paularmstrong/normalizr)
- [denormalizr](https://github.com/gpbl/denormalizr)
- [Using Normalizr in a Redux Store](https://medium.com/@mcowpercoles/using-normalizr-js-in-a-redux-store-96ab33991369#.7m9jtzfu4)
- [State Management in Redux](https://github.com/reactjs/redux/issues/994)
- [Redux-ORM : a "bigger" approach to normalization](https://github.com/tommikaikkonen/redux-orm)
- [Jest : you know, for testing](https://facebook.github.io/jest/)
