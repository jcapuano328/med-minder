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


##### sandboxed-module require react-native dependencies
must have an "main" entry in the modules' package.json file that includes a default js file
