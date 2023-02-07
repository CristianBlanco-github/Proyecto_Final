import { Router } from "express";
import productModel from "../dao/models/products_model.js";
const router=Router()

router.get('/', async (req, res) =>{
    const limit=req.query?.limit||10
    const page = req.query?.page||1
    const filter = req.query?.filter||''
    //ascendente 1 y descendente -1
    const sort = req.query?.sort || req.body?.sort || "";
    const search={}
    if (filter) {
        search.title=filter
    }
    const options={limit,page,sort: { price: sort || -1 },lean:true}
    const data = await productModel.paginate(search,options)
    // console.log(JSON.stringify(data,null,2,'\t'))

    const user = req.session.user
    res.render('products',{data,user})
})

export default router
