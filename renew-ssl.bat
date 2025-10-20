@echo off
echo Renovando certificado SSL...
docker-compose run --rm certbot renew
docker-compose exec veiculooo nginx -s reload
echo Certificado renovado e Nginx recarregado!
