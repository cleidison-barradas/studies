import { Store } from '@mypharma/api-core'
import axios from 'axios'

const { STONE_BASE_URL } = process.env

const api = axios.create({
    baseURL: STONE_BASE_URL, 
})

export const CreateOrder = async(order: any, stone_key:string, store:Store) => {
    try{
        const res = await api.post('/orders', order, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization" : 'Basic ' + stone_key
            }
        })
        if(res.status !== 200){
            console.log("Erro na requisição. Não está com status 200!")
            throw new Error("Erro na requisição.")
        } else{
            console.log("Pegando RES\n")
            return(res)
        }
    } catch(e){
        throw(e)
    }
}