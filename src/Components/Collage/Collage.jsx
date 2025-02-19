import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Image9 from '../../assets/Images/Photo/PXL_20240816_090150663.jpg';
import Image10 from '../../assets/Images/Photo/PXL_20240820_101255767.jpg';
import Image11 from '../../assets/Images/Photo/PXL_20240820_101300049.jpg';
import Image12 from '../../assets/Images/Photo/PXL_20240820_101309285.MP.jpg';
import Image13 from '../../assets/Images/Photo/PXL_20240820_113032484.MP.jpg';
import Image14 from '../../assets/Images/Photo/PXL_20240821_101810423.MP.jpg';
import Image15 from '../../assets/Images/Photo/PXL_20240821_101813170~2.jpg';
import Image16 from '../../assets/Images/Photo/PXL_20240823_095510242.jpg';
import Image17 from '../../assets/Images/Photo/PXL_20240828_114406207.jpg';
import Image18 from '../../assets/Images/Photo/PXL_20240830_115245290.MP.jpg';
import Image19 from '../../assets/Images/Photo/PXL_20240830_115304520.MP.jpg';
import New1 from '../../assets/Images/S1.png';
import New2 from '../../assets/Images/s2.png';
import New3 from '../../assets/Images/s3.png';
import New4 from '../../assets/Images/s4.png';
import PNG1 from '../../assets/Images/1.png';
import PNG2 from '../../assets/Images/2.png';
import PNG3 from '../../assets/Images/3.png';

export default function MasonryImageList() {
  return (
    <Box sx={{ width: "100%", height: "100%", }}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=248&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

const itemData = [
  { img: Image9, title: 'Image 9' },
  { img: Image10, title: 'Image 10' },
  { img: New1, title: 'Image 19' },
  { img: Image11, title: 'Image 11' },
  { img: PNG3, title: 'Image 19' },
  { img: Image12, title: 'Image 12' },
  { img: Image13, title: 'Image 13' },
  { img: New4, title: 'Image 19' },
  { img: Image14, title: 'Image 14' },
  { img: PNG1, title: 'Image 19' },
  { img: Image15, title: 'Image 15' },
  { img: New2, title: 'Image 19' },
  { img: PNG2, title: 'Image 19' },
  { img: Image16, title: 'Image 16' },
  { img: Image17, title: 'Image 17' },
  { img: Image18, title: 'Image 18' },
  { img: Image19, title: 'Image 19' },
  { img: New3, title: 'Image 19' },
];
