FROM ubuntu:latest

RUN useradd -m -s /bin/bash appuser

WORKDIR /app

COPY app.sh /app/

RUN chown -R appuser:appuser /app && chmod +x /app/app.sh

USER appuser

CMD ["/app/app.sh"]
