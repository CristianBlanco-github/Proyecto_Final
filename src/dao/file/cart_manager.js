import fs from "fs"
class CartManager{
    constructor(path){
        this.path=path
    }
    read=()=>{
        if(fs.existsSync(this.path)){
            return fs.promises.readFile(this.path,'utf-8').then(r=>JSON.parse(r))
        }
        return[]
    }
    getNextID=list=>{
        const count=list.length
        return (count>0)?list[count-1].id+1:1
    }
    write=list=>{
        return fs.promises.writeFile(this.path,JSON.stringify(list))
    }
    get=async()=>{
        const data=await this.read()
        return data
    }
    getCartById = list => {
        const count = list.length
        return (count > 0) ? list[count - 1].id + 1 : 1
        
    }
    geById=async(eventID)=>{
        const list=await this.read()
        const event=list.find(product=>product.id==eventID)
        return event ?? -1;
    }
    create=async()=>{
        const cartsList=await this.read()
        const nextID=this.getNextID(cartsList)
        const newCart={
            id:nextID,
            products:[]
        }
        cartsList.push(newCart)
        await this.write(cartsList)
        return newCart
    }
    update=async(id,obj)=>{
        obj.id=id
        const list=await this.read()
        for (let i = 0; i < list.length; i++) {
            if(list[i].id==id){
                list[i]=obj
                await this.write(list)
                break
            }
        }
    }
    addProduct=async(cartID,productID)=>{
        const cart=await this.geById(cartID)
        let found=false
        for (let i = 0; i < cart.products.length; i++) {
            if(cart.products[i].id==productID){
                cart.products[i].quantity++
                found=true
                break
            }
        }
        if(!found){
            cart.products.push({id:productID,quantity:1})
        } 
        await this.update(cartID, cart)
        return cart
    }
}
export default CartManager