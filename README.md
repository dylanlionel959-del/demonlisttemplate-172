# Maxr3 GDPS Demon List Template

<div align="center">

[![English](https://img.shields.io/badge/Language-English-blue.svg)](#english)
[![Español](https://img.shields.io/badge/Language-Español-green.svg)](#español)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-success.svg)](https://github.com)
[![Geometry Dash](https://img.shields.io/badge/Game-Geometry%20Dash-orange.svg)](https://geometrydash.com/)

</div>

---

<a name="english"></a>
## 🌐 English Documentation

### 🚀 Overview
A fully featured, open-source Geometry Dash Demon List web application inspired by the AREDL (Pointercrate style). It features a desktop layout with a left-aligned list and a wide right-hand detail pane, multi-language support, a dynamic theme color picker with `localStorage` persistence, an integrated demon roulette system, global player leaderboard, and external submission buttons.

### 📦 Installation & Deployment Guide
1. **Download or Clone:** Click the green **Code** button at the top of this repository and select **Download ZIP**, or clone it via Git:
   ```bash
   git clone https://github.com/dylanlionel959-del/demonlisttemplate-172.git demonlist
   ```
2. **Extract & Upload:** Extract the ZIP file on your computer and upload the contents into a new folder (e.g., `demonlist`, `dl`, or any name you prefer) inside your web server's **FTP / SFTP** public directory (such as `public_html/`).

### ⚠️ Important Warning: JSON Syntax
> **WARNING:** Always ensure your JSON files have valid syntax (correct commas, quotation marks, and brackets). A single missing comma or unclosed quote in any level file inside the `database/` folder will break the parser and cause the site to fail to load levels.
> 
> *Tip: If you don't want to modify or write JSON files manually, you can simply ask an AI to format your level data for you!*

### 📄 JSON Code Examples & Structure

#### 1. Level Data File (`database/levelname.json`)
```json
{
  "id": 1,
  "position": 1,
  "name": "LevelName",
  "levelId": "Level ID",
  "publisher": "Creator Name",
  "verifier": "Verifier Name",
  "verificationVideo": "https://youtu.be/XXXXXXXXXXX",
  "points": 100,
  "minProgress": 100,
  "password": "Free To Copy",
  "records": [
    {
      "player": "Player Name",
      "progress": 100,
      "video": "https://youtu.be/XXXXXXXXXXX"
    }
  ]
}
```

#### 2. Main List Index (`database/List.json`)
Simply list your level file names without the `.json` extension in order of difficulty/position:
```json
[
  "LevelName",
  "Flamewall",
  "Bloodbath"
]
```

---
---

<a name="español"></a>
## 🌐 Documentación en Español

### 🚀 Descripción General
Una aplicación web de Demon List de Geometry Dash de código abierto y completamente funcional, inspirada en la AREDL (estilo Pointercrate). Cuenta con un diseño de escritorio (lista a la izquierda, panel de detalles amplio a la derecha), soporte multilingüe, selector de color de tema dinámico con persistencia en `localStorage`, sistema de ruleta de demons integrado, tabla de clasificación global de jugadores y botones de envío externos.

### 📦 Guía de Instalación y Despliegue
1. **Descargar o Clonar:** Haz clic en el botón verde **Code** en la parte superior de este repositorio y selecciona **Download ZIP**, o clónalo mediante Git:
   ```bash
   git clone https://github.com/Maxr3/demonlisttemplate-172.git demonlist
   ```
2. **Descomprimir y Subir:** Extrae el archivo ZIP en tu computadora y sube el contenido dentro de una nueva carpeta (por ejemplo, `demonlist`, `dl` o el nombre que prefieras) en el directorio público **FTP / SFTP** de tu servidor web (como `public_html/`).

### ⚠️ Advertencia Importante: Sintaxis de los JSON
> **ADVERTENCIA:** Asegúrate siempre de que tus archivos JSON tengan una sintaxis válida (comas, comillas y llaves correctas). Una sola coma faltante o una comilla sin cerrar en cualquier archivo de nivel dentro de la carpeta `database/` corromperá el sitio y hará que los niveles dejen de cargar.
> 
> *Consejo: Si no deseas modificar o redactar archivos JSON manualmente de forma tediosa, ¡puedes pedírselo directamente a una Inteligencia Artificial!*

### 📄 Ejemplos de Código JSON y Estructura

#### 1. Archivo de Datos de Nivel (`database/levelname.json`)
```json
{
  "id": 1,
  "position": 1,
  "name": "Nombre del nivel",
  "levelId": "ID del Nivel",
  "publisher": "Nombre del Creador",
  "verifier": "Nombre Del Verificador",
  "verificationVideo": "https://youtu.be/XXXXXXXXXXX",
  "points": 100,
  "minProgress": 100,
  "password": "Free To Copy",
  "records": [
    {
      "player": "Player Name",
      "progress": 100,
      "video": "https://youtu.be/XXXXXXXXXXX"
    }
  ]
}
```

#### 2. Índice Principal de la Lista (`database/List.json`)
Simplemente anota los nombres de los archivos de tus niveles sin la extensión `.json` en orden de dificultad/posición:
```json
[
  "Nombre del nivel",
  "Flamewall",
  "Bloodbath"
]
```
