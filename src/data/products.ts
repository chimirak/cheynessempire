import kitImg from "@/assets/images/p-kit.jpg";
import teaTreeImg from "@/assets/images/p-teatree.jpg";
import faceCreamImg from "@/assets/images/p-facecream.jpg";
import caramelImg from "@/assets/images/p-caramel.jpg";
import lotionImg from "@/assets/images/p-lotion.jpg";
import showerGelImg from "@/assets/images/p-showergel.jpg";

export type Category = "Face" | "Body" | "Kits";
export const CATEGORIES: ("All" | Category)[] = ["All", "Face", "Body", "Kits"];

export interface ProductImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** object-position so every crop is intentional */
  position: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  /** null = "Price on request" */
  price: string | null;
  image: ProductImage | null;
  /** Tinted panel behind the card image */
  tint: "ivory" | "rose";
}

export const PRICE_ON_REQUEST = "Price on request";
export const priceLabel = (p: Product) => p.price ?? PRICE_ON_REQUEST;

// Product photos are crops of the client's real product photography (claim text excluded).
// The Anti-Pimples & Spots Kit card should use the client's real kit photo (Image 2) once supplied;
// until then it uses the polished kit render cropped to the products.
export const PRODUCTS: Product[] = [
  {
    id: "anti-pimples-kit",
    name: "Anti-Pimples & Spots Kit",
    category: "Kits",
    description: "A four-piece kit: tea tree facial scrub, face spray, soap bar and spot cream.",
    price: "₦40,000",
    image: {
      src: kitImg,
      width: 773,
      height: 771,
      alt: "The four-piece kit: a pink face spray on an orange soap bar, a green tea tree scrub tube and a white jar of spot cream on marble.",
      position: "45% 50%",
    },
    tint: "ivory",
  },
  {
    id: "tea-tree-scrub",
    name: "Tea Tree Facial Scrub",
    category: "Face",
    description: "Part of the kit, a tea tree facial scrub in a green tube.",
    price: null,
    image: {
      src: teaTreeImg,
      width: 440,
      height: 550,
      alt: "A green tube of tea tree facial scrub in soft daylight.",
      position: "50% 40%",
    },
    tint: "rose",
  },
  {
    id: "face-cream",
    name: "Face Cream",
    category: "Face",
    description: "A white jar with a gold band. A simple daily face cream.",
    price: null,
    image: {
      src: faceCreamImg,
      width: 540,
      height: 675,
      alt: "A white Face Cream jar with a gold band resting on a clear tub, green leaves behind.",
      position: "50% 30%",
    },
    tint: "ivory",
  },
  {
    id: "caramel-mini-kit",
    name: "Caramel Mini Kit",
    category: "Kits",
    description: "The caramel mini kit, with a 250ml lotion.",
    price: null,
    image: {
      src: caramelImg,
      width: 599,
      height: 1170,
      alt: "A white pump bottle labelled Caramel Mini Kit with 250ml lotion, standing on marble.",
      position: "50% 55%",
    },
    tint: "rose",
  },
  {
    id: "body-lotion",
    name: "Body Lotion",
    category: "Body",
    description: "A pink pump-bottle body lotion.",
    price: null,
    image: {
      src: lotionImg,
      width: 385,
      height: 560,
      alt: "The top of a pink pump-bottle body lotion beside soft green leaves.",
      position: "60% 35%",
    },
    tint: "ivory",
  },
  {
    id: "shower-gel",
    name: "Shower Gel",
    category: "Body",
    description: "A luxury shower gel in an orange pump bottle.",
    price: null,
    image: {
      src: showerGelImg,
      width: 345,
      height: 585,
      alt: "A gold pump on an orange shower gel bottle, glinting in warm light.",
      position: "50% 30%",
    },
    tint: "rose",
  },
  {
    id: "glow-oil-stretch-cream",
    name: "Glow Oil & Stretch Mark Cream",
    category: "Body",
    description: "Glow oil and stretch mark cream.",
    price: null,
    image: null,
    tint: "ivory",
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
