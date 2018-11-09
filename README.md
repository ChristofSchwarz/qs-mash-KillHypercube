# qs-mash-KillHypercube

A Qlik Sense mashup Example to close hypercubes no longer used. This is the mashup shown in the Youtube videos in the Qlik OEM Channel: 
https://youtu.be/-w-d1Am2cjY and https://youtu.be/2scb0r9bug8

The important take-away is that a single-page mashup is often not taking care of closing ("killing") a hypercube at the Qlik engine side when it is no longer shown. The engine, however, still keeps it open. 

This example puts all objects which are created into an array, and when the user navigates to a different page, the objects from that array are closed before the next ones are instanciated.

PS This example uses the Qlik Sense Visualization API to bind an object to a div-tag, not app.getObject()


