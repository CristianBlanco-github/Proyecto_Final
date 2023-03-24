import fs from 'fs'
class FileManager{
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
    add=async(obj)=>{
        //ERRORS: -1 duplicated code, -2 missing or invalid field
        const products = await this.read();
        const id = await this.getNextID(products);
        if(products.some(prod => prod.code === obj.code)){
            return -1;
        }
        if (!obj.status) obj.status = true 
        if (!obj.title) return -2
        if (!obj.description) return -2
        if (!obj.code) return -2
        if (!obj.price) return -2
        if (!obj.stock) return -2
        if (!obj.category) return -2
        
        obj.id = id
        products.push(obj)
        await this.write(products)
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
    create = async (obj) => {
        const list = await this.read()
        const nextID = this.getNextID(list)
        const code = this.getCode(list)
        obj.id = nextID
        obj.code = code
        list.push(obj)
        await this.write(list)
        return obj
    }
    getOneByParam = async(param, value) => {
        const data = await this.read()
        const obj = data.find(d => d[param] == value)
    
        return obj
        }
    geById=async(eventID)=>{
        const products=await this.read()
        const event=products.find(product=>product.id==eventID)
        return event ?? -1;
    }
    delete = async (id) => {
        const products=await this.read()
        const buscaElimina = products.find(product => product.id === id)
        if(buscaElimina){
            const index = products.indexOf(buscaElimina)
            products.splice(index, 1);
            await this.write(products)
        } else return -1;
    }
}
export default FileManager