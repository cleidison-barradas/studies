import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`

  html,body{
    padding : 0px;
    margin:0px;
    font-family: Poppins,sans-serif;
    font-style: normal;
  }

  :root{
    font-size : 14px;
  }

  *{
    box-sizing : border-box;
    font-family: Poppins,sans-serif;
    padding: 0px;
    margin: 0px;
    font-style: normal;
  }
  
  button,input{
    font-family: Poppins,sans-serif;
    outline: none;
  }

  button:hover{
    cursor: pointer;
  }
  button:disabled{
    cursor: not-allowed;
  }
`
