'use strict'
//https://rxnav.nlm.nih.gov/PrescribableAPIs.html#
let rxnavSearchURL = 'https://rxnav.nlm.nih.gov/REST/Prescribe/approximateTerm.json?term={0}&maxEntries=10'
let rxnavPropertiesURL = 'https://rxnav.nlm.nih.gov/REST/Prescribe/rxcui/{0}/properties.json'

let getMeds = (ids, i, meds) => {
    if (i < ids.length) {
        let id = ids[i++];
        let url = rxnavPropertiesURL.replace('{0}', id);
        //console.log('Search rxnav for ' + id + ' @ ' + url);
        return fetch(url)
        .then((response) => response.json())
        .then((result) => {
            //console.log(result);
            if (result && result.properties && result.properties.name) {
                //console.log('   ' + result.properties.name);
                meds.push(result.properties.name);
            }
            return getMeds(ids, i, meds);
        });
    }
    return new Promise((a,r) => a(meds));
}

module.exports = {
    find(name) {
        let url = rxnavSearchURL.replace('{0}', name);
        //console.log('Search rxnav for ' + name + ' @ ' + url);
        return fetch(url)
        .then((response) => response.json())
        .then((result) => {
            let ids = [];
            result.approximateGroup.candidate.forEach((c) => {
                if (ids.length <= 11 && ids.indexOf(c.rxcui) < 0) {
                    ids.push(c.rxcui);
                }
            });
            //console.log(ids);
            return getMeds(ids, 0, []);
        });
    }
};
