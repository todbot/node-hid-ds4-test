# node-hid-ds4-test
Testing Playstation DualShock4 controller with node-hid


Getting data from DS4 is easy, there are many packages that do it.

Sending data to set rumble and LED appears to be hard.
This demo attempts to do that, mostly emulating what is found in
the `hid-sony` driver for Linux:
https://github.com/torvalds/linux/blob/master/drivers/hid/hid-sony.c#L2048

To try it out:

1. Pair your DS4 controller with your computer
2. Check out this repo
3. `npm install`
4. `npm start`
5. Press Square button to start rumbling


Issues:
- Currently the controller stops responding after sending rumble command
