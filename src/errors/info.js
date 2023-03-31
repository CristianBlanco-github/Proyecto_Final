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
export const generatePropertyError = ({ title, author, code, price, stock }) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title     : needs to be a String, received ${title}
    * author    : needs to be a String, received ${author}
    * code      : needs to be a String, received ${code}
    * price     : needs to be a Number, received ${price}
    * stock     : needs to be a Number, received ${stock}`
}
export const generateNullError = (cartOrProduct) => {
    return `${cartOrProduct} does not exist.`
}