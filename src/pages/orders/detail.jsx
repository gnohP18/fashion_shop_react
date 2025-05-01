import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailOrder } from "../../services/order";
import { Card } from "primereact/card";

const screenName = "Chi tiết hoá đơn";

const OrderDetail = () => {
  document.title = screenName;
  const { id } = useParams();
  const [order, setOrder] = useState({});

  useEffect(() => {
    const fetchOrderDetail = async () => {
      await getDetailOrder(id).then((res) => {
        setOrder(res.data);
      });
    };

    fetchOrderDetail();
  }, [id]);

  return (
    <div className="gap-2 w-full flex flex-column">
      <div className="flex flex-row align-items-center">
        <h2 className="flex-1">{screenName}</h2>
      </div>

      <Card>
        <div className="grid">
          <div className="col-6">
            <h2 className="my-0 fw-bold">Hoá đơn</h2>
          </div>
          <div className="col-6 flex flex-column gap-2 text-right">
            <span>Số hoá đơn: {order.orderId}</span>
            <span>Ngày tạo: {order.createdAt}</span>
          </div>

          <div className="col-12">
            <hr />
          </div>
          <div className="col-12">
            <div className="grid">
              <div className="col-4">Email</div>
              <div className="col-4"></div>
            </div>
          </div>
          <div className="col-12">
            <hr />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetail;
