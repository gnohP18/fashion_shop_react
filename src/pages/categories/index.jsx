import { Button } from "primereact/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  OFFSET,
  PAGE,
  PER_PAGE_OPTIONS,
  SORT_BY,
} from "../../constants/pagination";
import { useEffect, useRef, useState } from "react";
import {
  getListCategory,
  updateCategory,
  createCategory,
} from "../../services/category";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import FormCategory from "../../components/FormCategory";
import { ActionMode } from "../../constants/common";
import Swal from "sweetalert2";
import { showErrorToasts } from "../../utils/toast";
import { Toast } from "primereact/toast";
import { handleFormatError } from "../../utils/errorHandler";

const screenName = "Danh sách danh mục";

const Category = () => {
  document.title = screenName;

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultParams = {
    Offset: parseInt(searchParams.get("Offset") || OFFSET.toString()),
    Page: parseInt(searchParams.get("Page") || PAGE.toString()),
    SortBy: searchParams.get("SortBy") || SORT_BY.toString(),
    KeySearch: searchParams.get("KeySearch") || null,
  };
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const [metaData, setMetaData] = useState({});
  const [categories, setCategories] = useState();
  const [rowClick, setRowClick] = useState(true);
  const [keySearch, setKeySearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(null);
  const toast = useRef();

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
      ...{ KeySearch: keySearch },
    };

    updateParams(merged);
  };

  const resetSearch = () => {
    setParams(defaultParams);
    setKeySearch("");
    navigate({
      pathname: window.location.pathname,
      search: "",
    });
  };

  const fetchCategory = async () => {
    await getListCategory(params).then((res) => {
      setCategories(res.data);
      setMetaData((prev) => ({
        ...prev,
        currentPage: res.currentPage,
        pageSize: res.pageSize,
        total: res.total,
        lastPage: res.lastPage,
      }));
    });
  };

  useEffect(() => {
    fetchCategory({});

    return () => {};
  }, [params]);

  const actionTemplate = (category) => {
    return (
      <div>
        <div className="flex flex-row gap-4">
          <i
            className="pi pi-pencil"
            onClick={() => handleEditCategory(category)}
          ></i>
          {category.canDelete ? <i className="pi pi-trash"></i> : null}
        </div>
      </div>
    );
  };

  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentMode, setCurrentMode] = useState(ActionMode.Create);

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setCurrentMode(ActionMode.Update);
    setVisible(true);
  };

  const onSubmit = (data) => {
    if (currentMode === ActionMode.Update) {
      updateCategory(currentCategory.id, data)
        .then(() => {
          setVisible(false);
          Swal.fire({
            title: "Thành công",
            text: "Cập nhật danh mục thành công",
            timer: 3000,
          });
          setCurrentCategory(null);
          setCurrentMode(ActionMode.Create);
          window.location.reload();
        })
        .catch((err) => {
          showErrorToasts(toast, handleFormatError(err));
        });
    } else {
      createCategory(data).then(() => {
        setVisible(false);
        Swal.fire({
          title: "Thành công",
          text: "Tạo mới danh mục thành công",
          timer: 3000,
        }).then(() => {
          window.location.reload();
        });
      });
    }
  };

  return (
    <div className="gap-2 w-full flex flex-column">
      <Toast ref={toast} />
      <div className="flex flex-row align-items-center">
        <h2 className="flex-1">{screenName}</h2>
        <Button
          icon="pi pi-plus"
          className="gap-2"
          onClick={() => setVisible(true)}
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

          <Button onClick={searchByCondition}>Tìm kiếm</Button>
          <Button onClick={resetSearch}>Làm mới điều kiện</Button>
        </div>

        <DataTable
          selectionMode={rowClick ? null : "checkbox"}
          selection={selectedCategories}
          onSelectionChange={(e) => setSelectedCategories(e.value)}
          dataKey="id"
          value={categories}
          tableStyle={{ minWidth: "50rem", width: "100%" }}
          rows={params.Offset}
          totalRecords={metaData.total}
          paginator
          onSort={(e) => {
            console.log(e.sortOrder);
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
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column field="id" header="ID"></Column>
          <Column field="name" header="Tên"></Column>
          <Column field="numberOfProduct" header="Số sản phẩm"></Column>
          <Column header="Hành động" body={actionTemplate}></Column>
        </DataTable>
      </Card>

      <Dialog
        header="Tạo danh mục mới"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <FormCategory
          defaultValue={currentCategory}
          mode={currentMode}
          onSubmit={onSubmit}
        />
      </Dialog>
    </div>
  );
};

export default Category;
