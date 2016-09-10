# med-minder
React Native med reminder app

### Medication names are retrieved from RxNav:
[RxNav] (https://rxnav.nlm.nih.gov/PrescribableAPIs.html)

##### system notification: firebase build error
https://github.com/Neson/react-native-system-notification/issues/69

solved by adding:

	compile 'com.google.firebase:firebase-messaging:9.0.1'
    compile 'com.google.android.gms:play-services-gcm:9.0.1'

into "project/node_modules/react-native-system-notification/android/build.gradle"
after adding as i was getting another Multi-dex related issue, I had to enable multi-dex and app runs without error.


##### multidex (though it worked without this)

android {
    compileSdkVersion 23
    buildToolsVersion "23.0.1"

    defaultConfig {
        minSdkVersion 16
        targetSdkVersion 22
        versionCode 1
        versionName "1.0"
        ndk {
            abiFilters "armeabi-v7a", "x86"
        }
		// Enabling multidex support.
        multiDexEnabled true		
    }
}
