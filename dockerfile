# Imagen de base oficial de node:
FROM node:18-alpine
# Directorio de trabajo:
WORKDIR /desafioTripulacionesG1
#package Json
COPY package*.json ./
#Instalar dependencias
RUN npm install
# copiar el resto del código de la app
COPY . .
#Exponer el puerto en el que corre el backend
EXPOSE 3000
#Encender el back:
CMD ["npm", "start"]
