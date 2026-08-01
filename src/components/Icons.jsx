import React from "react";
import {
  FaCouch, FaBed, FaUtensils, FaBath, FaChair, FaLaptop, FaTree, FaLightbulb,
  FaHeart, FaRegHeart, FaShoppingCart, FaSearch, FaUser, FaBars, FaTimes,
  FaStar, FaStarHalfAlt, FaRegStar, FaChevronLeft, FaChevronRight, FaChevronDown,
  FaCheck, FaCheckCircle, FaTruck, FaShieldAlt, FaBolt, FaGem, FaFacebookF,
  FaInstagram, FaPinterestP, FaYoutube, FaTwitter, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaQuoteLeft, FaMinus, FaPlus, FaTrash, FaEdit, FaPlusCircle,
  FaTachometerAlt, FaBoxOpen, FaNewspaper, FaThLarge, FaLayerGroup, FaImages,
  FaCog, FaSignOutAlt, FaUserShield, FaBold, FaItalic, FaListUl, FaListOl,
  FaLink, FaHeading, FaEye, FaExclamationTriangle, FaInfoCircle, FaArrowRight,
  FaArrowLeft, FaAmazon, FaClock, FaTag, FaFilter,
} from "react-icons/fa";

export const CategoryIcon = ({ icon, ...props }) => {
  const map = {
    sofa: FaCouch, bed: FaBed, kitchen: FaUtensils, bath: FaBath,
    dining: FaChair, office: FaLaptop, outdoor: FaTree, lighting: FaLightbulb,
  };
  const Cmp = map[icon] || FaCouch;
  return <Cmp {...props} />;
};

export const Stars = ({ rating = 0, size = 13 }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="stars" style={{ fontSize: size }}>
      {Array.from({ length: full }).map((_, i) => <FaStar key={"f" + i} />)}
      {half && <FaStarHalfAlt />}
      {Array.from({ length: empty }).map((_, i) => <FaRegStar key={"e" + i} />)}
    </span>
  );
};

export {
  FaHeart, FaRegHeart, FaShoppingCart, FaSearch, FaUser, FaBars, FaTimes,
  FaChevronLeft, FaChevronRight, FaChevronDown, FaCheck, FaCheckCircle, FaTruck,
  FaShieldAlt, FaBolt, FaGem, FaFacebookF, FaInstagram, FaPinterestP, FaYoutube,
  FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaQuoteLeft, FaMinus, FaPlus,
  FaTrash, FaEdit, FaPlusCircle, FaTachometerAlt, FaBoxOpen, FaNewspaper,
  FaThLarge, FaLayerGroup, FaImages, FaCog, FaSignOutAlt, FaUserShield, FaBold,
  FaItalic, FaListUl, FaListOl, FaLink, FaHeading, FaEye, FaExclamationTriangle,
  FaInfoCircle, FaArrowRight, FaArrowLeft, FaAmazon, FaClock, FaTag, FaFilter,
};
