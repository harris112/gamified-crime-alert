import React, {useState, useEffect} from 'react';
import { getShopItems, purchaseItem } from '../api/api'
import Toast from './Toast';
import Swal from 'sweetalert2';

function ShopCard({image_url, uid, ucoins, description, title, coins, due_time, id}) {
  function handlePurchase() {
    if (ucoins < coins) {
      Swal.fire({
        title: "Unable to purchase. You might have insufficient coins.",
        text: "Error.",
        icon: "error",
        timer: 2500
      })
    }
    else {
      purchaseItem(coins, uid)
        .then((res) => {
          Toast.fire({
            icon: 'success',
            title: 'Purchase successful. Further details will be emailed to your later.'
          })
          window.location.reload();
        })
        .catch((error) => {
          Swal.fire({
            title: "Unable to purchase.",
            text: error.message,
            icon: "error",
            timer: 2500
          })
        });
    }
  }

  return (
  <div className="col-sm-3 shop-card">
    <img className="card-img-top shop-card-img" src={image_url} alt={title}/>
    <div className="card-body shop-card-body">
      <h5 className="card-title shop-card-title">{title}</h5>
      <p className="card-text shop-card-text">{description}</p>
      {
        due_time !== null &&
        <p className="card-extra">Avail Until {due_time.toDate().toLocaleString().toString()}</p>
      }
      <button onClick={handlePurchase} className="btn btn-primary shop-btn">{coins} Coins</button>
    </div>
  </div>
  );
}

export default function Shop({user}) {

  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Setting user state if user logged in.
  useEffect(() => {
    getShopItems()
    .then(async (shopDocs) => {
        setShopItems(shopDocs);
        setLoading(false);
      })
      .catch(() => {
        setShopItems([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h3>Shop</h3>
      {
        user &&
        <p className="card-extra">Coins: {user.coins}</p>
      }
      <p>Use your hard-earned coins from crime fighting to avail coupons, discounts and protection gear. </p>

      <div className="row">
      {
        !loading &&

        shopItems.map(({title, description, coins, image_url, due_time, id}) => 
        <ShopCard 
        id={id}
        uid={user && user.uid}
        ucoins={user && user.coins}
        title={title}
        description={description}
        coins={coins}
        image_url={image_url}
        due_time={due_time}
        />
        )
      }
      </div>
    </>
  )
}