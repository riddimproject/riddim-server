FROM alpine:3.14.2

RUN apk --no-cache add gstreamer gstreamer-tools gst-plugins-good \
	&& mkdir /app
WORKDIR /app

COPY main.sh .
CMD ["./main.sh"]
