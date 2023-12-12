import styled from 'styled-components'

export const SyncDocksStyled = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > div:first-child {
    width: 100%;
    max-width: 800px;

    border-radius: 24px;
    background: #fff;
    overflow: hidden;

    display: flex;
    flex-direction: column;
  }

  .sync-docks-stepper {
    background: #fff;

    .MuiStepLabel-label,
    .MuiStepLabel-active,
    .MuiStepIcon-root:not(.MuiStepIcon-completed) {
      color: #adb5bd;
    }

    .MuiStepConnector-completed span {
      border-color: #3e9dff;
    }
  }
`
