# node-hid-ds4-test
Testing Playstation DualShock4 controller with node-hid


Getting data from DS4 is easy, there are many packages that do it.

Sending data to set rumble and LED appears to be hard.
This demo attempts to do that, mostly emulating what is found in
the `hid-sony` driver for Linux:
https://github.com/torvalds/linux/blob/master/drivers/hid/hid-sony.c#L2048

