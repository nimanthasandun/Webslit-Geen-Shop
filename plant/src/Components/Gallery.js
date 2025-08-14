import React from 'react';
import '../styles/Gallery.css';

const galleryImages = [
  { src: require('../images/home1.jpg') },
  { src: require('../images/home2.jpg') },
  { src: require('../images/home3.jpg') },
  { src: require('../images/home4.jpg')},
  { src: require('../images/home5.jpg')},
  { src: require('../images/home6.jpg')},
];

const Gallery = () => {
  return (
    <section className="gallery-section">
      <div className="gallery-header">
        <h2>Nature’s Touch in Every Leaf</h2>
        <p>Explore our vibrant collection of flowering plants, indoor greens, and healthy veggie starters</p>
      </div>
      <div className="gallery-grid">
        {galleryImages.map((img, index) => (
          <div key={index} className="gallery-item">
            <img src={img.src} alt={img.name} />
            <div className="gallery-caption">{img.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
