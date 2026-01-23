FROM alpine

WORKDIR /app

RUN echo "layer_2" > layer_2.txt
RUN echo "layer_3" > layer_3.txt
COPY example.txt layer_4.txt

CMD ["cat", "layer_3.txt"]
