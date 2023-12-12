import styled from 'styled-components'

export const PopupContainer = styled.div`

  position: fixed;
  min-width: 290px;
  white-space: nowrap;
  top: 88%;
  left: 40%;
  padding: 8px;
  border-radius: 8px;
  color : white;
  background: rgba(0,0,0,1);
  z-index: 99999;
  font-size : 17px;
  left: 50%;
  transform: translateX(-50%);
  @media (max-width: 292px) {
    white-space: normal;
    min-width: 97%;
    max-width: 99%;
    font-size : 15px;
  }
`

export const IOSPopupContainer = styled.div`

  position: fixed;
  min-width: 97%;
  max-width: 99%;
  top: 88%;
  left: 40%;
  padding: 8px;
  border-radius: 8px;
  color : white;
  background: rgba(0,0,0,1);
  z-index: 99999;
  font-size : 16px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 5%;
  @media (max-width: 295px) {
    font-size : 14px;
  }
`