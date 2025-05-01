import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useEffect, useState } from "react";
import { getListProduct } from "../../services/product";
import { formatVnd } from "../../utils/common";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import {
  OFFSET,
  PAGE,
  PER_PAGE_OPTIONS,
  SORT_BY,
} from "../../constants/pagination";
import { Dropdown } from "primereact/dropdown";
import { getListCategory } from "../../services/category";
import { EmptyUrl } from "../../constants/common";
import { Image } from "primereact/image";

const screenName = "Danh sách sản phẩm";

const Product = () => {
  document.title = screenName;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultParams = {
    Offset: parseInt(searchParams.get("Offset") || OFFSET.toString()),
    Page: parseInt(searchParams.get("Page") || PAGE.toString()),
    SortBy: searchParams.get("SortBy") || SORT_BY.toString(),
    // direction: searchParams.get("direction") || DIRECTION.toString(),
    CategorySlug: searchParams.get("CategorySlug") || null,
    KeySearch: searchParams.get("KeySearch") || null,
  };

  const [params, setParams] = useState(defaultParams);
  const [metaData, setMetaData] = useState({});
  const [products, setProducts] = useState();
  const [categories, setCategories] = useState();
  const [rowClick, setRowClick] = useState(true);
  const [keySearch, setKeySearch] = useState("");
  const [categorySearch, setCategorySearch] = useState();
  const [selectedProducts, setSelectedProducts] = useState(null);

  const imageBodyTemplate = (product) => {
    return (
      <Image
        src={product.imageUrl ?? EmptyUrl}
        alt={product.image}
        className="shadow-2 border-round"
        width="64px"
        height="64px"
        preview
      />
    );
  };

  const priceBodyTemplate = (product) => {
    return <p>{formatVnd(product.price)}</p>;
  };

  const variantBodyTemplate = (product) => {
    return <p>{product.isVariant ? "Có" : "Không"}</p>;
  };

  const actionBodyTemplate = (product) => {
    return (
      <div
        className="flex flex-row w-full"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <i className="pi pi-arrow-right w-full text-end"></i>
      </div>
    );
  };

  const updateParams = (newParams) => {
    const merged = { ...params, ...newParams };
    setParams(merged);

    const filteredParams = Object.fromEntries(
      Object.entries(merged).filter(([_, v]) => v !== null && v !== undefined)
    );

    setSearchParams(filteredParams);
  };

  const searchByCondition = () => {
    const merged = {
      ...defaultParams,
      ...{ CategorySlug: categorySearch, KeySearch: keySearch },
    };

    updateParams(merged);
  };

  const resetSearch = () => {
    setParams(defaultParams);
    navigate({
      pathname: window.location.pathname,
      search: "",
    });
  };

  const fetchProduct = async () => {
    await getListProduct(params).then((res) => {
      setProducts(res.data);
      setMetaData((prev) => ({
        ...prev,
        currentPage: res.currentPage,
        pageSize: res.pageSize,
        total: res.total,
        lastPage: res.lastPage,
      }));
    });
  };

  const fetchCategory = async () => {
    await getListCategory({}).then((res) => {
      setCategories(res.data);
    });
  };

  useEffect(() => {
    fetchCategory({});

    return () => {};
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [params]);

  return (
    <div className="gap-2 w-full flex flex-column">
      <div className="flex flex-row align-items-center">
        <h2 className="flex-1">{screenName}</h2>
        <Button
          icon="pi pi-plus"
          className="gap-2"
          onClick={() => navigate("/products/create")}
        >
          Tạo mới
        </Button>
      </div>
      <Card className="flex flex-column gap-2">
        <div className="flex flex-column md:flex-row md:items-end gap-3 pb-3 flex-wrap">
          <FloatLabel>
            <label htmlFor="key_search">Tìm kiếm theo tên</label>
            <InputText
              id="key_search"
              value={keySearch}
              onChange={(e) => setKeySearch(e.target.value)}
              className="w-full md:w-18rem"
            />
          </FloatLabel>

          {categories && categories.length > 0 ? (
            <Dropdown
              value={categorySearch}
              options={categories}
              showClear
              optionValue="slug"
              optionLabel="name"
              placeholder="Tìm kiếm theo danh mục"
              onChange={(e) => {
                setCategorySearch(e.value);
              }}
              className="w-full md:w-18rem"
            />
          ) : null}

          <Button onClick={searchByCondition}>Tìm kiếm</Button>
          <Button onClick={resetSearch}>Làm mới điều kiện</Button>
        </div>

        <DataTable
          selectionMode={rowClick ? null : "checkbox"}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id"
          value={products}
          tableStyle={{ minWidth: "50rem", width: "100%" }}
          rows={params.Offset}
          totalRecords={metaData.total}
          paginator
          onSort={(e) => {
            updateParams({
              SortBy: e.sortField,
            });
          }}
          rowsPerPageOptions={PER_PAGE_OPTIONS}
          onPage={(e) => {
            updateParams({
              Page: Math.floor(e.first / e.rows) + 1,
              Offset: e.rows,
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
          <Column field="name" header="Tên"></Column>
          <Column field="categoryName" header="Danh mục"></Column>
          <Column field="price" body={priceBodyTemplate} header="Giá"></Column>
          <Column body={variantBodyTemplate} header="Có biến thể"></Column>
          <Column body={actionBodyTemplate} header="Hành động"></Column>
        </DataTable>
      </Card>
    </div>
  );
};

export default Product;
