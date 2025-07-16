import { useEffect } from 'react';

export function useDynamicFavicon() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 32;
    canvas.height = 32;

    const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    let colorIndex = 0;

    function drawSoccerBall(color: string) {
      if (!ctx) return;
      
      // Limpiar canvas
      ctx.clearRect(0, 0, 32, 32);
      
      // Dibujar la pelota
      ctx.beginPath();
      ctx.arc(16, 16, 14, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Dibujar el patrón de la pelota
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      
      // Líneas del patrón
      ctx.beginPath();
      ctx.moveTo(8, 8);
      ctx.lineTo(24, 8);
      ctx.moveTo(8, 24);
      ctx.lineTo(24, 24);
      ctx.moveTo(8, 8);
      ctx.lineTo(8, 24);
      ctx.moveTo(24, 8);
      ctx.lineTo(24, 24);
      ctx.moveTo(16, 4);
      ctx.lineTo(16, 28);
      ctx.moveTo(4, 16);
      ctx.lineTo(28, 16);
      ctx.stroke();
    }

    function updateFavicon() {
      drawSoccerBall(colors[colorIndex]);
      colorIndex = (colorIndex + 1) % colors.length;
      
      // Convertir canvas a data URL
      const dataURL = canvas.toDataURL();
      
      // Actualizar favicon
      let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = dataURL;
    }

    // Actualizar favicon inmediatamente
    updateFavicon();
    
    // Cambiar color cada 3 segundos
    const interval = setInterval(updateFavicon, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
}
