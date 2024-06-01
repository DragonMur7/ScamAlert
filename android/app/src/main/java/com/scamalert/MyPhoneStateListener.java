package com.scamalert;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;
import android.util.Log;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class MyPhoneStateListener extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getStringExtra(TelephonyManager.EXTRA_STATE).equals(TelephonyManager.EXTRA_STATE_RINGING)) {
            String incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
            Log.d("IncomingCall", "Incoming number: " + incomingNumber);
            
            // Broadcast the incoming number
            Intent numberIntent = new Intent("incoming_number");
            numberIntent.putExtra("number", incomingNumber);
            LocalBroadcastManager.getInstance(context).sendBroadcast(numberIntent);
        }
    }
}