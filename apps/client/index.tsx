import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import {
  AppProvidersContainer,
  AppRootContainer,
  AppRoutesContainerMemo
} from './domains/App/Root/public-api'
import { CssBaseline, ThemeProvider } from '@mui/material'

import { theme } from './styles/theme'

import './styles/mui.overrides.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <HashRouter>
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <AppRootContainer>
          <AppProvidersContainer>
            <AppRoutesContainerMemo />
          </AppProvidersContainer>
        </AppRootContainer>
      </ThemeProvider>
    </CssBaseline>
  </HashRouter>
)
