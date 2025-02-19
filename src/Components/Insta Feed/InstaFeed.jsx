import React, { useEffect, useState } from 'react';

const InstagramEmbed = ({ url }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const fetchEmbed = async () => {
      const response = await fetch(
        `https://graph.instagram.com/oembed?url=${url}&omitscript=true`
      );
      const data = await response.json();
      setHtml(data.html);
    };

    fetchEmbed();
  }, [url]);

  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [html]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default InstagramEmbed;
