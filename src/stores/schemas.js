import { Schema, arrayOf } from 'normalizr';
/*
    patients: [
        {
            id: string,
            name: string,
            dob: string/datetime,
            meds: [
                id: string,
                name: string,
                dosage: string,
                instructions: string,
                schedule: {
                    frequency: string, //Daily,Alternating Days,Weekly,Alternating Weeks,Monthly
                    dow: string, //Today,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday
                    tod: {
                        morning: bool,
                        noon: bool,
                        evening: bool,
                        bedtime: bool
                    }
                },
                status: string,
                created: datetime,
                modified: datetime                
            ],
            status: string,
            created: datetime,
            modified: datetime
        }
    ]

*/

const Patient = new Schema('patients');
const Medication = new Schema('medications');
const Patients = arrayOf(Patient);
const Medications = arrayOf(Medication);
Patient.define({
    meds: Medications
});

export { Patient, Patients, Medication, Medications };
