import React from "react";
import { Link } from "../utils/router.jsx";
import { Stars, FaHeart, FaRegHeart, FaShoppingCart, FaClock } from "./Icons.jsx";
import { useWishlist, useCart } from "../context/AppContext.jsx";

export function ProductCard({ product }) {
  const { has, toggle } = useWishlist();
  const { add } = useCart();
  const wished = has(product.id);

  return (
    <div className="card product-card">
      <Link to={`/product/${product.slug}`} aria-label={product.name}>
        <div className="product-media">
          <img src={product.images[0]} alt={product.name} loading="lazy" width="600" height="600" />
          {product.isNew && <span className="product-badge">New</span>}
          {!product.isNew && product.onSale && <span className="product-badge sale">Sale</span>}
          <button
            className={`product-wish ${wished ? "active" : ""}`}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => { e.preventDefault(); toggle(product); }}
          >
            {wished ? <FaHeart /> : <FaRegHeart />}
          </button>
          <div className="quick-add">
            <button
              className="btn btn-primary btn-sm btn-block"
              onClick={(e) => { e.preventDefault(); add(product, 1); }}
            >
              <FaShoppingCart /> Quick Add
            </button>
          </div>
        </div>
      </Link>
      <div className="product-info">
        <div className="product-cat">{product.categoryName}</div>
        <Link to={`/product/${product.slug}`}><div className="product-name">{product.name}</div></Link>
        <div className="product-rating">
          <Stars rating={product.rating} /> <span>{product.rating} ({product.reviews})</span>
        </div>
        <div className="product-price">
          <span className="now">${product.price.toFixed(2)}</span>
          {product.onSale && <span className="was">${product.originalPrice.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton skel-card" />
      <div style={{ padding: 16 }}>
        <div className="skeleton skel-text" style={{ width: "50%" }} />
        <div className="skeleton skel-text" style={{ width: "80%" }} />
        <div className="skeleton skel-text" style={{ width: "40%" }} />
      </div>
    </div>
  );
}

export function ArticleCard({ article }) {
  return (
    <Link to={`/ideas/${article.slug}`} className="card article-card">
      <img src={article.heroImage} alt={article.title} loading="lazy" width="500" height="340" />
      <div className="article-body">
        <div className="article-cat">{article.category}</div>
        <div className="article-title">{article.title}</div>
        <div className="article-meta">
          <span>{article.author}</span> · <span>{article.date}</span> · <span><FaClock size={11} /> {article.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
