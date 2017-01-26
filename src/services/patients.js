import {Repository} from 'react-native-nub';
let collection = Repository('medminder.patients');
let orderby = ['status','name'];

module.exports = {
    getAll() {
        return collection.select(null, orderby);
    },
    getActive() {
        return collection.select({status: 'active'}, orderby);
    },
    get(id) {
        return collection.select({id: id}, orderby)
        .then((data) => {
            if (data && data.length > 0) {
                return data[0];
            }
            return data;
        });
    },
    add(patient) {        
        return this.getAll()
        .then((patients) => {
            let idx = patients.findIndex((p) => p.id == patient.id);
            if (idx < 0) {
                patients.push(patient);
                return collection.save(patients);
            }            
        });
    },
    update(patient) {        
        return this.getAll()
        .then((patients) => {
            let idx = patients.findIndex((p) => p.id == patient.id);
            if (idx > -1) {
                patients[idx] = patient;
                return collection.save(patients);
            }
        });
    },    
    remove(patient) {
        if (patient.id) {
            return this.getAll()
            .then((patients) => {
                let idx = patients.findIndex((p) => p.id == patient.id);
                if (idx > -1) {
                    patients.splice(idx,1);
                    return collection.save(patients);
                }
            });
        }
        return new Promise((accept,reject) => accept());
    },
    removeAll() {
        return collection.remove();
    },
    sort(a) {
        return a.sort(collection.sorter(orderby));
    }
};
