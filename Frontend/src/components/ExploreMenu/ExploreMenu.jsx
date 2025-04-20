import React, { useState } from 'react';
import './ExploreMenu.css';
import menu_1 from '../../assets/menu_1.png';
import menu_2 from '../../assets/menu_2.png';
import menu_3 from '../../assets/menu_3.png';
import menu_4 from '../../assets/menu_4.png';
import menu_5 from '../../assets/menu_5.png';
import menu_6 from '../../assets/menu_6.png';
import menu_7 from '../../assets/menu_7.png';
import menu_8 from '../../assets/menu_8.png';

const menu_list = [
  { menu_image: menu_1, menu_name: "Salad" },
  { menu_image: menu_2, menu_name: "Rolls" },
  { menu_image: menu_3, menu_name: "Deserts" },
  { menu_image: menu_4, menu_name: "Sandwich" },
  { menu_image: menu_5, menu_name: "Cake" },
  { menu_image: menu_6, menu_name: "Pure Veg" },
  { menu_image: menu_7, menu_name: "Pasta" },
  { menu_image: menu_8, menu_name: "Noodles" }
];

const ExploreMenu = ({ category, setCategory }) => {
  const [selectedItem, setSelectedItem] = useState(null); // Initialize as null

  const handleItemClick = (itemName) => {
    if (selectedItem === itemName) {
      setSelectedItem(null); // Deselect if already selected
      setCategory("All"); // Reset category to "All"
    } else {
      setSelectedItem(itemName); // Select the new item
      setCategory(itemName);
    }
  };

  return (
    <div className='explore-menu' id="explore-menu">
      <h1>Explore our Menu</h1>
      <p className='explore-menu-text'>
        Choose your favourite food from your favourite restaurants, featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => (
          <div 
            key={index} 
            className={`explore-menu-list-item ${selectedItem === item.menu_name ? 'active' : ''}`} 
            onClick={() => handleItemClick(item.menu_name)}
          >
            <img src={item.menu_image} alt={item.menu_name} />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreMenu;
