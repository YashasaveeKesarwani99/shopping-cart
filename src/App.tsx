import React from 'react';
import logo from './logo.svg';
import { useState } from 'react';
import { useQuery } from 'react-query';
import axios, { AxiosResponse } from 'axios';
//components
import Cart from './Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';
import Item from './Items/Items'
//styles
import { Wrapper,StyledButton } from './App.styles'
//types
export type CartItemType = {
  id:number;
  category:string;
  title:string;
  price:number;
  description:string;
  image:string;
  amount: number;
} 

function App() {

  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch('https://fakestoreapi.com/products')).json();

  const { data,isLoading,error} = useQuery<CartItemType[]>('products',getProducts)
  
  const getTotalItems = (Items:CartItemType[])=> {
  return Items.reduce((ack: number, item:CartItemType) => ack + item.amount, 0);
  };

  const handleAddToCart=(clickedItem:CartItemType)=>{
    setCartItems(prev => {
      // 1. Is the item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      // First time the item is added
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  }

  const handleRemoveFromCart=(id:number)=>{
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>;

  return (
   <Wrapper>
     <Drawer anchor="right" open={cartOpen} onClose={()=>setCartOpen(false)}>
     <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
     </Drawer>
     <StyledButton>
     <Badge badgeContent={getTotalItems(cartItems)} color='error'onClick={()=>setCartOpen(true)}>
          <AddShoppingCartIcon />
        </Badge>
     </StyledButton>
     <Grid  container spacing={3}>
       {data?.map((item)=>{
         return(
           <Grid item xs={12} sm={4} key={item.id}>
             <Item item={item} handleAddToCart={handleAddToCart}/>
           </Grid>
         )
       })}
     </Grid>
   </Wrapper>
  );
}

export default App;
