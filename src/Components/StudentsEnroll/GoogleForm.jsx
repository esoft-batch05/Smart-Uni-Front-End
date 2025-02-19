import React from 'react';

const GoogleFormEmbed = () => {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSceniB8hIuHC75pgatQCsYNYltC_e8jPodM-gmKFP8twnRjhw/viewform?embedded=true"
        width="640"
        height="800"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        style={{ border: 'none', maxWidth: '100%', maxHeight: '100%' }}
        title="Student Enrollment Form"
      >
        Loading…
      </iframe>
    </div>
  );
};

export default GoogleFormEmbed;
