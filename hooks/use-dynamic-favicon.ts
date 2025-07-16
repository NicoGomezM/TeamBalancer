import { useEffect } from 'react';

export function useDynamicFavicon() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 32;
    canvas.height = 32;

    function drawTBFavicon() {
      if (!ctx) return;
      
      // Limpiar canvas
      ctx.clearRect(0, 0, 32, 32);
      
      // Fondo con gradiente sutil
      const gradient = ctx.createLinearGradient(0, 0, 32, 32);
      gradient.addColorStop(0, '#4f46e5'); // Índigo
      gradient.addColorStop(1, '#06b6d4'); // Cyan
      
      // Dibujar fondo circular
      ctx.beginPath();
      ctx.arc(16, 16, 15, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Borde sutil
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Configurar texto
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Dibujar "TB" centrado
      ctx.fillText('TB', 16, 16);
    }

    function updateFavicon() {
      drawTBFavicon();
      
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

    // Actualizar favicon una sola vez (estático)
    updateFavicon();
    
    // No necesitamos interval para favicon estático
    // El favicon se mantiene igual durante toda la sesión
  }, []);
}

// Alias para mantener compatibilidad con el nombre actual
export const useStaticFavicon = useDynamicFavicon;
