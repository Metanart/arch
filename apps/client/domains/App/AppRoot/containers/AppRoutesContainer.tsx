import { FC, memo } from 'react'
import { Route, Routes } from 'react-router-dom'

import { APP_ROUTES } from '../app.routes'

export const AppRoutesContainer: FC = () => (
  <Routes>
    {APP_ROUTES.map(({ id, path, element }) => {
      return <Route key={id} path={path} element={element} />
    })}
  </Routes>
)

export const AppRoutesContainerMemo = memo(AppRoutesContainer)
