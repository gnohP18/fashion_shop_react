import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { EmptyUrl } from "../../constants/common";
import {
  OFFSET,
  PAGE,
  PER_PAGE_OPTIONS,
  SORT_BY,
} from "../../constants/pagination";
import { getListUserThunk } from "../../store/slices/userSlice";
import { useSearchParams } from "react-router-dom";

const User = () => {
  const users = useSelector((state) => state.users.users);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.users.loading);
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultParams = {
    offset: parseInt(searchParams.get("offset") || OFFSET.toString()),
    page: parseInt(searchParams.get("page") || PAGE.toString()),
    sortBy: searchParams.get("sortBy") || SORT_BY.toString(),
    KeySearch: searchParams.get("keySearch") || null,
  };

  const [params, setParams] = useState(defaultParams);

  const imageBodyTemplate = (user) => {
    return (
      <Image
        src={user.imageUrl ?? EmptyUrl}
        alt={user.image}
        className="shadow-2 border-round"
        width="64px"
        height="64px"
        preview
      />
    );
  };

  useEffect(() => {
    console.log(params);

    dispatch(getListUserThunk(params));
  }, [dispatch, params]);

  const updateParams = (newParams) => {
    const merged = { ...params, ...newParams };
    setParams(merged);

    const filteredParams = Object.fromEntries(
      Object.entries(merged).filter(([_, v]) => v !== null && v !== undefined)
    );

    setSearchParams(filteredParams);
  };

  return (
    <Card>
      <DataTable
        loading={isLoading}
        dataKey="id"
        value={users.data}
        tableStyle={{ minWidth: "50rem", width: "100%" }}
        rows={params.offset || OFFSET}
        totalRecords={users.total}
        paginator
        rowsPerPageOptions={PER_PAGE_OPTIONS}
        onPage={(e) => {
          updateParams({
            page: Math.floor(e.first / e.rows) + 1,
            offset: e.rows,
          });
        }}
        lazy
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column field="id" header="ID"></Column>
        <Column body={imageBodyTemplate}></Column>
        <Column field="username" header="Tên đăng nhập"></Column>
        <Column field="phoneNumber" header="Số điện thoại"></Column>
      </DataTable>
    </Card>
  );
};

export default User;
