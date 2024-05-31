import {firestore} from '../config/firebaseConfig'

export const addVerifiedContact = async (userId, contact) => {
  const verifiedContactRef = firestore().collection('verifiedContacts').doc(contact.phoneNumber);
  await verifiedContactRef.set({
    userId,
    name: contact.name,
    phoneNumber: contact.phoneNumber,
  });
};

export const addSuspiciousContact = async (userId, phoneNumber) => {
  const suspiciousContactRef = firestore().collection('suspiciousContacts').doc(phoneNumber);
  const doc = await suspiciousContactRef.get();

  if (doc.exists) {
    const data = doc.data();
    if (!data.reportedBy.includes(userId)) {
      data.reportedBy.push(userId);
      await suspiciousContactRef.update({ reportedBy: data.reportedBy });

      if (data.reportedBy.length >= 5) {
        // Move to scamContacts collection
        await firestore().collection('scamContacts').doc(phoneNumber).set({ phoneNumber });
        await suspiciousContactRef.delete();
      }
    }
  } else {
    await suspiciousContactRef.set({
      phoneNumber,
      reportedBy: [userId],
    });
  }
};
