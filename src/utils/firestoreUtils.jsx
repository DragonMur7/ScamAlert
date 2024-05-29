import {firestore} from '../config/firebaseConfig'

// Function to add verified contacts to Firestore
export const addVerifiedContact = async (userId, contact) => {
    try {
        await firestore().collection('verifiedContacts').doc(contact.phoneNumber).set({
            name: contact.name || '',
            phoneNumber: contact.phoneNumber,
            status: 'safe',
            addedBy: userId,
        });
        console.log('Contact added successfully');
    } catch (error) {
        console.error('Error adding contact:', error);
    }
};

// Function to add suspicious contacts to Firestore
export const addSuspiciousContact = async (userId, phoneNumber) => {
    try {
        await firestore().collection('suspiciousContacts').doc(phoneNumber).set({
            phoneNumber: phoneNumber,
            reportedBy: userId,
            status: 'suspicious',
        });
        console.log('Contact marked as suspicious');
    } catch (error) {
        console.error('Error marking contact as suspicious:', error);
    }
};

// Function to check if a number is in verified or suspicious contacts
export const checkIncomingCall = async (phoneNumber) => {
    try {
        const verifiedDoc = await firestore().collection('verifiedContacts').doc(phoneNumber).get();
        const suspiciousDoc = await firestore().collection('suspiciousContacts').doc(phoneNumber).get();

        if (verifiedDoc.exists) {
            return { status: 'safe', contact: verifiedDoc.data() };
        } else if (suspiciousDoc.exists) {
            return { status: 'suspicious', contact: suspiciousDoc.data() };
        } else {
            return { status: 'unknown' };
        }
    } catch (error) {
        console.error('Error checking incoming call:', error);
        return { status: 'error', error: error };
    }
};