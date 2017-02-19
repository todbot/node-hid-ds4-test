# node-hid-ds4-test
Testing Playstation DualShock4 controller with node-hid


Getting data from DS4 is easy, there are many packages that do it.

Sending data to set rumble and LED via BT appears to be harder than on USB.
Mostly this seems to be because you need to add CRC32 calc.

This project demo attempts to do that, mostly emulating what is found in
the `hid-sony` driver for Linux:
https://github.com/torvalds/linux/blob/master/drivers/hid/hid-sony.c#L2048

To try it out:

1. Pair your DS4 controller with your computer
2. Check out this repo
3. `npm install`
4. `npm start`
5. Watch controller data
6. Watch pretty colors change on controller


Issues:
- Once the controller is updated with an Output Report to update LED & rumble,
it stops streaming Input Reports for reportId 1.  Unclear how to re-enable.
This is not a bug in node-hid, as you can kill & restart the program without
resetting the controller and the program will continue to update the LED.


