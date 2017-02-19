//
// node-hid-ds4-test.js -- Demonstrate using node-hid to receive data
//                         from DualShock4 DS4 controlller and
//                         send rumble and LED to controller
//
// Note: DS4 controller stops emitting Input Report #1
//       events after Output Report is sent.  
//
// 2017 - Tod E. Kurt / todbot.com 
//

var crc = require('crc');

var HID = require('node-hid');

var device = new HID.HID(1356, 1476);

var rumbleL = 0;
var rumbleR = 0;
var ledR = 255;
var ledG = 0;
var ledB = 255;



//
// Set rumble and LED
// stolen from:
// https://github.com/torvalds/linux/blob/master/drivers/hid/hid-sony.c#L2048
//
function setRumbleLed(rumbleL, rumbleR, ledR,ledG,ledB)
{

    var buf = Array(78-4).fill(0); // 4 bytes short for CRC32 calc below
    buf[0]  = 0x11; // reportId
    buf[1]  = 0x80;
    buf[3]  = 0x0f;
    buf[6]  = rumbleL;
    buf[7]  = rumbleR;
    buf[8]  = ledR;
    buf[9]  = ledG;
    buf[10] = ledB;
    
    // calculate crc32, add those 4 bytes to end of buf array
    var tmpbuf = buf.slice(0); // clone
    tmpbuf.unshift( 0xA2 ); // add bluetooth header byte for crc32
    var crc32 = crc.crc32( tmpbuf );
    buf[74] = (crc32 & 0x000000ff) >> 0;
    buf[75] = (crc32 & 0x0000ff00) >> 8;
    buf[76] = (crc32 & 0x00ff0000) >> 16;
    buf[77] = (crc32 & 0xff000000) >> 24;
    // end crc32 calc
    
    console.log("outbuf:","len:",buf.length, "vals:",buf.join(','));
    device.write(buf);

}

// send an update to change rumble & LED ever 500 msec
var updateController = function() {
    setRumbleLed( rumbleL, rumbleR, ledR, ledG, ledB);
    ledR += 50; // make up some random colors for next time
    ledG += 40;
    ledG += 90;
    setTimeout( updateController, 500);
}

setTimeout( updateController, 1500 );


var getControllerData = function( data ) {
    console.log('got ds4 data', data);
    // data[5] contains square button state at 0x10 bit
    if( (data[5] & 0x10) ) { // square pressed!
        console.log("square pressed!");
        rumbleL = 255;
    }
    else {
        rumbleL = 0; 
    }
};

device.on('data', getControllerData);
          
console.log("press Square to turn on rumble");
