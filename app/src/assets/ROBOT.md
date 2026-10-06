# Robot del inicio

`ortegon-robot-hero.webp` conserva el robot de Ortegón de `crm_bot.png`.
Se separó del fondo con la herramienta integrada de generación y edición de imágenes y se optimizó a WebP con transparencia (1000 × 1000).

Instrucción de edición: extraer únicamente el robot existente, su halo y la tablet; conservar cara, pose, proporciones y marca Ortegón; eliminar habitación, escritorio, gráficos y textos de fondo; fondo transparente real, sin nuevos objetos ni Tierra.

El movimiento se implementa en `Hero.css`: flotación vertical y balanceo de la imagen completa, con sombra sincronizada, tarjetas flotantes e inclinación al mover el cursor. No es una animación articulada ni un vídeo. Puede pausarse y respeta la preferencia de movimiento reducido.
