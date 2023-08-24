import { Router} from "express";
import ProductManager from "../dao/manager/product.manager.js";
import productModel from '../dao/models/product.model.js'

const router = Router();
const productManager = new ProductManager();




//REGISTER
router.get("/register", (req, res) => {
  res.render("register", {});
});


// Landing Page = LOGIN
router.get('/', (req, res) => {
    res.render('login', {});
});

// Para autenticar
function auth(req, res, next) {
  if (req.session?.user) return next();
  res.redirect("/");
}

// Profile para mostrar una vez autenticado
router.get("/profile", auth, (req, res) => {
  const user = req.session.user;
  console.log('PROBANDO OBJETO USER DE SESSION: ', user);
  res.render("index", { user });
});


// Products Catalog OK
router.get('/products', async (req, res) => {
    const page = parseInt(req.query?.page || 1);
    const limit = parseInt(req.query?.limit || 10);
    const pre_query = {
        name: req.query?.name ,
        code: req.query?.code ,
        stock: req.query?.stock ? {$gt: 0} : 0,
        category: req.query?.category,
    };

    const query = {};

    for (let key in pre_query) {
        if (pre_query[key]) query[key] = pre_query[key];
    };

    const result = await productModel.paginate(query, {
      page,
      limit,
      sort: req.query.price == "Mayor a Menor" ? { price: -1 } : { price: 1 },
      lean: true,
    });

    result.prevLink = result.hasPrevPage
      ? `/products?page=${result.prevPage}&limit=${limit}`
      : "";

    result.nextLink = result.hasNextPage
      ? `/products?page=${result.nextPage}&limit=${limit}`
    : "";
  
  console.log(result)

    //res.render("products_catalog", { products });
    res.render("products_catalog", result);
});


// Edit Product Catalog OK
router.get('/edit-products', async (req, res) => {
    const products = await productModel.find().lean();
    res.render('edit_products', { products })
});



export default router
