import React, { useEffect, useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Card } from "primereact/card";
import {
  createPresignedUploadProductItemUrl,
  createPresignedUploadProductUrl,
} from "../services/mediafile";
import Swal from "sweetalert2";
import { EmptyUrl } from "../constants/common";

const UploadImageWithPreview = ({
  objectId,
  objectType,
  productImage,
  showSweetAlert = true,
  onUploaded,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const fileUploadRef = useRef(null);

  useEffect(() => {
    if (productImage) {
      setImageUrl(productImage);
    }
  }, [productImage]);

  const handleUpload = async ({ files }) => {
    let presignedUrl = "";

    if (!objectId) {
      return;
    }

    const file = files[0];
    const requestPayload = {
      contentType: file.type,
      fileName: file.name,
      fileSize: file.size,
    };

    switch (objectType) {
      case "product":
        const resProduct = await createPresignedUploadProductUrl(
          objectId,
          requestPayload
        );
        presignedUrl = resProduct.data;
        break;
      case "productItem":
        const resProductItem = await createPresignedUploadProductItemUrl(
          objectId,
          requestPayload
        );
        presignedUrl = resProductItem.data;
        break;
      default:
        break;
    }

    if (!presignedUrl) {
      return;
    }

    if (file) {
      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      }).then(() => {
        if (showSweetAlert) {
          Swal.fire({
            title: "Thông báo",
            text: "Tải ảnh lên thành công",
            icon: "success",
          });
        }
      });

      const imageUrl = presignedUrl.split("?")[0];
      setImageUrl(imageUrl);
      if (onUploaded) {
        onUploaded(objectId, imageUrl);
      }
      fileUploadRef.current?.clear();
      fileUploadRef.current?.setUploadedFiles([file]);
    }
  };

  return (
    <Card title="Tải ảnh lên">
      <div className="flex flex-row align-items-center gap-3">
        <div
          className="border border-dashed border-1"
          style={{
            width: "128px",
            height: "128px",
            overflow: "hidden",
            borderRadius: "4px",
          }}
        >
          <img
            src={imageUrl || EmptyUrl}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </div>

        <FileUpload
          ref={fileUploadRef}
          name="image"
          accept="image/*"
          maxFileSize={1000000}
          multiple={false}
          customUpload
          uploadHandler={handleUpload}
          chooseLabel="Chọn ảnh"
          uploadLabel="Tải ảnh lên"
          cancelLabel="Xoá"
          className="w-full"
          pt={{
            uploadButton: { root: { "aria-hidden": false } },
            chooseButton: { root: { "aria-hidden": false } },
            cancelButton: { root: { "aria-hidden": false } },
          }}
        />
      </div>
    </Card>
  );
};

export default UploadImageWithPreview;
