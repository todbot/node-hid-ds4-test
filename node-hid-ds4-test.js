//
// node-hid-ds4-test.js -- Use node-hid to receive movement events
//                         from DualShock4 DS4 controlller and
//                         send rumble and LED to controller
//
//

var crc = require('crc');

var HID = require('node-hid');

var device = new HID.HID(1356, 1476);

//var tmpbuf = device.getFeatureReport(0x02, 37);

//
// Set rumble and LED
// stolen from:
// https://github.com/torvalds/linux/blob/master/drivers/hid/hid-sony.c#L2048
//
function setRumbleLed(rumbleL, rumbleR, ledR,ledG,ledB)
{
    var buf = [
        0x11, // reportId
        0xc0, 0, 0x0f,  0,  0,  rumbleL,  rumbleR, ledR, ledG, ledB,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0 ]; // note: buf is 4-bytes short, for crc32
    
    // calculate crc32, add those 4 bytes to end of buf array
    var tmpbuf = buf.slice(0); // clone
    tmpbuf.unshift( 0xA2 ); // add bluetooth header byte for crc32
    var crc32 = crc.crc32( tmpbuf );
    buf[74] = (crc32 & 0x000000ff) >> 0;
    buf[75] = (crc32 & 0x0000ff00) >> 8;
    buf[76] = (crc32 & 0x00ff0000) >> 16;
    buf[77] = (crc32 & 0xff000000) >> 24;
    // end crc32 calc
    
    console.log("buf:","len:",buf.length, "vals:",buf.join(','));
    device.write(buf);
}

device.gotData = function (err, data) {
    console.log('got ds4 data', data);
    // data[5] contains square button state at 0x10 bit
    if( (data[5] & 0x10) ) { 
        console.log("square pressed!");
        setRumbleLed(120,120, 255,0,255); // half rumbles + purple
        console.log("rumble done");
    }
    this.read(this.gotData.bind(this));
};

device.read(device.gotData.bind(device));

console.log("press Square to turn on rumble");
