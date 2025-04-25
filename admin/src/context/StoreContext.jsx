import { createContext, useState, useEffect } from "react";
import axios from "axios";


export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    // Hardcoded token for single admin user
    const hardcodedToken = "your_hardcoded_token_here";

    const [token, setToken] = useState(hardcodedToken);
    const [food_list, setFoodList] = useState([]);
    const [loading, setLoading] = useState(false);
     const [isLoggedIn, setIsLoggedIn] = useState(true);


    const url = "https://food-del-backend-2w6e.onrender.com";

    const addToCart = async(itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
        if(token){
            await axios.post(`${url}/api/cart/add`, 
                { itemId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );}
    };

    const removeFromCart = async (itemId) => {
        if (!cartItems[itemId]) return;
    
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1
        }));
    
        if (token) {
            await axios.post(
                `${url}/api/cart/remove`,
                { itemId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        }
    };
    
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const quantity = cartItems[itemId];
            if (quantity > 0) {
                const item = food_list.find(product => product._id === itemId);
                if (item) {
                    totalAmount += item.price * quantity;
                }
            }
        }
        return totalAmount;
    };
    useEffect(() => {
        const fetchFoodList = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}/api/food/list`);
                setFoodList(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching food list:", error);
                setLoading(false);
            }
        };
    
        fetchFoodList();
    }, []);
    
const loadCartData = async (token) => {
    try {
        const response = await axios.get(`${url}/api/cart/get`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.success) {
            setCartItems(response.data.cartData); // Update cart items
        }
    } catch (error) {
        console.error("Failed to load cart data:", error);
    }
};

    useEffect(() => {
        const loadData = async () => {
           // Load food items (optional, if needed elsewhere)

            // Always use hardcoded token
            localStorage.setItem("token", hardcodedToken);
            setToken(hardcodedToken);
            await loadCartData(hardcodedToken); // Load cart from backend
        };

        loadData(); // Trigger loading on component mount
    }, []);

    
    // Set token on login
    const handleSetToken = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setIsLoggedIn(true);
    };

    // Clear token on logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
        setIsLoggedIn(false);
    };

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken: handleSetToken,
        logout: handleLogout,
        isLoggedIn
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
