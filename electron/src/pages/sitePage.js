import { useQuery } from "react-query";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SiteList from "../modules/site/SiteList";

const sitePage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const data = useQuery("site/site/?" + query.toString());

  useEffect(() => {
    data.refetch();
  }, []);
  return (
    <>
      <SiteList data={data} />
    </>
  );
};
export default sitePage;
