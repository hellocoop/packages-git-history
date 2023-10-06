import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from './buttons.module.css'

import { loginApiRoute } from '../lib/config'

export type Color = "black" | "white"
export type Theme = "ignore-light" | "ignore-dark" | "aware-invert" | "aware-static"
export type Hover = "pop" | "glow" | "flare" | "none"

export interface BaseButtonProps {
    label?: string
    onClick?: any //TBD type: any
    style?: any //TBD type: any
    disabled?: boolean
    showLoader?: boolean
    color?: Color
    theme?: Theme
    hover?: Hover
    targetURI?: string
    providerHint?: string
    scope?: string
    updateScope?: string
}

export interface LoginButtonProps {
    label?: string
    scope?: string
    color?: Color
    theme?: Theme
    hover?: Hover
    providerHint?: string
    targetURI?: string
}

export interface UpdateButtonProps {
    label?: string
    updateScope?: "email" | "picture"
    color?: Color
    theme?: Theme
    hover?: Hover
    providerHint?: string
    targetURI?: string
}

const CLASS_MAPPING = {
    black: {
        "ignore-light": "",
        "ignore-dark": "hello-btn-black-on-dark",
        "aware-invert": "hello-btn-black-and-invert",
        "aware-static": "hello-btn-black-and-static"
    },
    white: {
        "ignore-light": "hello-btn-white-on-light",
        "ignore-dark": "hello-btn-white-on-dark",
        "aware-invert": "hello-btn-white-and-invert",
        "aware-static": "hello-btn-white-and-static"
    },
}

const HOVER_MAPPING = {
    "pop": "",
    "glow": "hello-btn-hover-glow",
    "flare": "hello-btn-hover-flare",
    "none": "hello-btn-hover-none"
}

function BaseButton({ scope, updateScope, targetURI, providerHint, label, style, color = "black", theme = "ignore-light", hover = "pop" } : BaseButtonProps) {
    const helloBtnClass = CLASS_MAPPING[color]?.[theme]

    const [clicked, setClicked] = useState(false)
    const { push } = useRouter()

    const params = new URLSearchParams()
    if(scope)
        params.set("scope", scope)

    targetURI = targetURI || (typeof window != 'undefined' && window.location.pathname) || ""
                             //window can be undefined when running server-side
    params.set("target_uri", targetURI)
    
    if(updateScope)
        params.set("scope", "profile_update " + updateScope)

    if(providerHint)
        params.set("provider_hint", providerHint)

    const onClickHandler = (): void => {
        setClicked(true)
        push(loginApiRoute + "&" + params.toString())
    }

    return (
        <button onClick={onClickHandler} disabled={clicked} style={style} className={`${styles['hello-btn']} ${styles[helloBtnClass]} ${styles[HOVER_MAPPING[hover]]} ${clicked ? styles['hello-btn-loader'] : ''}`}>
           {label}
        </button>
    )
}

export function ContinueButton(props: LoginButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Continue with Hellō" />
}

export function LoginButton(props: LoginButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Log in with Hellō" />
}

export function UpdateEmailButton(props: UpdateButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Update Email with Hellō" updateScope="email" style={{width: '270px'}} />
}

export function UpdatePictureButton(props: UpdateButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Update Picture with Hellō" updateScope="picture" style={{width: '270px'}} />
}

//TBD
// export function UpdateProfileButton() {
//     return <UpdateBaseButton label="ō&nbsp;&nbsp;&nbsp;Update Picture with Hellō" updateScope="profile" />
// }