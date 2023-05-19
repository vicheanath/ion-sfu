import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const ProtectedLayout = lazy(() =>
  import("./components/layout/ProtectedLayout")
);

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Box, Container, Spinner } from "@chakra-ui/react";
import { checkPermission } from "./utils/utils";

const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const DashboardPage = lazy(() => import("./pages/dashbordPage"));

const LazyLoad = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  });
  return (
    <Container>
      <Box textAlign="center" mt="100px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    </Container>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LazyLoad />}>
        <Routes>
          <Route element={<ProtectedLayout />}>
            <Route path="" element={<AdminLayout />}>
              <Route path="" element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
