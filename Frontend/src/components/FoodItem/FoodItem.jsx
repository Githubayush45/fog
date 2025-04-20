import React, { useContext } from 'react';
import './FoodItem.css';
import rating_starts from '../../assets/rating_starts.png'; // Importing rating stars image
import icon from '../../assets/add_icon_white.png'; // Importing icon image
import remove_icon from '../../assets/remove_icon_red.png';
import green_icon from '../../assets/add_icon_green.png';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart,url } = useContext(StoreContext);

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={url+"/images/"+image} alt={name} />
        {!cartItems[id] ? (
          <img className='add' onClick={() => addToCart(id)} src={icon} alt="Add to Cart" />
        ) : (
          <div className='food-item-container'>
            <img onClick={() => removeFromCart(id)} src={remove_icon} alt="Remove from Cart" />
            <p>{cartItems[id]}</p>
            <img onClick={() => addToCart(id)} src={green_icon} alt="Add More" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={rating_starts} alt="Rating Stars" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
