import Button from '@material-ui/core/Button'
//types
import { CartItemType } from '../App'
// styles
import { Wrapper } from './Items.styles'
//props
type props = {
    item:CartItemType;
    handleAddToCart:(clickedItem:CartItemType)=>void;
}

const Item:React.FC<props> = ({item,handleAddToCart})=>{
        return(
            <Wrapper>
                <img src={item.image} alt={item.title} />
                <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <h3>${item.price}</h3>
                </div>
                <Button onClick={() => handleAddToCart(item)}>Add to cart</Button>
            </Wrapper>
        )
}

export default Item