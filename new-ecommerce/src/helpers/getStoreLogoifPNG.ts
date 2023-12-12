import { useContext } from 'react'
import AuthContext from '../../src/contexts/auth.context'
import { CDN } from '../config/keys'

export function SetStoreLogo() {
    const { store } = useContext(AuthContext)
    const logo = {new : new URL(store?.settings.config_logo || '', CDN.image)}
    if(logo.new){
        return logo.new
    }
}
