export const generateUserErrorInfoFirstName = () => {
    return `El campo "First Name" se encuentra vacio o es invalido`
}

export const generateUserErrorInfoLastName = () => {
    return `El campo "Last Name" se encuentra vacio o es invalido`
}

export const generateUserErrorInfoAge = () => {
    return `El campo "Age" se encuentra vacio o es invalido`
}

export const generateProdErrorInfo = () => {
    return `El campo "Name" se encuentra vacio o es invalido`
}

export const generateCartErrorInfoStock = (info) => {
    return `El producto deseado se encuentra fuera de stock en estos momentos la cantidad del prod es de "${info.stock}"`
}
export const generateCartErrorInfo = cart =>{
    return `
    Uno o mas properties estan incompletos o son invalidos.
    Lista de properties obligatorios:
    -products: Must be an Array of Products ID(${cart.products})  
    `
}
export const generatePropertyError = ({ title, description, code, price, stock }) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title     : needs to be a String, received ${title}
    * description    : needs to be a String, received ${description}
    * code      : needs to be a String, received ${code}
    * price     : needs to be a Number, received ${price}
    * stock     : needs to be a Number, received ${stock}`
}
export const generateNullError = (cartOrProduct) => {
    return `${cartOrProduct} does not exist.`
}
export const generateUserErrorInfo = user =>{
    return `
    Uno o mas properties estan incompletos o son invalidos.
    Lista de properties obligatorios:
    -first_name: Must be a String(${user.first_name})
    -last_name: Must be a String(${user.last_name})
    -email: Must be a String(${user.email})
    -role: Must be a String(${user.role})
    -password: Must be String(${user.password})
    -age: Must be a Number(${user.age})   
    `
}