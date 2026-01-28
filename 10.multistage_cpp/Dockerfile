FROM gcc:15.2 AS builder

WORKDIR /app

COPY main.cpp .

RUN g++ -static -O3 -o main main.cpp


FROM alpine:3.23

LABEL maintainer="silver.itstep@gmail.com"
LABEL description="Simple C++ application"

WORKDIR /app

COPY --from=builder /app/main .

RUN chmod +x main

CMD ["./main"]