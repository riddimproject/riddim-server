#!/bin/sh

if [ -z "$SOUP_SERVER" ]; then
	echo "No SOUP_SERVER environment variable is set"
	exit 1
fi

while true; do
	gst-launch-1.0 audiotestsrc freq=300 ! audioconvert ! audioresample ! audio/x-raw, format=S8, channels=2, rate=44100, format=F32LE ! souphttpclientsink location="$SOUP_SERVER"
	sleep 5
done
