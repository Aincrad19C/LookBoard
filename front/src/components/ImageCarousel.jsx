// ImageCarousel.js
import React, { Component } from 'react';
import '../style/ImageCarousel.css'; // 引入CSS样式
import image1 from '../images/stars.jpg';
import image2 from '../images/star2.png';
import image3 from '../images/star3.png';
import image4 from '../images/star4.png';
import image5 from '../images/star5.png';

class ImageCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageList: [
        image1,image2,image3,image4,image5
      ],
    };
  }

  render() {
    const { imageList } = this.state;
    return (
      <div className="imgs">
        <ul>
          {imageList.map((image, index) => (
            <li key={index} className="item" style={{ backgroundImage: `url(${image})` }} />
          ))}
        </ul>
      </div>
    );
  }
}

export default ImageCarousel;