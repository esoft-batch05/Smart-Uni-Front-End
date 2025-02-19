import React from 'react';
import { Fab } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsAppButton = () => {
  const phoneNumber = '+94717442222'; 

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Fab
      color="success"
      aria-label="whatsapp"
      style={{ position: 'fixed', bottom: 40, right: 40, }}
      onClick={handleWhatsAppClick}
    >
      <WhatsAppIcon />
    </Fab>
  );
};

export default WhatsAppButton;
